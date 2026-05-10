import { NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      blurEffect="systemUltraThinMaterial"
      iconColor={{ default: colors.textSecondary, selected: colors.text }}
      indicatorColor={colors.backgroundElement}
      shadowColor="rgba(13,34,27,0.12)"
      labelStyle={{
        default: { color: colors.textSecondary, fontSize: 12, fontWeight: '700' },
        selected: { color: colors.text, fontSize: 12, fontWeight: '800' },
      }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Tienda</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="gift">
        <NativeTabs.Trigger.Label>Regalar</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="track">
        <NativeTabs.Trigger.Label>Track</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

    </NativeTabs>
  );
}
