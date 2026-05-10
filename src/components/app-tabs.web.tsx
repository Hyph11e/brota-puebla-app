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
import { Pressable, useColorScheme, View, StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton icon="storefront">Tienda</TabButton>
          </TabTrigger>
          <TabTrigger name="gift" href="/gift" asChild>
            <TabButton icon="redeem">Regalar</TabButton>
          </TabTrigger>
          <TabTrigger name="track" href="/track" asChild>
            <TabButton icon="route">Track</TabButton>
          </TabTrigger>
          <TabTrigger name="ops" href="/ops" asChild>
            <TabButton icon="monitoring">Ops</TabButton>
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
  ...props
}: TabTriggerSlotProps & { icon: string }) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
        style={styles.tabButtonView}>
        <SymbolView
          tintColor={isFocused ? '#FFFDF7' : colors.text}
          name={{ ios: 'leaf.fill', web: icon } as SymbolViewProps['name']}
          size={15}
        />
        <ThemedText
          type="small"
          themeColor={isFocused ? 'text' : 'textSecondary'}
          style={isFocused && styles.selectedText}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView type="backgroundElement" style={styles.innerContainer}>
        <ThemedText type="smallBold" style={styles.brandText}>
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
  brandText: {
    marginRight: 'auto',
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    borderRadius: Spacing.two,
  },
  selectedText: {
    color: '#FFFDF7',
  },
});
