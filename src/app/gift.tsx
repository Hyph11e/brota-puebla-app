import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AppIcon,
  BrandHeader,
  Chip,
  CTAButton,
  icons,
  MiniPlantVisual,
  Page,
  palette,
  PlantCard,
  SectionHeader,
  spacing,
  TimelineStep,
} from '@/components/brota/ui';
import { bundles, catalog, deliveryZones, formatMXN } from '@/data/catalog';
import { getOrderDetails, useOrder } from '@/state/order';

const occasions = ['Crush', 'Cumple', 'Gracias', 'Nuevo depa', 'Perdon'] as const;

const messageByOccasion: Record<(typeof occasions)[number], string> = {
  Crush: 'Vi esta planta y pense: tiene tu energia.',
  Cumple: 'Que este año te brote todo lo bueno.',
  Gracias: 'Gracias por estar. Te mando algo vivo porque lo mereces.',
  'Nuevo depa': 'Para que tu nuevo espacio empiece con verde y buena vibra.',
  Perdon: 'No arregla todo, pero es un comienzo bonito.',
};

export default function GiftScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { order, selectBundle, selectPlant, submitOrder, updateGiftDetails } = useOrder();
  const [occasion, setOccasion] = useState<(typeof occasions)[number]>('Gracias');
  const { bundle, deliveryWindow, plant: selectedPlant, total, zone } = getOrderDetails(order);
  const isMobile = width < 700;
  const isMobileOrTabletWeb = Platform.OS === 'web' && width <= 900;
  const pageBottomInset = isMobile || isMobileOrTabletWeb ? 180 + insets.bottom : 110;

  const giftPlants = useMemo(
    () => catalog.filter((plant) => bundle.plantIds.includes(plant.id)),
    [bundle.plantIds],
  );

  function selectOccasion(next: (typeof occasions)[number]) {
    setOccasion(next);
    updateGiftDetails({ note: messageByOccasion[next] });
    if (next === 'Nuevo depa') selectBundle('nuevo-depa');
    if (next === 'Crush') selectBundle('romance-suave');
    if (next === 'Cumple') selectBundle('cumple-verde');
    if (next === 'Gracias') selectBundle('firma-brota');
    if (next === 'Perdon') selectBundle('cero-drama');
  }

  function sendGift() {
    submitOrder();
    router.push('/track');
  }

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      <SafeAreaView edges={['top']}>
        <Page bottomInset={pageBottomInset}>
          <BrandHeader subtitle="Regalos vivos" />

          <View style={styles.topBand}>
            <View style={styles.topText}>
              <Text style={styles.title}>Un regalo pensado hasta el ultimo detalle</Text>
              <Text style={styles.copy}>
                Elige la intencion, escribe tu mensaje y deja que Brota lo convierta en un gesto elegante.
              </Text>
            </View>
            <View style={styles.topIcon}>
              <AppIcon name={icons.gift} color={palette.paper} size={34} />
            </View>
          </View>

          <SectionHeader eyebrow="1" title="Intencion del regalo" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {occasions.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={occasion === item}
                onPress={() => selectOccasion(item)}
                icon={item === 'Crush' ? icons.spark : icons.gift}
              />
            ))}
          </ScrollView>

          <SectionHeader eyebrow="2" title="Paquete" />
          <View style={styles.bundleList}>
            {bundles.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => {
                  selectBundle(item.id);
                }}
                style={({ pressed }) => [
                  styles.bundleRow,
                  item.id === order.bundleId && styles.bundleRowOn,
                  pressed && styles.pressed,
                ]}>
                <View style={styles.bundleIcon}>
                  <AppIcon name={icons.spark} color={item.id === order.bundleId ? palette.paper : palette.leaf} size={18} />
                </View>
                <View style={styles.bundleText}>
                  <Text style={styles.bundleTitle}>{item.title}</Text>
                  <Text style={styles.bundleCopy}>{item.description}</Text>
                </View>
                <Text style={styles.bundlePrice}>+{formatMXN(item.addOnPrice)}</Text>
              </Pressable>
            ))}
          </View>

          <SectionHeader eyebrow="3" title="Planta sugerida" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.plantScroller}>
            {giftPlants.map((plant) => (
              <PlantCard
                key={plant.id}
                plant={plant}
                selected={plant.id === order.plantId}
                onAdd={() => selectPlant(plant.id)}
              />
            ))}
          </ScrollView>

          <SectionHeader eyebrow="4" title="Mensaje y entrega" />
          <View style={styles.formGrid}>
            <View style={styles.inputBlock}>
              <Text style={styles.inputLabel}>Destinatario</Text>
              <TextInput
                value={order.recipient}
                onChangeText={(recipient) => updateGiftDetails({ recipient })}
                placeholder="Nombre, direccion o referencia"
                placeholderTextColor={palette.muted}
                style={styles.input}
              />
            </View>
            <View style={styles.inputBlock}>
              <Text style={styles.inputLabel}>Zona de entrega</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.zoneScroller}>
                {deliveryZones.map((item) => {
                  const selected = item.name === order.zoneName;

                  return (
                    <Pressable
                      key={item.name}
                      onPress={() => updateGiftDetails({ zoneName: item.name })}
                      style={({ pressed }) => [
                        styles.zoneOption,
                        selected && styles.zoneOptionOn,
                        pressed && styles.pressed,
                      ]}>
                      <Text style={[styles.zoneOptionName, selected && styles.zoneOptionNameOn]}>{item.name}</Text>
                      <Text style={[styles.zoneOptionMeta, selected && styles.zoneOptionMetaOn]}>
                        {item.deliveryWindow} · {formatMXN(item.fee)}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
            <View style={styles.inputBlock}>
              <Text style={styles.inputLabel}>Mensaje</Text>
              <TextInput
                value={order.note}
                onChangeText={(note) => updateGiftDetails({ note })}
                multiline
                placeholder="Escribe algo con tu voz"
                placeholderTextColor={palette.muted}
                style={[styles.input, styles.messageInput]}
              />
            </View>
          </View>

          <View style={styles.previewBand}>
            <View style={styles.previewCard}>
              <Text style={styles.previewEyebrow}>Vista del regalo</Text>
              <MiniPlantVisual plant={selectedPlant} />
              <Text style={styles.previewPlant}>{selectedPlant.name}</Text>
              <Text style={styles.previewNote} numberOfLines={3}>
                {order.note}
              </Text>
            </View>
            <View style={styles.summary}>
              <Text style={styles.summaryTitle}>Resumen del regalo</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{selectedPlant.name}</Text>
                <Text style={styles.summaryValue}>{formatMXN(selectedPlant.retailPrice)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{bundle.title}</Text>
                <Text style={styles.summaryValue}>{formatMXN(bundle.addOnPrice)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Entrega {zone.name}</Text>
                <Text style={styles.summaryValue}>{formatMXN(zone.fee)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Ventana</Text>
                <Text style={styles.summaryValue}>{deliveryWindow}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatMXN(total)}</Text>
              </View>
              <CTAButton label="Enviar regalo" icon={icons.card} onPress={sendGift} />
            </View>
          </View>

          <SectionHeader eyebrow="Entrega" title="Promesa Brota" />
          <View style={styles.timeline}>
            <TimelineStep title="Pedido confirmado" subtitle="Tu regalo queda preparado con tarjeta, empaque y guia de cuidado." active />
            <TimelineStep title="Empaque Brota" subtitle="Maceta limpia, tarjeta, QR de cuidado y foto de salida." active />
            <TimelineStep title="Ruta Brota lista" subtitle={`Entrega programada ${deliveryWindow}, sin maltratar hojas ni flores.`} />
            <TimelineStep title="Foto de entrega" subtitle={`Confirmacion para ${order.recipient || 'tu destinatario'}.`} last />
          </View>
        </Page>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: palette.paper,
  },
  topBand: {
    borderRadius: 8,
    backgroundColor: palette.forest,
    minHeight: 236,
    padding: spacing.xxl,
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: spacing.lg,
    shadowColor: '#0D221B',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 26,
  },
  topText: {
    flex: 1,
    minWidth: 220,
    gap: spacing.sm,
  },
  title: {
    color: palette.paper,
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '900',
    letterSpacing: 0,
  },
  copy: {
    color: '#CFE8D7',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  },
  topIcon: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: palette.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipRow: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  bundleList: {
    gap: spacing.sm,
  },
  bundleRow: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: palette.white,
    minHeight: 78,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    shadowColor: '#0D221B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 18,
  },
  bundleRowOn: {
    backgroundColor: '#F4FAF4',
    borderColor: palette.leaf,
  },
  bundleIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: palette.leaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bundleText: {
    flex: 1,
    gap: 2,
  },
  bundleTitle: {
    color: palette.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  bundleCopy: {
    color: palette.muted,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
  },
  bundlePrice: {
    color: palette.leaf,
    fontSize: 13,
    fontWeight: '900',
  },
  plantScroller: {
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
  formGrid: {
    gap: spacing.md,
  },
  inputBlock: {
    gap: spacing.sm,
  },
  inputLabel: {
    color: palette.ink,
    fontSize: 13,
    fontWeight: '900',
  },
  input: {
    minHeight: 56,
    borderRadius: 8,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.line,
    paddingHorizontal: spacing.lg,
    color: palette.ink,
    fontSize: 15,
    fontWeight: '600',
  },
  zoneScroller: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  zoneOption: {
    minWidth: 196,
    borderRadius: 8,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.line,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  zoneOptionOn: {
    backgroundColor: palette.forest,
    borderColor: palette.forest,
  },
  zoneOptionName: {
    color: palette.ink,
    fontSize: 13,
    fontWeight: '900',
  },
  zoneOptionNameOn: {
    color: palette.paper,
  },
  zoneOptionMeta: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  zoneOptionMetaOn: {
    color: '#CFE8D7',
  },
  messageInput: {
    minHeight: 124,
    paddingTop: spacing.md,
    textAlignVertical: 'top',
  },
  previewBand: {
    marginTop: spacing.xl,
    flexDirection: 'row',
    gap: spacing.lg,
    flexWrap: 'wrap',
  },
  previewCard: {
    flex: 1,
    minWidth: 230,
    minHeight: 326,
    borderRadius: 8,
    padding: spacing.xxl,
    backgroundColor: '#F4F0E8',
    borderWidth: 1,
    borderColor: palette.line,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0D221B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 22,
  },
  previewEyebrow: {
    color: palette.coral,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  previewPlant: {
    color: palette.ink,
    fontSize: 22,
    fontWeight: '900',
    marginTop: spacing.sm,
  },
  previewNote: {
    color: palette.forest,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  summary: {
    flex: 1,
    minWidth: 260,
    borderRadius: 8,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.line,
    padding: spacing.xl,
    gap: 14,
    shadowColor: '#0D221B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 22,
  },
  summaryTitle: {
    color: palette.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  summaryLabel: {
    color: palette.muted,
    fontSize: 13,
    fontWeight: '800',
    flex: 1,
  },
  summaryValue: {
    color: palette.ink,
    fontSize: 13,
    fontWeight: '900',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: palette.line,
    paddingTop: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    color: palette.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  totalValue: {
    color: palette.leaf,
    fontSize: 26,
    fontWeight: '900',
  },
  timeline: {
    borderRadius: 8,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.line,
    padding: spacing.xl,
    shadowColor: '#0D221B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 18,
  },
  pressed: {
    opacity: 0.72,
  },
});
