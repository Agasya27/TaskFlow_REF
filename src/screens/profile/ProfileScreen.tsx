import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, useThemeMode } from '@theme/index';
import { Avatar } from '@components/ui/Avatar';
import { Button } from '@components/ui/Button';
import { AppWordmark } from '@components/ui/AppWordmark';
import { useAuthStore } from '@store/authStore';
import { useTaskStore } from '@store/taskStore';
import { useNotificationStore } from '@store/notificationStore';
import { useToast } from '@components/ui/Toast';

export const ProfileScreen: React.FC = () => {
  const { colors, fonts, spacing, radius, shadows, gradients } = useTheme();
  const { isDark, toggleTheme } = useThemeMode();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const tasks = useTaskStore((s) => s.tasks);
  const { enabled: notificationsOn, isHydrated, isUpdating, setEnabled } = useNotificationStore();
  const { show: showToast } = useToast();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const handleLogout = async () => {
    await logout();
  };

  const handleNotificationsToggle = async (next: boolean) => {
    const pendingCount = tasks.filter((task) => !task.completed).length;
    const result = await setEnabled(next, pendingCount);

    if (!result.ok && result.message) {
      showToast(result.message, 'error');
    } else if (result.ok && next) {
      showToast('Notifications enabled', 'success');
    }
  };

  const stats = [
    { label: 'Total', value: totalTasks },
    { label: 'Completed', value: completedTasks },
    { label: 'Pending', value: pendingTasks },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}
      showsVerticalScrollIndicator={false}
    >
      {isDark ? (
        <View style={[styles.hero, { paddingTop: insets.top + spacing.lg, backgroundColor: colors.surface }]}>
          <AppWordmark size="lg" />
          <Avatar name={user?.name ?? 'User'} size={84} />
          <Text style={[styles.name, { color: colors.textPrimary, fontFamily: fonts.heading }]}>
            {user?.name ?? 'User'}
          </Text>
          <Text style={[styles.email, { color: colors.textSecondary, fontFamily: fonts.body }]}>
            {user?.email ?? ''}
          </Text>
        </View>
      ) : (
        <LinearGradient
          colors={[...gradients.primarySoft]}
          style={[styles.hero, { paddingTop: insets.top + spacing.lg }]}
        >
          <AppWordmark size="lg" onLightBackground />
          <Avatar name={user?.name ?? 'User'} size={84} />
          <Text style={[styles.name, { color: colors.textPrimary, fontFamily: fonts.heading }]}>
            {user?.name ?? 'User'}
          </Text>
          <Text style={[styles.email, { color: colors.textSecondary, fontFamily: fonts.body }]}>
            {user?.email ?? ''}
          </Text>
        </LinearGradient>
      )}

      <View
        style={[
          styles.statsCard,
          {
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            marginHorizontal: spacing.md,
            marginTop: -spacing.lg,
            borderColor: colors.border,
            ...shadows.card,
          },
        ]}
      >
        {stats.map((stat, i) => (
          <React.Fragment key={stat.label}>
            {i > 0 ? (
              <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
            ) : null}
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary, fontFamily: fonts.heading }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                {stat.label}
              </Text>
            </View>
          </React.Fragment>
        ))}
      </View>

      <View
        style={[
          styles.settingsCard,
          {
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            marginHorizontal: spacing.md,
            marginTop: spacing.lg,
            borderColor: colors.border,
            ...shadows.card,
          },
        ]}
      >
        <SettingRow
          icon="bell-outline"
          label="Notifications"
          borderColor={colors.divider}
          right={
            <Switch
              value={notificationsOn}
              onValueChange={handleNotificationsToggle}
              disabled={!isHydrated || isUpdating}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={notificationsOn ? colors.primary : colors.textDisabled}
            />
          }
        />
        <SettingRow
          icon="weather-night"
          label="Dark Mode"
          borderColor={colors.divider}
          right={
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={isDark ? colors.primary : colors.textDisabled}
            />
          }
        />
        <SettingRow
          icon="information-outline"
          label="About TaskFlow"
          borderColor={colors.divider}
          last
          right={
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.body, fontSize: 14 }}>
              v1.0.0
            </Text>
          }
        />
      </View>

      <View style={{ marginHorizontal: spacing.md, marginTop: spacing.xl }}>
        <Button
          label="Sign Out"
          variant="danger"
          onPress={() => setShowLogoutConfirm(true)}
          fullWidth
          size="lg"
        />

        {showLogoutConfirm ? (
          <Animated.View
            entering={FadeInDown.duration(200)}
            exiting={FadeOutUp.duration(150)}
            style={[
              styles.confirmBox,
              {
                backgroundColor: colors.dangerLight,
                borderRadius: radius.md,
                marginTop: spacing.sm,
                padding: spacing.md,
              },
            ]}
          >
            <Text
              style={{
                fontFamily: fonts.label,
                fontSize: 14,
                color: colors.danger,
                textAlign: 'center',
                marginBottom: spacing.sm,
              }}
            >
              Are you sure you want to sign out?
            </Text>
            <View style={styles.confirmActions}>
              <Button
                label="Cancel"
                variant="ghost"
                size="sm"
                onPress={() => setShowLogoutConfirm(false)}
              />
              <Button label="Confirm" variant="danger" size="sm" onPress={handleLogout} />
            </View>
          </Animated.View>
        ) : null}
      </View>
    </ScrollView>
  );
};

function SettingRow({
  icon,
  label,
  right,
  borderColor,
  last = false,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  right: React.ReactNode;
  borderColor: string;
  last?: boolean;
}) {
  const { colors, fonts } = useTheme();

  return (
    <View
      style={[
        styles.settingRow,
        !last ? { borderBottomWidth: 1, borderBottomColor: borderColor } : null,
      ]}
    >
      <View style={styles.settingLeft}>
        <MaterialCommunityIcons name={icon} size={20} color={colors.primary} />
        <Text style={[styles.settingLabel, { color: colors.textPrimary, fontFamily: fonts.body }]}>
          {label}
        </Text>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    alignItems: 'center',
    paddingBottom: 36,
    gap: 12,
  },
  name: {
    fontSize: 24,
    marginTop: 4,
  },
  email: {
    fontSize: 14,
  },
  statsCard: {
    flexDirection: 'row',
    padding: 20,
    borderWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 26,
  },
  statLabel: {
    fontSize: 13,
  },
  statDivider: {
    width: 1,
  },
  settingsCard: {
    overflow: 'hidden',
    borderWidth: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 15,
  },
  confirmBox: {},
  confirmActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
});
