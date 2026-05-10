import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AppIcon,
  BrandHeader,
  CTAButton,
  icons,
  MetricTile,
  MiniPlantVisual,
  Page,
  palette,
  SectionHeader,
  spacing,
  TimelineStep,
} from '@/components/brota/ui';
import { formatMXN } from '@/data/catalog';
import { getOrderDetails, OrderStatus, useOrder } from '@/state/order';

const statusLabels: Record<OrderStatus, string> = {
  confirmed: 'Pedido confirmado',
  preparing: 'Preparando regalo',
  outForDelivery: 'Tu regalo va en camino',
  delivered: 'Entregado con exito',
};

const statusRank: Record<OrderStatus, number> = {
  confirmed: 0,
  preparing: 1,
  outForDelivery: 2,
  delivered: 3,
};

export default function TrackScreen() {
  const router = useRouter();
  const { order } = useOrder();

  if (!order.hasSubmittedOrder) {
    return (
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <SafeAreaView edges={['top']}>
          <Page>
            <BrandHeader subtitle="Estado de pedido" />
            <View style={styles.emptyCard}>
              <View style={styles.emptyIcon}>
                <AppIcon name={icons.gift} color={palette.paper} size={30} />
              </View>
              <Text style={styles.emptyTitle}>Aun no hay un regalo en camino</Text>
              <Text style={styles.emptyCopy}>
                Cuando envies un regalo Brota, aqui veras su fecha, ventana de entrega y confirmacion.
              </Text>
              <View style={styles.emptyActions}>
                <CTAButton label="Armar regalo" icon={icons.gift} onPress={() => router.push('/gift')} />
                <CTAButton label="Ver plantas" icon={icons.leaf} variant="ghost" onPress={() => router.push('/')} />
              </View>
            </View>
          </Page>
        </SafeAreaView>
      </ScrollView>
    );
  }

  const { deliveryWindow, plant, total } = getOrderDetails(order);
  const delivered = order.status === 'delivered';

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      <SafeAreaView edges={['top']}>
        <Page>
          <BrandHeader subtitle="Estado de pedido" />

          <View style={styles.statusBand}>
            <View style={styles.statusText}>
              <Text style={styles.orderId}>Pedido {order.orderId}</Text>
              <Text style={styles.title}>{statusLabels[order.status]}</Text>
              <Text style={styles.copy}>
                Entrega programada para {order.deliveryDate}, de {deliveryWindow}. El equipo Brota cuidara el pedido
                hasta la confirmacion.
              </Text>
            </View>
            <View style={styles.statusBox}>
              <Text style={styles.statusValue}>{delivered ? 'OK' : 'Hoy'}</Text>
              <Text style={styles.statusLabel}>status</Text>
            </View>
          </View>

          <View style={styles.scheduleCard}>
            <View style={styles.scheduleRow}>
              <View style={styles.scheduleIcon}>
                <AppIcon name={icons.clock} color={palette.paper} size={20} />
              </View>
              <View style={styles.scheduleText}>
                <Text style={styles.scheduleLabel}>Fecha y ventana</Text>
                <Text style={styles.scheduleValue}>
                  {order.deliveryDate} · {deliveryWindow}
                </Text>
              </View>
            </View>
            <View style={styles.scheduleRow}>
              <View style={styles.scheduleIconAlt}>
                <AppIcon name={icons.person} color={palette.forest} size={20} />
              </View>
              <View style={styles.scheduleText}>
                <Text style={styles.scheduleLabel}>Equipo Brota</Text>
                <Text style={styles.scheduleValue}>{order.brotaLeadName}</Text>
              </View>
            </View>
            <View style={styles.notesBox}>
              <Text style={styles.scheduleLabel}>Notas de entrega</Text>
              <Text style={styles.notesText}>{order.deliveryNotes}</Text>
            </View>
          </View>

          <View style={styles.metrics}>
            <MetricTile label="Brota" value={order.brotaLeadName} icon={icons.person} tone="green" />
            <MetricTile label="Ventana" value={deliveryWindow} icon={icons.clock} tone="blue" />
            <MetricTile label="Total" value={formatMXN(total)} icon={icons.card} tone="dark" />
          </View>

          <SectionHeader eyebrow="Pedido" title="Lo que viaja" />
          <View style={styles.orderCard}>
            <MiniPlantVisual plant={plant} compact />
            <View style={styles.orderText}>
              <Text style={styles.plantName}>{plant.name}</Text>
              <Text style={styles.plantCopy}>{plant.giftLine}</Text>
              <View style={styles.badges}>
                <Text style={styles.badge}>Tarjeta impresa</Text>
                <Text style={styles.badge}>QR cuidado</Text>
                <Text style={styles.badge}>Foto final</Text>
              </View>
            </View>
          </View>

          <SectionHeader eyebrow="Timeline" title="Del vivero a la puerta" />
          <View style={styles.timeline}>
            <TimelineStep
              title="Pedido confirmado"
              subtitle="Pago recibido, fecha y ventana de entrega guardadas."
              active={statusRank[order.status] >= 0}
            />
            <TimelineStep
              title="Preparando pedido"
              subtitle="Maceta, tarjeta, QR de cuidado y empaque premium."
              active={statusRank[order.status] >= 1}
            />
            <TimelineStep
              title="Tu orden va en camino"
              subtitle={`Equipo Brota listo para la ventana ${deliveryWindow}.`}
              active={statusRank[order.status] >= 2}
            />
            <TimelineStep
              title="Entregado"
              subtitle="Confirmacion y foto final para el comprador."
              active={statusRank[order.status] >= 3}
              last
            />
          </View>

          <SectionHeader eyebrow="Confirmacion" title="Entrega del regalo" />
          <View style={styles.confirmationCard}>
            <AppIcon name={delivered ? icons.spark : icons.clock} color={delivered ? palette.coral : palette.leaf} size={22} />
            <View style={styles.confirmationText}>
              <Text style={styles.confirmationTitle}>
                {delivered ? 'Entregado con confirmacion' : 'Pendiente de entrega'}
              </Text>
              <Text style={styles.confirmationCopy}>
                {delivered
                  ? 'La confirmacion de entrega y foto final ya estan disponibles.'
                  : 'Cuando el equipo Brota cierre la entrega, aqui aparecera la confirmacion y la foto final.'}
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <CTAButton label="Compartir pedido" icon={icons.gift} onPress={() => router.push('/track')} />
            <CTAButton label="Mandar otro regalo" icon={icons.gift} variant="ghost" onPress={() => router.push('/gift')} />
          </View>

          <SectionHeader eyebrow="Cuidado Brota" title="Protocolo anti-hojas rotas" />
          <View style={styles.protocol}>
            {['Caja ventilada', 'Maceta fija', 'No sol directo', 'Foto antes/despues'].map((item) => (
              <Pressable key={item} style={({ pressed }) => [styles.protocolItem, pressed && styles.pressed]}>
                <AppIcon name={icons.leaf} color={palette.leaf} size={16} />
                <Text style={styles.protocolText}>{item}</Text>
              </Pressable>
            ))}
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
  emptyCard: {
    minHeight: 460,
    borderRadius: 8,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.line,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: palette.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: palette.ink,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0,
  },
  emptyCopy: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '700',
    textAlign: 'center',
    maxWidth: 360,
  },
  emptyActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  statusBand: {
    borderRadius: 8,
    padding: spacing.xl,
    backgroundColor: palette.forest,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  statusText: {
    flex: 1,
    gap: spacing.sm,
  },
  orderId: {
    color: palette.lime,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: palette.paper,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '900',
    letterSpacing: 0,
  },
  copy: {
    color: '#D6EBDD',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '700',
  },
  statusBox: {
    width: 82,
    minHeight: 82,
    borderRadius: 8,
    backgroundColor: palette.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusValue: {
    color: palette.forest,
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 36,
  },
  statusLabel: {
    color: palette.forest,
    fontSize: 13,
    fontWeight: '900',
  },
  scheduleCard: {
    marginTop: spacing.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: palette.white,
    padding: spacing.lg,
    gap: spacing.md,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  scheduleIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: palette.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleIconAlt: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: palette.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleText: {
    flex: 1,
  },
  scheduleLabel: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  scheduleValue: {
    color: palette.ink,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },
  notesBox: {
    borderRadius: 8,
    backgroundColor: palette.mint,
    padding: spacing.md,
  },
  notesText: {
    color: palette.forest,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  metrics: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  orderCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: palette.white,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  orderText: {
    flex: 1,
    gap: spacing.xs,
  },
  plantName: {
    color: palette.ink,
    fontSize: 21,
    fontWeight: '900',
  },
  plantCopy: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  badge: {
    backgroundColor: palette.mint,
    color: palette.forest,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    fontSize: 11,
    fontWeight: '900',
  },
  timeline: {
    borderRadius: 8,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.line,
    padding: spacing.lg,
  },
  confirmationCard: {
    borderRadius: 8,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.line,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  confirmationText: {
    flex: 1,
  },
  confirmationTitle: {
    color: palette.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  confirmationCopy: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  actions: {
    marginTop: spacing.xl,
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  protocol: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  protocolItem: {
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.line,
    paddingHorizontal: spacing.md,
    backgroundColor: palette.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  protocolText: {
    color: palette.ink,
    fontSize: 13,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.72,
  },
});
