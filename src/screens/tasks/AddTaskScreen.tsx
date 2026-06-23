import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@theme/index';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { useToast } from '@components/ui/Toast';
import { useTaskStore } from '@store/taskStore';
import { validateTaskTitle } from '@utils/validation';
import { Task } from '@services/taskService';

const PRIORITIES: Task['priority'][] = ['low', 'medium', 'high'];
const PRIORITY_LABELS = { low: 'Low', medium: 'Medium', high: 'High' };
const NOTES_MAX = 300;

interface AddTaskScreenProps {
  navigation: { goBack: () => void };
}

export const AddTaskScreen: React.FC<AddTaskScreenProps> = ({ navigation }) => {
  const { colors, fonts, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const { show: showToast } = useToast();
  const addTask = useTaskStore((s) => s.addTask);

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [titleError, setTitleError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Segmented control animation
  const segmentWidth = useSharedValue(0);
  const indicatorX = useSharedValue(0);

  const onSegmentLayout = (event: { nativeEvent: { layout: { width: number } } }) => {
    const w = event.nativeEvent.layout.width / 3;
    segmentWidth.value = w;
    indicatorX.value = withSpring(PRIORITIES.indexOf(priority) * w);
  };

  const selectPriority = (p: Task['priority']) => {
    setPriority(p);
    indicatorX.value = withSpring(PRIORITIES.indexOf(p) * segmentWidth.value, {
      damping: 15,
      stiffness: 200,
    });
  };

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: segmentWidth.value,
  }));

  const handleSubmit = async () => {
    const error = validateTaskTitle(title);
    if (error) {
      setTitleError(error);
      return;
    }

    setTitleError(undefined);
    setIsSubmitting(true);

    try {
      await addTask({ title: title.trim(), completed: false, priority });
      showToast('Task added', 'success');
      navigation.goBack();
    } catch {
      showToast('Failed to add task', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header bar */}
      <View
        style={[
          styles.headerBar,
          {
            paddingTop: insets.top + spacing.sm,
            backgroundColor: colors.surface,
            borderBottomColor: colors.divider,
          },
        ]}
      >
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={[styles.headerAction, { color: colors.textSecondary, fontFamily: fonts.label }]}>
            Cancel
          </Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: fonts.heading }]}>
          New Task
        </Text>
        <Pressable onPress={handleSubmit} disabled={isSubmitting}>
          <Text
            style={[
              styles.headerAction,
              {
                color: isSubmitting ? colors.textDisabled : colors.primary,
                fontFamily: fonts.label,
              },
            ]}
          >
            Add
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.form, { padding: spacing.lg }]}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="Title"
          placeholder="What needs to be done?"
          value={title}
          onChangeText={setTitle}
          error={titleError}
          maxLength={100}
        />

        {/* Priority segmented control */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text
            style={[
              styles.label,
              { color: colors.textSecondary, fontFamily: fonts.label, marginBottom: spacing.sm },
            ]}
          >
            Priority
          </Text>
          <View
            style={[
              styles.segmentContainer,
              { backgroundColor: colors.surfaceAlt, borderRadius: radius.md },
            ]}
            onLayout={onSegmentLayout}
          >
            {/* Sliding indicator */}
            <Animated.View
              style={[
                styles.segmentIndicator,
                {
                  backgroundColor: colors.surface,
                  borderRadius: radius.sm,
                  shadowColor: colors.shadow,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                  elevation: 2,
                },
                indicatorStyle,
              ]}
            />
            {PRIORITIES.map((p) => (
              <Pressable
                key={p}
                style={styles.segmentButton}
                onPress={() => selectPriority(p)}
              >
                <Text
                  style={{
                    fontFamily: fonts.label,
                    fontSize: 14,
                    color: priority === p ? colors.textPrimary : colors.textSecondary,
                  }}
                >
                  {PRIORITY_LABELS[p]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text
            style={[
              styles.label,
              { color: colors.textSecondary, fontFamily: fonts.label, marginBottom: spacing.sm },
            ]}
          >
            Notes (optional)
          </Text>
          <View
            style={[
              styles.notesContainer,
              {
                backgroundColor: colors.surfaceAlt,
                borderRadius: radius.md,
                borderWidth: 1.5,
                borderColor: colors.border,
              },
            ]}
          >
            <TextInput
              style={[
                styles.notesInput,
                { color: colors.textPrimary, fontFamily: fonts.body },
              ]}
              placeholder="Add any notes..."
              placeholderTextColor={colors.textDisabled}
              value={notes}
              onChangeText={(t) => setNotes(t.slice(0, NOTES_MAX))}
              multiline
              maxLength={NOTES_MAX}
              textAlignVertical="top"
            />
          </View>
          <Text
            style={[
              styles.charCount,
              { color: colors.textDisabled, fontFamily: fonts.body },
            ]}
          >
            {notes.length}/{NOTES_MAX}
          </Text>
        </View>

        <Button
          label="Add Task"
          onPress={handleSubmit}
          loading={isSubmitting}
          fullWidth
          size="lg"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 17,
  },
  headerAction: {
    fontSize: 15,
  },
  form: {
    flexGrow: 1,
  },
  label: {
    fontSize: 13,
  },
  segmentContainer: {
    flexDirection: 'row',
    height: 40,
    padding: 3,
    position: 'relative',
  },
  segmentIndicator: {
    position: 'absolute',
    top: 3,
    bottom: 3,
    left: 3,
  },
  segmentButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  notesContainer: {
    padding: 12,
  },
  notesInput: {
    fontSize: 15,
    minHeight: 100,
    lineHeight: 22,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
});
