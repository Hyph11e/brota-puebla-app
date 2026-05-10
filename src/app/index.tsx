import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AppIcon,
  BrandHeader,
  Chip,
  CTAButton,
  icons,
  MetricTile,
  Page,
  palette,
  PlantCard,
  SectionHeader,
  spacing,
} from '@/components/brota/ui';
import { brand, catalog, deliveryZones, formatMXN, Plant } from '@/data/catalog';
import { useOrder } from '@/state/order';

const categories: ('Todos' | Plant['category'])[] = [
  'Todos',
  'Interior',
  'Regalo',
  'Aromatica',
  'Exterior',
];

export default function StoreScreen() {
  const router = useRouter();
  const { order, startCheckout, toggleCartPlant } = useOrder();
  const [category, setCategory] = useState<(typeof categories)[number]>('Todos');
  const cart = order.cartPlantIds;

  const plants = useMemo(
    () => (category === 'Todos' ? catalog : catalog.filter((plant) => plant.category === category)),
    [category],
  );
  const cartItems = catalog.filter((plant) => cart.includes(plant.id));
  const subtotal = cartItems.reduce((sum, plant) => sum + plant.retailPrice, 0);

  function goToGift() {
    startCheckout();
    router.push('/gift');
  }

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      <SafeAreaView edges={['top']}>
        <Page>
          <BrandHeader subtitle="Entrega Brota Puebla" />

          <View style={styles.hero}>
            <Image source={require('@/assets/images/brota-hero.png')} style={styles.heroImage} contentFit="cover" />
            <View style={styles.heroShade} />
            <View style={styles.heroContent}>
              <View style={styles.heroPill}>
                <AppIcon name={icons.clock} color={palette.lime} size={15} />
                <Text style={styles.heroPillText}>Entregas programadas hoy</Text>
              </View>
              <Text style={styles.heroTitle}>Plantas lindas para hoy</Text>
              <Text style={styles.heroCopy}>{brand.promise}</Text>
              <View style={styles.heroActions}>
                <CTAButton label="Regalar ahora" icon={icons.gift} onPress={goToGift} />
                <CTAButton
                  label="Ver pedido"
                  icon={icons.route}
                  variant="ghost"
                  onPress={() => router.push('/track')}
                />
              </View>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <MetricTile label="Ticket meta" value="$260+" icon={icons.cart} tone="green" />
            <MetricTile label="Entrega" value="Hoy" icon={icons.clock} tone="blue" />
            <MetricTile label="Margen ops" value="50%+" icon={icons.graph} tone="coral" />
          </View>

          <SectionHeader eyebrow="Catalogo vivo" title="Elige por vibe" action="Stock Puebla" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}>
            {categories.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={category === item}
                onPress={() => setCategory(item)}
                icon={item === 'Regalo' ? icons.gift : item === 'Todos' ? icons.spark : icons.leaf}
              />
            ))}
          </ScrollView>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.plantScroller}>
            {plants.map((plant) => (
              <PlantCard
                key={plant.id}
                plant={plant}
                selected={cart.includes(plant.id)}
                onAdd={() => toggleCartPlant(plant.id)}
              />
            ))}
          </ScrollView>

          <SectionHeader eyebrow="Brota cuidado" title="Entrega por ventana programada" />
          <View style={styles.deliveryBand}>
            <View style={styles.deliveryPreview}>
              {['Confirmado', 'Preparando', 'En camino', 'Entregado'].map((step) => (
                <View key={step} style={styles.deliveryStep}>
                  <AppIcon name={step === 'Entregado' ? icons.gift : icons.leaf} color={palette.leaf} size={15} />
                  <Text style={styles.deliveryStepText}>{step}</Text>
                </View>
              ))}
            </View>
            <View style={styles.zoneList}>
              {deliveryZones.slice(0, 3).map((zone) => (
                <View key={zone.name} style={styles.zoneRow}>
                  <View>
                    <Text style={styles.zoneName}>{zone.name}</Text>
                    <Text style={styles.zoneMeta}>{zone.demand} demanda</Text>
                  </View>
                  <Text style={styles.zoneEta}>{zone.deliveryWindow}</Text>
                </View>
              ))}
            </View>
          </View>

          <SectionHeader eyebrow="Paquetes" title="Para vender y regalar mas" />
          <View style={styles.bundleGrid}>
            <View style={styles.bundleCard}>
              <AppIcon name={icons.gift} color={palette.coral} size={24} />
              <Text style={styles.bundleTitle}>Tarjeta con mensaje real</Text>
              <Text style={styles.bundleCopy}>Sin copy acartonado: tonos para crush, cumple, gracias o nuevo depa.</Text>
            </View>
            <View style={styles.bundleCard}>
              <AppIcon name={icons.spark} color={palette.blue} size={24} />
              <Text style={styles.bundleTitle}>QR de cuidado</Text>
              <Text style={styles.bundleCopy}>El regalo sigue vivo con recordatorios de agua, luz y rescate.</Text>
            </View>
          </View>
        </Page>
      </SafeAreaView>

      {cart.length ? (
        <View style={styles.cartBar}>
          <View>
            <Text style={styles.cartLabel}>{cart.length} planta{cart.length > 1 ? 's' : ''} lista{cart.length > 1 ? 's' : ''}</Text>
            <Text style={styles.cartTotal}>{formatMXN(subtotal)}</Text>
          </View>
          <Pressable onPress={goToGift} style={({ pressed }) => [styles.cartButton, pressed && styles.pressed]}>
            <AppIcon name={icons.cart} color={palette.paper} size={18} />
            <Text style={styles.cartButtonText}>Checkout</Text>
          </Pressable>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: palette.paper,
  },
  hero: {
    minHeight: 500,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: palette.forest,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13,34,27,0.38)',
  },
  heroContent: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'flex-end',
    gap: spacing.md,
  },
  heroPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(18,34,28,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  heroPillText: {
    color: palette.paper,
    fontSize: 12,
    fontWeight: '900',
  },
  heroTitle: {
    color: palette.paper,
    fontSize: 45,
    lineHeight: 48,
    fontWeight: '900',
    letterSpacing: 0,
    maxWidth: 420,
  },
  heroCopy: {
    color: '#F5F4EA',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
    maxWidth: 520,
  },
  heroActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
    flexWrap: 'wrap',
  },
  categoryRow: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  plantScroller: {
    gap: spacing.md,
    paddingTop: spacing.sm,
    paddingRight: spacing.lg,
  },
  deliveryBand: {
    gap: spacing.md,
  },
  deliveryPreview: {
    minHeight: 120,
    borderRadius: 8,
    backgroundColor: '#E9F7FB',
    borderWidth: 1,
    borderColor: palette.line,
    padding: spacing.md,
    gap: spacing.sm,
  },
  deliveryStep: {
    minHeight: 42,
    backgroundColor: palette.white,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  deliveryStepText: {
    color: palette.ink,
    fontSize: 13,
    fontWeight: '900',
  },
  zoneList: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: palette.white,
  },
  zoneRow: {
    minHeight: 62,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: palette.line,
    gap: spacing.md,
  },
  zoneName: {
    color: palette.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  zoneMeta: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  zoneEta: {
    color: palette.leaf,
    fontSize: 13,
    fontWeight: '900',
  },
  bundleGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  bundleCard: {
    flex: 1,
    minWidth: 230,
    borderRadius: 8,
    padding: spacing.lg,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.line,
    gap: spacing.sm,
  },
  bundleTitle: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  bundleCopy: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
  },
  cartBar: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
    maxWidth: 820,
    alignSelf: 'center',
    borderRadius: 8,
    backgroundColor: palette.forest,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  cartLabel: {
    color: '#BFE6CA',
    fontSize: 12,
    fontWeight: '800',
  },
  cartTotal: {
    color: palette.paper,
    fontSize: 20,
    fontWeight: '900',
  },
  cartButton: {
    backgroundColor: palette.leaf,
    minHeight: 44,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cartButtonText: {
    color: palette.paper,
    fontSize: 14,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.72,
  },
});
