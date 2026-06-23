import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@theme/index';
import { Badge } from '@components/ui/Badge';
import { Task } from '@services/taskService';

interface TaskCardProps {
  task: Task;
  index: number;
  onToggle: (id: number) => void;
  onPress?: (task: Task) => void;
}

const PRIORITY_VARIANT = {
  low: 'info',
  medium: 'warning',
  high: 'danger',
} as const;

export const TaskCard: React.FC<TaskCardProps> = ({ task, index, onToggle, onPress }) => {
  const { colors, fonts, spacing, radius, shadows } = useTheme();
  const checkScale = useSharedValue(1);

  const checkAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const handleToggle = () => {
    checkScale.value = withSpring(0.85, { damping: 10 }, () => {
      checkScale.value = withSpring(1, { damping: 10 });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle(task.id);
  };

  const formattedDate = (() => {
    try {
      return format(new Date(task.createdAt), 'MMM d');
    } catch {
      return '';
    }
  })();

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      style={[
        styles.card,
        {
          backgroundColor: task.completed ? colors.surfaceAlt : colors.surface,
          borderRadius: radius.lg,
          padding: spacing.md,
          marginBottom: spacing.sm,
          borderColor: colors.border,
          borderWidth: 1,
          ...shadows.card,
        },
      ]}
    >
      <View style={styles.row}>
        <Pressable onPress={handleToggle} hitSlop={8}>
          <Animated.View style={checkAnimStyle}>
            {task.completed ? (
              <MaterialCommunityIcons name="check-circle" size={26} color={colors.success} />
            ) : (
              <MaterialCommunityIcons
                name="circle-outline"
                size={26}
                color={colors.textDisabled}
              />
            )}
          </Animated.View>
        </Pressable>

        <Pressable
          style={styles.content}
          onPress={() => onPress?.(task)}
          disabled={!onPress}
          accessibilityRole="button"
          accessibilityLabel={`View details for ${task.title}`}
        >
          <Text
            numberOfLines={2}
            style={[
              styles.title,
              {
                color: task.completed ? colors.textDisabled : colors.textPrimary,
                fontFamily: fonts.body,
                textDecorationLine: task.completed ? 'line-through' : 'none',
              },
            ]}
          >
            {task.title}
          </Text>

          <View style={styles.meta}>
            <Badge label={task.priority} variant={PRIORITY_VARIANT[task.priority]} size="sm" />
            {formattedDate ? (
              <Text style={[styles.date, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                • {formattedDate}
              </Text>
            ) : null}
          </View>
        </Pressable>

        <Pressable
          onPress={() => onPress?.(task)}
          disabled={!onPress}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`View details for ${task.title}`}
        >
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textDisabled} />
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  content: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 15,
    lineHeight: 21,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  date: {
    fontSize: 12,
  },
});
