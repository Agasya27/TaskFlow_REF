import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@theme/index';
import { useTaskStore, useFilteredTasks } from '@store/taskStore';
import { useAuthStore } from '@store/authStore';
import { TaskCard } from '@components/task/TaskCard';
import { TaskFilter } from '@components/task/TaskFilter';
import { TaskSearchBar } from '@components/task/TaskSearchBar';
import { TaskCardSkeleton } from '@components/ui/Skeleton';
import { EmptyState } from '@components/ui/EmptyState';
import { Avatar } from '@components/ui/Avatar';
import { Task } from '@services/taskService';

export const TaskDashboard: React.FC = () => {
  const navigation = useNavigation();
  const { colors, fonts, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const { isLoading, filter, searchQuery, fetchTasks, toggleTask, setFilter, setSearch, tasks } =
    useTaskStore();
  const filteredTasks = useFilteredTasks();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const openAddTask = () => {
    navigation.getParent()?.getParent()?.navigate('AddTaskModal' as never);
  };

  const openProfile = () => {
    navigation.getParent()?.navigate('Profile' as never);
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  const renderItem = useCallback(
    ({ item, index }: { item: Task; index: number }) => (
      <TaskCard task={item} index={index} onToggle={toggleTask} />
    ),
    [toggleTask],
  );

  const keyExtractor = useCallback((item: Task) => String(item.id), []);

  const ListHeader = (
    <View style={{ gap: spacing.md }}>
      <TaskSearchBar value={searchQuery} onChangeText={setSearch} />
      <TaskFilter active={filter} onChange={setFilter} />
      <Text
        style={[
          styles.summary,
          { color: colors.textSecondary, fontFamily: fonts.body },
        ]}
      >
        {tasks.length} tasks · {completedCount} completed
      </Text>
    </View>
  );

  const renderEmpty = () => {
    if (isLoading) return null;

    if (searchQuery.trim()) {
      return (
        <EmptyState
          icon="magnify-close"
          title="No results"
          subtitle={`Nothing matches "${searchQuery}"`}
        />
      );
    }

    if (filter === 'completed') {
      return (
        <EmptyState
          icon="checkbox-marked-circle-outline"
          title="No completed tasks"
          subtitle="Complete a task to see it here"
        />
      );
    }

    if (filter === 'pending') {
      return (
        <EmptyState
          icon="party-popper"
          title="All caught up!"
          subtitle="No pending tasks right now"
        />
      );
    }

    return (
      <EmptyState
        icon="clipboard-text-outline"
        title="No tasks yet"
        subtitle="Tap the + button to add your first task"
        action={{
          label: 'Add Task',
          onPress: openAddTask,
        }}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + spacing.sm,
            backgroundColor: colors.surface,
            borderBottomColor: colors.divider,
          },
        ]}
      >
        <Text
          style={[
            styles.headerTitle,
            { color: colors.textPrimary, fontFamily: fonts.display },
          ]}
        >
          TaskFlow
        </Text>
        <Pressable
          onPress={openProfile}
          hitSlop={8}
          accessibilityLabel="Go to profile"
        >
          <Avatar name={user?.name ?? 'User'} size={36} />
        </Pressable>
      </View>

      {/* Task List */}
      {isLoading && tasks.length === 0 ? (
        <View style={[styles.skeletonContainer, { paddingHorizontal: spacing.md }]}>
          {Array.from({ length: 5 }).map((_, i) => (
            <TaskCardSkeleton key={i} />
          ))}
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={{
            paddingHorizontal: spacing.md,
            paddingTop: spacing.md,
            paddingBottom: spacing.xxl + 80,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchTasks}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <Pressable
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary,
            bottom: insets.bottom + spacing.lg,
          },
        ]}
        onPress={openAddTask}
        accessibilityLabel="Add new task"
      >
        <MaterialCommunityIcons name="plus" size={28} color="#FFFFFF" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
  },
  summary: {
    fontSize: 13,
  },
  skeletonContainer: {
    paddingTop: 16,
    gap: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#5B4FE9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
