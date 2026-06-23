import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@theme/index';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { Task } from '@services/taskService';

const PRIORITY_VARIANT = {
  low: 'info',
  medium: 'warning',
  high: 'danger',
} as const;

interface TaskDetailModalProps {
  task: Task | null;
  onClose: () => void;
  onToggle: (id: number) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose, onToggle }) => {
  const { colors, fonts, spacing, radius, shadows } = useTheme();
  const insets = useSafeAreaInsets();

  if (!task) return null;

  const formattedDate = (() => {
    try {
      return format(new Date(task.createdAt), 'MMMM d, yyyy');
    } catch {
      return 'Unknown date';
    }
  })();

  const handleToggle = () => {
    onToggle(task.id);
    onClose();
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
              marginHorizontal: spacing.md,
              marginBottom: insets.bottom + spacing.md,
              padding: spacing.lg,
              borderColor: colors.border,
              ...shadows.modal,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: fonts.heading }]}>
              Task details
            </Text>
            <Pressable onPress={onClose} hitSlop={8} accessibilityLabel="Close task details">
              <MaterialCommunityIcons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          <Text
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

          <View style={styles.metaRow}>
            <Badge label={task.priority} variant={PRIORITY_VARIANT[task.priority]} size="md" />
            <Badge
              label={task.completed ? 'Completed' : 'Pending'}
              variant={task.completed ? 'success' : 'primary'}
              size="md"
            />
          </View>

          <View style={[styles.infoRow, { borderTopColor: colors.divider }]}>
            <MaterialCommunityIcons name="calendar-outline" size={18} color={colors.textSecondary} />
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.body, fontSize: 14 }}>
              Created {formattedDate}
            </Text>
          </View>

          <Button
            label={task.completed ? 'Mark as pending' : 'Mark as completed'}
            onPress={handleToggle}
            variant={task.completed ? 'secondary' : 'primary'}
            fullWidth
            size="lg"
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderWidth: 1,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontSize: 18,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 4,
    borderTopWidth: 1,
  },
});
