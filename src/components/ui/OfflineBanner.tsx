import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@theme/index';

export const OfflineBanner: React.FC = () => {
  const netInfo = useNetInfo();
  const { colors, fonts, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  // Only show when explicitly disconnected (not during initial unknown state)
  if (netInfo.isConnected !== false) return null;

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: colors.warningLight,
          paddingTop: insets.top + spacing.xs,
          paddingHorizontal: spacing.md,
          paddingBottom: spacing.sm,
        },
      ]}
    >
      <MaterialCommunityIcons name="wifi-off" size={16} color={colors.warning} />
      <Text style={[styles.text, { color: colors.warning, fontFamily: fonts.label }]}>
        You're offline · Changes will sync when you're back
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontSize: 13,
  },
});
