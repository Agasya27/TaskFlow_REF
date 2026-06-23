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
import { useTheme } from '@theme/index';
import { Badge } from '@components/ui/Badge';
import { Task } from '@services/taskService';

interface TaskCardProps {
  task: Task;
  index: number;
  onToggle: (id: number) => void;
}

const PRIORITY_VARIANT = {
  low: 'neutral',
  medium: 'warning',
  high: 'danger',
} as const;

export const TaskCard: React.FC<TaskCardProps> = ({ task, index, onToggle }) => {
  const { colors, fonts, spacing, radius, shadows } = useTheme();
  const checkScale = useSharedValue(1);

  const checkAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const handleToggle = () => {
    checkScale.value = withSpring(0.8, { damping: 10 }, () => {
      checkScale.value = withSpring(1, { damping: 10 });
    });
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
      entering={FadeInDown.delay(index * 60).springify()}
      style={[
        styles.card,
        {
          backgroundColor: task.completed ? colors.surfaceAlt : colors.surface,
          borderRadius: radius.md,
          padding: spacing.md,
          marginBottom: spacing.sm,
          ...shadows.card,
        },
      ]}
    >
      <View style={styles.row}>
        <Pressable onPress={handleToggle} hitSlop={8}>
          <Animated.View style={checkAnimStyle}>
            <MaterialCommunityIcons
              name={task.completed ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
              size={24}
              color={task.completed ? colors.success : colors.textDisabled}
            />
          </Animated.View>
        </Pressable>

        <View style={styles.content}>
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
            <Badge
              label={task.priority}
              variant={PRIORITY_VARIANT[task.priority]}
              size="sm"
            />
            {formattedDate ? (
              <Text
                style={[
                  styles.date,
                  { color: colors.textSecondary, fontFamily: fonts.body },
                ]}
              >
                {formattedDate}
              </Text>
            ) : null}
          </View>
        </View>

        <MaterialCommunityIcons
          name="chevron-right"
          size={18}
          color={colors.textDisabled}
          style={{ opacity: 0.5 }}
        />
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
    lineHeight: 20,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontSize: 12,
  },
});
