import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@theme/index';
import { useTaskStore, useFilteredTasks } from '@store/taskStore';
import { useAuthStore } from '@store/authStore';
import { TaskCard } from '@components/task/TaskCard';
import { TaskDetailModal } from '@components/task/TaskDetailModal';
import { TaskFilter } from '@components/task/TaskFilter';
import { TaskSearchBar } from '@components/task/TaskSearchBar';
import { TaskCardSkeleton } from '@components/ui/Skeleton';
import { EmptyState } from '@components/ui/EmptyState';
import { Avatar } from '@components/ui/Avatar';
import { AppWordmark } from '@components/ui/AppWordmark';
import { Task } from '@services/taskService';

export const TaskDashboard: React.FC = () => {
  const navigation = useNavigation();
  const { colors, fonts, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const { isLoading, filter, searchQuery, fetchTasks, toggleTask, setFilter, setSearch, tasks, hydrateFromCache } =
    useTaskStore();
  const filteredTasks = useFilteredTasks();
  const user = useAuthStore((s) => s.user);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    hydrateFromCache().then(() => fetchTasks());
  }, [fetchTasks, hydrateFromCache]);

  const openProfile = () => {
    navigation.getParent()?.navigate('Profile' as never);
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  const renderItem = useCallback(
    ({ item, index }: { item: Task; index: number }) => (
      <TaskCard
        task={item}
        index={index}
        onToggle={toggleTask}
        onPress={setSelectedTask}
      />
    ),
    [toggleTask],
  );

  const keyExtractor = useCallback((item: Task) => String(item.id), []);

  const ListHeader = (
    <View style={{ gap: spacing.md }}>
      <TaskSearchBar value={searchQuery} onChangeText={setSearch} />
      <TaskFilter active={filter} onChange={setFilter} />
      <Text style={[styles.summary, { fontFamily: fonts.body }]}>
        <Text style={{ color: colors.textSecondary }}>{tasks.length} tasks • </Text>
        <Text style={{ color: colors.primary }}>{completedCount} completed</Text>
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
        subtitle="Use the Add Task tab below to create your first task"
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + spacing.sm,
            backgroundColor: colors.background,
          },
        ]}
      >
        <AppWordmark />
        <Pressable onPress={openProfile} hitSlop={8} accessibilityLabel="Go to profile">
          <Avatar name={user?.name ?? 'User'} size={42} />
        </Pressable>
      </View>

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
            paddingTop: spacing.sm,
            paddingBottom: spacing.xxl,
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

      <TaskDetailModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onToggle={toggleTask}
      />
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
  },
  summary: {
    fontSize: 13,
    marginTop: -4,
  },
  skeletonContainer: {
    paddingTop: 16,
    gap: 8,
  },
});
