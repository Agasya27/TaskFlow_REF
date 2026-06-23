import { create } from 'zustand';
import {
  Task,
  createTask as createTaskAPI,
  toggleTask as toggleTaskAPI,
} from '@services/taskService';
import { KEYS, getItem, setItem } from '@utils/storage';
import { isOnline } from '@utils/network';
import { createWelcomeTasks } from '@utils/welcomeTasks';

type FilterType = 'all' | 'pending' | 'completed';

type PendingMutation =
  | {
      type: 'add';
      task: Pick<Task, 'title' | 'completed' | 'priority'>;
      localId: number;
    }
  | {
      type: 'toggle';
      id: number;
      completed: boolean;
    };

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  filter: FilterType;
  searchQuery: string;
  isFromCache: boolean;
  pendingCount: number;
  hydrateFromCache: () => Promise<void>;
  fetchTasks: () => Promise<void>;
  addTask: (task: Pick<Task, 'title' | 'completed' | 'priority'>) => Promise<void>;
  toggleTask: (id: number) => Promise<void>;
  syncPendingMutations: () => Promise<void>;
  setFilter: (filter: FilterType) => void;
  setSearch: (query: string) => void;
}

async function persistTasks(tasks: Task[]): Promise<void> {
  await setItem(KEYS.TASKS_CACHE, tasks);
}

async function loadPendingMutations(): Promise<PendingMutation[]> {
  return (await getItem<PendingMutation[]>(KEYS.PENDING_MUTATIONS)) ?? [];
}

async function savePendingMutations(mutations: PendingMutation[]): Promise<void> {
  await setItem(KEYS.PENDING_MUTATIONS, mutations);
}

async function loadOrSeedTasks(): Promise<Task[]> {
  const cached = await getItem<Task[]>(KEYS.TASKS_CACHE);
  if (cached !== null) return cached;

  const welcome = createWelcomeTasks();
  await persistTasks(welcome);
  return welcome;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  filter: 'all',
  searchQuery: '',
  isFromCache: false,
  pendingCount: 0,

  hydrateFromCache: async () => {
    const pending = await loadPendingMutations();
    const tasks = await loadOrSeedTasks();
    set({ tasks, isFromCache: true, pendingCount: pending.length });
  },

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await loadOrSeedTasks();
      set({ tasks, isLoading: false, isFromCache: false, error: null });
      await get().syncPendingMutations();
    } catch (err) {
      const cached = await getItem<Task[]>(KEYS.TASKS_CACHE);
      const pending = await loadPendingMutations();
      set({
        tasks: cached ?? [],
        isLoading: false,
        isFromCache: cached !== null,
        pendingCount: pending.length,
        error: err instanceof Error ? err.message : 'Failed to load tasks',
      });
    }
  },

  addTask: async (taskInput) => {
    const existing = get().tasks;
    const maxId = existing.reduce((max, t) => Math.max(max, t.id), 0);
    const localId = maxId + 1;

    const online = await isOnline();

    if (!online) {
      const task: Task = {
        id: localId,
        title: taskInput.title,
        completed: taskInput.completed,
        priority: taskInput.priority,
        userId: 1,
        createdAt: new Date().toISOString(),
      };
      const nextTasks = [task, ...existing];
      const pending = await loadPendingMutations();
      pending.push({ type: 'add', task: taskInput, localId });
      await savePendingMutations(pending);
      await persistTasks(nextTasks);
      set({ tasks: nextTasks, pendingCount: pending.length, isFromCache: true });
      return;
    }

    try {
      const created = await createTaskAPI(taskInput);
      const task: Task = { ...created, id: localId };
      const nextTasks = [task, ...existing];
      await persistTasks(nextTasks);
      set({ tasks: nextTasks, isFromCache: false });
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add task');
    }
  },

  toggleTask: async (id: number) => {
    const prev = get().tasks;
    const target = prev.find((t) => t.id === id);
    if (!target) return;

    const nextCompleted = !target.completed;
    const nextTasks = prev.map((t) =>
      t.id === id ? { ...t, completed: nextCompleted } : t,
    );

    set({ tasks: nextTasks });
    await persistTasks(nextTasks);

    const online = await isOnline();

    if (!online) {
      const pending = await loadPendingMutations();
      const existingIdx = pending.findIndex((m) => m.type === 'toggle' && m.id === id);
      if (existingIdx >= 0) {
        pending[existingIdx] = { type: 'toggle', id, completed: nextCompleted };
      } else {
        pending.push({ type: 'toggle', id, completed: nextCompleted });
      }
      await savePendingMutations(pending);
      set({ pendingCount: pending.length, isFromCache: true });
      return;
    }

    try {
      await toggleTaskAPI(id, nextCompleted);
      set({ isFromCache: false });
    } catch {
      set({ tasks: prev });
      await persistTasks(prev);
    }
  },

  syncPendingMutations: async () => {
    const online = await isOnline();
    if (!online) return;

    let pending = await loadPendingMutations();
    if (!pending.length) {
      set({ pendingCount: 0 });
      return;
    }

    const remaining: PendingMutation[] = [];

    for (const mutation of pending) {
      try {
        if (mutation.type === 'add') {
          await createTaskAPI(mutation.task);
        } else {
          await toggleTaskAPI(mutation.id, mutation.completed);
        }
      } catch {
        remaining.push(mutation);
      }
    }

    await savePendingMutations(remaining);
    set({ pendingCount: remaining.length });
  },

  setFilter: (filter) => set({ filter }),
  setSearch: (searchQuery) => set({ searchQuery }),
}));

export function filterTasks(
  tasks: Task[],
  filter: FilterType,
  searchQuery: string,
): Task[] {
  let result = tasks;

  if (filter === 'pending') result = result.filter((t) => !t.completed);
  if (filter === 'completed') result = result.filter((t) => t.completed);

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    result = result.filter((t) => t.title.toLowerCase().includes(q));
  }

  return result;
}

export function useFilteredTasks(): Task[] {
  const { tasks, filter, searchQuery } = useTaskStore();
  return filterTasks(tasks, filter, searchQuery);
}
