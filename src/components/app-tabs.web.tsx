import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import React from 'react';
import { Pressable, useColorScheme, useWindowDimensions, View, StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

export default function AppTabs() {
  const { width } = useWindowDimensions();
  const isMobile = width < 700;

  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList mobile={isMobile}>
          <TabTrigger name="home" href="/" asChild>
            <TabButton icon="storefront" mobile={isMobile}>Tienda</TabButton>
          </TabTrigger>
          <TabTrigger name="gift" href="/gift" asChild>
            <TabButton icon="redeem" mobile={isMobile}>Regalar</TabButton>
          </TabTrigger>
          <TabTrigger name="track" href="/track" asChild>
            <TabButton icon="route" mobile={isMobile}>Track</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({
  children,
  isFocused,
  icon,
  mobile,
  ...props
}: TabTriggerSlotProps & { icon: string; mobile?: boolean }) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [mobile && styles.tabButtonPressableMobile, pressed && styles.pressed]}>
      <ThemedView
        type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
        style={[styles.tabButtonView, mobile && styles.tabButtonViewMobile]}>
        <SymbolView
          tintColor={isFocused ? '#FFFDF7' : colors.text}
          name={{ ios: 'leaf.fill', web: icon } as SymbolViewProps['name']}
          size={mobile ? 17 : 15}
        />
        <ThemedText
          type="small"
          themeColor={isFocused ? 'text' : 'textSecondary'}
          style={[mobile && styles.tabButtonTextMobile, isFocused && styles.selectedText]}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList({ mobile, ...props }: TabListProps & { mobile?: boolean }) {
  return (
    <View {...props} style={[styles.tabListContainer, mobile && styles.tabListContainerMobile]}>
      <ThemedView type="backgroundElement" style={[styles.innerContainer, mobile && styles.innerContainerMobile]}>
        <ThemedText type="smallBold" style={[styles.brandText, mobile && styles.brandTextMobile]}>
          Brota
        </ThemedText>

        {props.children}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  tabListContainerMobile: {
    bottom: Spacing.three,
    paddingHorizontal: 18,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
  },
  innerContainerMobile: {
    minHeight: 74,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(18,34,28,0.08)',
    shadowColor: '#0D221B',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.1,
    shadowRadius: 26,
    elevation: 8,
  },
  brandText: {
    marginRight: 'auto',
  },
  brandTextMobile: {
    display: 'none',
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonPressableMobile: {
    flex: 1,
  },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    borderRadius: Spacing.two,
  },
  tabButtonViewMobile: {
    minHeight: 52,
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
    gap: 6,
  },
  tabButtonTextMobile: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '800',
  },
  selectedText: {
    color: '#FFFDF7',
  },
});
