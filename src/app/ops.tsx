import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AppIcon,
  BrandHeader,
  icons,
  MetricTile,
  Page,
  palette,
  PlantCard,
  SectionHeader,
  spacing,
} from '@/components/brota/ui';
import {
  catalog,
  formatMXN,
  grossMargin,
  landedCost,
  markupOverCost,
  netMarginAfterDelivery,
  netProfitAfterDelivery,
  sourcingNotes,
} from '@/data/catalog';

const starterPlan = [
  { id: 'sansevierias-mix', units: 14 },
  { id: 'pinanona-8', units: 12 },
  { id: 'liston-buena-vibra', units: 12 },
  { id: 'palo-brasil', units: 10 },
  { id: 'suculenta-conchita', units: 18 },
  { id: 'janet-craig-compacta', units: 8 },
  { id: 'aloe-casa', units: 10 },
  { id: 'arbol-abundancia', units: 10 },
  { id: 'monstera-pinanona', units: 4 },
  { id: 'orquidea-64', units: 4 },
];

const planRows = starterPlan
  .map((line) => {
    const plant = catalog.find((item) => item.id === line.id);
    if (!plant) return null;
    return {
      plant,
      units: line.units,
      cost: landedCost(plant) * line.units,
      revenue: plant.retailPrice * line.units,
      profit: netProfitAfterDelivery(plant) * line.units,
    };
  })
  .filter(Boolean) as {
  plant: (typeof catalog)[number];
  units: number;
  cost: number;
  revenue: number;
  profit: number;
}[];

const totalCost = planRows.reduce((sum, item) => sum + item.cost, 0);
const totalRevenue = planRows.reduce((sum, item) => sum + item.revenue, 0);
const totalProfit = planRows.reduce((sum, item) => sum + item.profit, 0);
const avgMargin = Math.round((totalProfit / totalRevenue) * 100);

export default function OpsScreen() {
  const topMargin = [...catalog].sort((a, b) => grossMargin(b) - grossMargin(a)).slice(0, 4);

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      <SafeAreaView edges={['top']}>
        <Page>
          <BrandHeader subtitle="Panel fundador" />

          <View style={styles.hero}>
            <View style={styles.heroCopy}>
              <Text style={styles.eyebrow}>Modelo Puebla</Text>
              <Text style={styles.title}>Venta express con margen bruto diseñado arriba de 50%</Text>
              <Text style={styles.copy}>
                El motor es simple: comprar cerca de productores de Atlixco/Cabrera, subir valor con empaque y
                entrega, y vender plantas faciles de conseguir con rotacion alta.
              </Text>
            </View>
            <View style={styles.heroIcon}>
              <AppIcon name={icons.graph} color={palette.paper} size={38} />
            </View>
          </View>

          <View style={styles.metrics}>
            <MetricTile label="Inversion lote" value={formatMXN(totalCost)} icon={icons.card} tone="blue" />
            <MetricTile label="Venta esperada" value={formatMXN(totalRevenue)} icon={icons.cart} tone="green" />
            <MetricTile label="Utilidad neta" value={formatMXN(totalProfit)} icon={icons.graph} tone="coral" />
            <MetricTile label="Margen neto" value={`${avgMargin}%`} icon={icons.spark} tone="dark" />
          </View>

          <SectionHeader eyebrow="Catalogo rentable" title="Plantas faciles de adquirir" action="No publico" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.plantScroller}>
            {topMargin.map((plant) => (
              <PlantCard key={plant.id} plant={plant} showMargin />
            ))}
          </ScrollView>

          <SectionHeader eyebrow="Lote inicial" title="Compra piloto para validar demanda" />
          <View style={styles.planTable}>
            {planRows.map((row) => (
              <View key={row.plant.id} style={styles.planRow}>
                <View style={styles.planLeft}>
                  <Text style={styles.planPlant}>{row.plant.name}</Text>
                  <Text style={styles.planMeta}>
                    {row.units} pzas · costo unitario {formatMXN(landedCost(row.plant))}
                  </Text>
                </View>
                <View style={styles.planRight}>
                  <Text style={styles.planProfit}>{formatMXN(row.profit)}</Text>
                  <Text style={styles.planMargin}>{grossMargin(row.plant)}% bruto · {netMarginAfterDelivery(row.plant)}% neto</Text>
                </View>
              </View>
            ))}
          </View>

          <SectionHeader eyebrow="Formula" title="Precio que sostiene el 50%+" />
          <View style={styles.formulaGrid}>
            {catalog.slice(0, 6).map((plant) => (
              <View key={plant.id} style={styles.formulaCard}>
                <Text style={styles.formulaTitle}>{plant.name}</Text>
                <Text style={styles.formulaLine}>Compra: {formatMXN(plant.acquisitionCost)}</Text>
                <Text style={styles.formulaLine}>Empaque Brota: {formatMXN(plant.packagingCost)}</Text>
                <Text style={styles.formulaLine}>Reserva entrega: {formatMXN(plant.deliveryReserve)}</Text>
                <Text style={styles.formulaStrong}>Precio: {formatMXN(plant.retailPrice)}</Text>
                <Text style={styles.formulaBadge}>
                  {grossMargin(plant)}% bruto · {netMarginAfterDelivery(plant)}% neto · {markupOverCost(plant)}% markup
                </Text>
                <Text style={styles.formulaLine}>Riesgo: {plant.operationalRisk}</Text>
              </View>
            ))}
          </View>

          <SectionHeader eyebrow="Supply" title="Abastecimiento Puebla" />
          <View style={styles.sourceGrid}>
            {sourcingNotes.map((item) => (
              <View key={item.title} style={styles.sourceCard}>
                <AppIcon name={icons.leaf} color={palette.leaf} size={20} />
                <Text style={styles.sourceTitle}>{item.title}</Text>
                <Text style={styles.sourceCopy}>{item.note}</Text>
              </View>
            ))}
          </View>

          <SectionHeader eyebrow="Crecimiento" title="Loops para Gen Z y regalos" />
          <View style={styles.loopList}>
            {[
              'Codigo QR de cuidado con recordatorios y rescate de planta por WhatsApp.',
              'Foto antes de salir y foto de entrega para compartir en historias.',
              'Drops semanales: menos de $200, anti-estres, nuevo depa, perdon sin cringe.',
              'Equipo Brota con caja ventilada y protocolo de maceta fija para diferenciarse de florerias.',
            ].map((item) => (
              <View key={item} style={styles.loopRow}>
                <AppIcon name={icons.spark} color={palette.coral} size={16} />
                <Text style={styles.loopText}>{item}</Text>
              </View>
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
  hero: {
    borderRadius: 8,
    backgroundColor: palette.forest,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  heroCopy: {
    flex: 1,
    gap: spacing.sm,
  },
  eyebrow: {
    color: palette.lime,
    fontSize: 11,
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
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: palette.leaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metrics: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  plantScroller: {
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
  planTable: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: palette.white,
  },
  planRow: {
    minHeight: 72,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: palette.line,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  planLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  planPlant: {
    color: palette.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  planMeta: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
  },
  planRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  planProfit: {
    color: palette.leaf,
    fontSize: 15,
    fontWeight: '900',
  },
  planMargin: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: '800',
  },
  formulaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  formulaCard: {
    flex: 1,
    minWidth: 220,
    borderRadius: 8,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.line,
    padding: spacing.md,
    gap: spacing.xs,
  },
  formulaTitle: {
    color: palette.ink,
    fontSize: 17,
    fontWeight: '900',
  },
  formulaLine: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  formulaStrong: {
    color: palette.forest,
    fontSize: 14,
    fontWeight: '900',
  },
  formulaBadge: {
    color: palette.coral,
    fontSize: 11,
    fontWeight: '900',
  },
  sourceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  sourceCard: {
    flex: 1,
    minWidth: 220,
    borderRadius: 8,
    backgroundColor: palette.mint,
    borderWidth: 1,
    borderColor: '#B8DEC5',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  sourceTitle: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  sourceCopy: {
    color: palette.forest,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
  },
  loopList: {
    borderRadius: 8,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.line,
  },
  loopRow: {
    minHeight: 62,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: palette.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  loopText: {
    color: palette.ink,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '800',
    flex: 1,
  },
});
