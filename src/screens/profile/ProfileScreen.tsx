import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@theme/index';
import { Avatar } from '@components/ui/Avatar';
import { Button } from '@components/ui/Button';
import { useAuthStore } from '@store/authStore';
import { useTaskStore } from '@store/taskStore';

export const ProfileScreen: React.FC = () => {
  const { colors, fonts, spacing, radius, shadows } = useTheme();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const tasks = useTaskStore((s) => s.tasks);

  const [notificationsOn, setNotificationsOn] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const handleLogout = async () => {
    await logout();
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
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + spacing.xl,
            backgroundColor: colors.surface,
            borderBottomColor: colors.divider,
          },
        ]}
      >
        <Avatar name={user?.name ?? 'User'} size={80} />
        <Text
          style={[
            styles.name,
            { color: colors.textPrimary, fontFamily: fonts.heading },
          ]}
        >
          {user?.name ?? 'User'}
        </Text>
        <Text
          style={[
            styles.email,
            { color: colors.textSecondary, fontFamily: fonts.body },
          ]}
        >
          {user?.email ?? ''}
        </Text>
      </View>

      {/* Stats */}
      <View
        style={[
          styles.statsCard,
          {
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            marginHorizontal: spacing.md,
            marginTop: spacing.lg,
            ...shadows.card,
          },
        ]}
      >
        {stats.map((stat, i) => (
          <React.Fragment key={stat.label}>
            {i > 0 && (
              <View
                style={[styles.statDivider, { backgroundColor: colors.divider }]}
              />
            )}
            <View style={styles.statItem}>
              <Text
                style={[
                  styles.statValue,
                  { color: colors.textPrimary, fontFamily: fonts.heading },
                ]}
              >
                {stat.value}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: colors.textSecondary, fontFamily: fonts.body },
                ]}
              >
                {stat.label}
              </Text>
            </View>
          </React.Fragment>
        ))}
      </View>

      {/* Settings */}
      <View
        style={[
          styles.settingsCard,
          {
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            marginHorizontal: spacing.md,
            marginTop: spacing.lg,
            ...shadows.card,
          },
        ]}
      >
        {/* Notifications */}
        <View style={[styles.settingRow, { borderBottomColor: colors.divider }]}>
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons
              name="bell-outline"
              size={20}
              color={colors.textSecondary}
            />
            <Text
              style={[
                styles.settingLabel,
                { color: colors.textPrimary, fontFamily: fonts.body },
              ]}
            >
              Notifications
            </Text>
          </View>
          <Switch
            value={notificationsOn}
            onValueChange={setNotificationsOn}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={notificationsOn ? colors.primary : colors.textDisabled}
          />
        </View>

        {/* Theme */}
        <View style={[styles.settingRow, { borderBottomColor: colors.divider }]}>
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons
              name="palette-outline"
              size={20}
              color={colors.textSecondary}
            />
            <Text
              style={[
                styles.settingLabel,
                { color: colors.textPrimary, fontFamily: fonts.body },
              ]}
            >
              Theme
            </Text>
          </View>
          <View style={styles.settingRight}>
            <Text
              style={{ color: colors.textSecondary, fontFamily: fonts.body, fontSize: 14 }}
            >
              Light
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={18}
              color={colors.textDisabled}
            />
          </View>
        </View>

        {/* About */}
        <View style={styles.settingRowLast}>
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons
              name="information-outline"
              size={20}
              color={colors.textSecondary}
            />
            <Text
              style={[
                styles.settingLabel,
                { color: colors.textPrimary, fontFamily: fonts.body },
              ]}
            >
              About TaskFlow
            </Text>
          </View>
          <View style={styles.settingRight}>
            <Text
              style={{ color: colors.textSecondary, fontFamily: fonts.body, fontSize: 14 }}
            >
              v1.0.0
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={18}
              color={colors.textDisabled}
            />
          </View>
        </View>
      </View>

      {/* Sign Out */}
      <View style={{ marginHorizontal: spacing.md, marginTop: spacing.xl }}>
        <Button
          label="Sign Out"
          variant="danger"
          onPress={() => setShowLogoutConfirm(true)}
          fullWidth
          size="lg"
        />

        {showLogoutConfirm && (
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
              <Button
                label="Confirm"
                variant="danger"
                size="sm"
                onPress={handleLogout}
              />
            </View>
          </Animated.View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingBottom: 24,
    borderBottomWidth: 1,
    gap: 4,
  },
  name: {
    fontSize: 22,
    marginTop: 12,
  },
  email: {
    fontSize: 14,
  },
  statsCard: {
    flexDirection: 'row',
    padding: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 24,
  },
  statLabel: {
    fontSize: 13,
  },
  statDivider: {
    width: 1,
  },
  settingsCard: {
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  settingRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
