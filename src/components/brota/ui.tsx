import { Image } from 'expo-image';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import {
  formatMXN,
  grossMargin,
  landedCost,
  netMarginAfterDelivery,
  netProfitAfterDelivery,
  Plant,
} from '@/data/catalog';

export const palette = {
  ink: '#111A17',
  forest: '#102E22',
  leaf: '#1B8A5A',
  lime: '#D8F27A',
  coral: '#C9624D',
  blue: '#2F6F7E',
  mint: '#EDF6EF',
  paper: '#FAF8F1',
  cloud: '#F3F0E7',
  line: '#E2DED3',
  muted: '#6F756D',
  white: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

type SymbolName = {
  ios: string;
  android?: string;
  web?: string;
};

export function AppIcon({
  name,
  color = palette.ink,
  size = 18,
}: {
  name: SymbolName;
  color?: string;
  size?: number;
}) {
  const symbolName = {
    ios: name.ios,
    android: name.android ?? name.ios,
    web: name.web ?? name.ios,
  } as SymbolViewProps['name'];

  return (
    <SymbolView
      name={symbolName}
      size={size}
      tintColor={color}
    />
  );
}

export const icons = {
  leaf: { ios: 'leaf.fill', android: 'eco', web: 'leaf' },
  gift: { ios: 'gift.fill', android: 'redeem', web: 'redeem' },
  cart: { ios: 'bag.fill', android: 'shopping_bag', web: 'shopping_bag' },
  location: { ios: 'location.fill', android: 'location_on', web: 'location_on' },
  clock: { ios: 'clock.fill', android: 'schedule', web: 'schedule' },
  spark: { ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' },
  route: { ios: 'point.topleft.down.curvedto.point.bottomright.up', android: 'route', web: 'route' },
  person: { ios: 'person.crop.circle.fill', android: 'account_circle', web: 'account_circle' },
  card: { ios: 'creditcard.fill', android: 'credit_card', web: 'credit_card' },
  graph: { ios: 'chart.line.uptrend.xyaxis', android: 'monitoring', web: 'monitoring' },
  plus: { ios: 'plus', android: 'add', web: 'add' },
  chevron: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
};

export function BrandHeader({ subtitle }: { subtitle?: string }) {
  return (
    <View style={styles.brandHeader}>
      <View style={styles.brandLeft}>
        <Image source={require('@/assets/images/brota-icon.png')} style={styles.brandLogo} />
        <View>
          <Text style={styles.brandName}>Brota</Text>
          <Text style={styles.brandSubtitle}>{subtitle ?? 'Puebla en verde'}</Text>
        </View>
      </View>
      <View style={styles.headerChip}>
        <AppIcon name={icons.location} color={palette.leaf} size={15} />
        <Text style={styles.headerChipText}>Puebla</Text>
      </View>
    </View>
  );
}

export function Page({
  children,
  bottomInset = 110,
}: {
  children: React.ReactNode;
  bottomInset?: number;
}) {
  return (
    <View style={styles.page}>
      <View style={[styles.pageInner, { paddingBottom: bottomInset }]}>{children}</View>
    </View>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {action ? (
        <View style={styles.sectionAction}>
          <Text style={styles.sectionActionText}>{action}</Text>
          <AppIcon name={icons.chevron} size={14} color={palette.leaf} />
        </View>
      ) : null}
    </View>
  );
}

export function Chip({
  label,
  selected,
  onPress,
  icon,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: SymbolName;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.chip, selected && styles.chipOn, pressed && styles.pressed]}>
      {icon ? <AppIcon name={icon} color={selected ? palette.paper : palette.leaf} size={14} /> : null}
      <Text style={[styles.chipText, selected && styles.chipTextOn]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

export function CTAButton({
  label,
  icon = icons.chevron,
  onPress,
  variant = 'primary',
  style,
}: {
  label: string;
  icon?: SymbolName;
  onPress?: () => void;
  variant?: 'primary' | 'ghost' | 'dark';
  style?: ViewStyle;
}) {
  const isGhost = variant === 'ghost';
  const isDark = variant === 'dark';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.cta,
        isGhost && styles.ctaGhost,
        isDark && styles.ctaDark,
        pressed && styles.pressed,
        style,
      ]}>
      <Text style={[styles.ctaText, isGhost && styles.ctaGhostText]}>{label}</Text>
      <View style={[styles.ctaIcon, isGhost && styles.ctaGhostIcon]}>
        <AppIcon name={icon} color={isGhost ? palette.leaf : palette.paper} size={15} />
      </View>
    </Pressable>
  );
}

export function MiniPlantVisual({ plant, compact }: { plant: Plant; compact?: boolean }) {
  return (
    <View style={[styles.plantVisual, compact && styles.plantVisualCompact]}>
      <View style={[styles.leafLeft, { backgroundColor: plant.color }]} />
      <View style={[styles.leafRight, { backgroundColor: plant.accent }]} />
      <View style={[styles.leafCenter, { backgroundColor: plant.color }]} />
      <View style={[styles.pot, { backgroundColor: plant.accent }]} />
    </View>
  );
}

export function PlantCard({
  plant,
  onAdd,
  selected,
  showMargin,
}: {
  plant: Plant;
  onAdd?: () => void;
  selected?: boolean;
  showMargin?: boolean;
}) {
  return (
    <View style={[styles.plantCard, selected && styles.plantCardSelected]}>
      <View style={styles.plantArtStage}>
        <MiniPlantVisual plant={plant} />
      </View>
      <View style={styles.plantTitleBlock}>
        <Text style={[styles.plantCategory, plant.hero && styles.plantCategoryHero]}>
          {plant.hero ? 'Firma Brota' : plant.category}
        </Text>
        <Text style={styles.plantName}>{plant.name}</Text>
      </View>
      <Text style={styles.plantNickname}>{plant.nickname}</Text>
      <Text style={styles.plantCare} numberOfLines={2}>
        {plant.care}
      </Text>
      <Text style={styles.plantMeta} numberOfLines={2}>
        {plant.light} · {plant.careDifficulty}
      </Text>
      <View style={styles.tagRow}>
        <View style={styles.smallTag}>
          <AppIcon name={icons.clock} color={palette.leaf} size={12} />
          <Text style={styles.smallTagText}>{plant.water}</Text>
        </View>
        <View style={styles.smallTag}>
          <AppIcon name={icons.leaf} color={palette.leaf} size={12} />
          <Text style={styles.smallTagText}>{plant.petFriendly}</Text>
        </View>
      </View>
      <Text style={styles.giftFit} numberOfLines={2}>
        {plant.giftSuitability}
      </Text>
      <Text style={styles.presentationLine} numberOfLines={2}>
        {plant.presentation}
      </Text>
      {showMargin ? (
        <View style={styles.marginStrip}>
          <Text style={styles.marginText}>Costo {formatMXN(landedCost(plant))}</Text>
          <Text style={styles.marginStrong}>Bruto {grossMargin(plant)}% · Neto {netMarginAfterDelivery(plant)}%</Text>
        </View>
      ) : null}
      <View style={styles.priceRow}>
        <View>
          <Text style={styles.price}>{formatMXN(plant.retailPrice)}</Text>
          {showMargin ? <Text style={styles.profit}>+{formatMXN(netProfitAfterDelivery(plant))}</Text> : null}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Elegir ${plant.name}`}
          onPress={onAdd}
          style={({ pressed }) => [styles.addButton, selected && styles.addButtonSelected, pressed && styles.pressed]}>
          <AppIcon name={selected ? icons.cart : icons.plus} color={palette.paper} size={16} />
        </Pressable>
      </View>
    </View>
  );
}

export function MetricTile({
  label,
  value,
  tone = 'green',
  icon,
}: {
  label: string;
  value: string;
  tone?: 'green' | 'coral' | 'blue' | 'dark';
  icon?: SymbolName;
}) {
  const background =
    tone === 'coral' ? '#FFF0EC' : tone === 'blue' ? '#E9F7FB' : tone === 'dark' ? palette.forest : palette.mint;
  const foreground = tone === 'dark' ? palette.paper : palette.ink;
  return (
    <View style={[styles.metricTile, { backgroundColor: background }]}>
      <View style={styles.metricTop}>
        {icon ? <AppIcon name={icon} color={tone === 'dark' ? palette.lime : palette.leaf} size={18} /> : null}
        <Text style={[styles.metricLabel, { color: foreground }]}>{label}</Text>
      </View>
      <Text style={[styles.metricValue, { color: foreground }]}>{value}</Text>
    </View>
  );
}

export function TimelineStep({
  title,
  subtitle,
  active,
  last,
}: {
  title: string;
  subtitle: string;
  active?: boolean;
  last?: boolean;
}) {
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineRail}>
        <View style={[styles.timelineDot, active && styles.timelineDotActive]} />
        {!last ? <View style={[styles.timelineLine, active && styles.timelineLineActive]} /> : null}
      </View>
      <View style={styles.timelineTextBlock}>
        <Text style={styles.timelineTitle}>{title}</Text>
        <Text style={styles.timelineSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: palette.paper,
  },
  pageInner: {
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingTop: spacing.lg,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  brandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  brandLogo: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: palette.paper,
  },
  brandName: {
    color: palette.ink,
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: 0,
  },
  brandSubtitle: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  headerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: palette.mint,
  },
  headerChipText: {
    color: palette.forest,
    fontSize: 12,
    fontWeight: '800',
  },
  sectionHeader: {
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  eyebrow: {
    color: palette.coral,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: palette.ink,
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '900',
    letterSpacing: 0,
  },
  sectionAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sectionActionText: {
    color: palette.leaf,
    fontSize: 12,
    fontWeight: '800',
  },
  chip: {
    minHeight: 42,
    paddingHorizontal: 14,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: palette.white,
  },
  chipOn: {
    backgroundColor: palette.forest,
    borderColor: palette.forest,
  },
  chipText: {
    color: palette.ink,
    fontSize: 13,
    fontWeight: '800',
  },
  chipTextOn: {
    color: palette.paper,
  },
  cta: {
    minHeight: 52,
    borderRadius: 8,
    backgroundColor: palette.leaf,
    paddingLeft: 18,
    paddingRight: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  ctaDark: {
    backgroundColor: palette.forest,
  },
  ctaGhost: {
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.line,
  },
  ctaText: {
    color: palette.paper,
    fontSize: 15,
    fontWeight: '900',
    flexShrink: 1,
  },
  ctaGhostText: {
    color: palette.ink,
  },
  ctaIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaGhostIcon: {
    backgroundColor: palette.mint,
  },
  plantVisual: {
    width: 112,
    height: 120,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  plantVisualCompact: {
    width: 72,
    height: 76,
  },
  leafLeft: {
    position: 'absolute',
    width: '34%',
    height: '38%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 32,
    left: '20%',
    bottom: '34%',
    transform: [{ rotate: '-28deg' }],
  },
  leafRight: {
    position: 'absolute',
    width: '38%',
    height: '46%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 38,
    borderBottomLeftRadius: 38,
    borderBottomRightRadius: 4,
    right: '17%',
    bottom: '39%',
    transform: [{ rotate: '22deg' }],
  },
  leafCenter: {
    position: 'absolute',
    width: '27%',
    height: '48%',
    borderRadius: 32,
    bottom: '42%',
    opacity: 0.92,
  },
  pot: {
    width: '56%',
    height: '27%',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  plantCard: {
    width: 248,
    minHeight: 430,
    borderRadius: 8,
    padding: 18,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: '#E8E1D5',
    shadowColor: '#0D221B',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.06,
    shadowRadius: 22,
  },
  plantCardSelected: {
    borderColor: palette.leaf,
    backgroundColor: '#F4FAF4',
  },
  plantArtStage: {
    minHeight: 150,
    borderRadius: 8,
    backgroundColor: '#F6F1E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  plantTitleBlock: {
    gap: 2,
  },
  plantCategory: {
    color: palette.coral,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  plantCategoryHero: {
    color: palette.leaf,
  },
  plantName: {
    color: palette.ink,
    fontSize: 22,
    lineHeight: 25,
    fontWeight: '900',
    maxWidth: 202,
    letterSpacing: 0,
  },
  plantNickname: {
    marginTop: spacing.sm,
    color: palette.forest,
    fontSize: 13,
    fontWeight: '900',
  },
  plantCare: {
    marginTop: spacing.xs,
    minHeight: 44,
    color: palette.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
  plantMeta: {
    marginTop: spacing.xs,
    color: palette.forest,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '800',
  },
  tagRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
    marginTop: spacing.md,
  },
  smallTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#F8F5EE',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  smallTagText: {
    color: palette.ink,
    fontSize: 10,
    fontWeight: '800',
  },
  giftFit: {
    marginTop: spacing.sm,
    color: palette.coral,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '900',
  },
  presentationLine: {
    marginTop: spacing.sm,
    color: palette.forest,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
  },
  marginStrip: {
    marginTop: spacing.sm,
    backgroundColor: '#F8F1DA',
    borderRadius: 8,
    padding: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  marginText: {
    color: palette.muted,
    fontSize: 10,
    fontWeight: '700',
  },
  marginStrong: {
    color: palette.forest,
    fontSize: 10,
    fontWeight: '900',
  },
  priceRow: {
    marginTop: 'auto',
    paddingTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  price: {
    color: palette.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  profit: {
    color: palette.leaf,
    fontSize: 11,
    fontWeight: '900',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: palette.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonSelected: {
    backgroundColor: palette.leaf,
  },
  metricTile: {
    flex: 1,
    minWidth: 142,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(17,26,23,0.06)',
    padding: spacing.lg,
  },
  metricTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '800',
  },
  metricValue: {
    marginTop: spacing.sm,
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 0,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 76,
  },
  timelineRail: {
    width: 18,
    alignItems: 'center',
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: palette.line,
    backgroundColor: palette.white,
  },
  timelineDotActive: {
    borderColor: palette.leaf,
    backgroundColor: '#CFEFBE',
  },
  timelineLine: {
    flex: 1,
    width: 2,
    marginTop: spacing.xs,
    backgroundColor: palette.line,
  },
  timelineLineActive: {
    backgroundColor: palette.leaf,
  },
  timelineTextBlock: {
    flex: 1,
    paddingBottom: spacing.lg,
  },
  timelineTitle: {
    color: palette.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  timelineSubtitle: {
    color: palette.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: spacing.xs,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.72,
  },
});
