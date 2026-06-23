import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@theme/index';
import { useTaskStore } from '@store/taskStore';

export const OfflineBanner: React.FC = () => {
  const netInfo = useNetInfo();
  const { colors, fonts, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const { isFromCache, pendingCount } = useTaskStore();

  const isOffline = netInfo.isConnected === false;
  const showPending = pendingCount > 0 && !isOffline;

  if (!isOffline && !showPending && !isFromCache) return null;

  const message = isOffline
    ? "You're offline · Changes will sync when you're back"
    : showPending
      ? `Syncing ${pendingCount} pending change${pendingCount === 1 ? '' : 's'}…`
      : 'Showing cached tasks';

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: isOffline ? colors.warningLight : colors.primaryLight,
          paddingTop: insets.top + spacing.xs,
          paddingHorizontal: spacing.md,
          paddingBottom: spacing.sm,
        },
      ]}
    >
      <MaterialCommunityIcons
        name={isOffline ? 'wifi-off' : 'cloud-sync-outline'}
        size={16}
        color={isOffline ? colors.warning : colors.primary}
      />
      <Text
        style={[
          styles.text,
          { color: isOffline ? colors.warning : colors.primary, fontFamily: fonts.label },
        ]}
      >
        {message}
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
