import { create } from 'zustand';
import {
  Task,
  fetchTasks as fetchTasksAPI,
  createTask as createTaskAPI,
  toggleTask as toggleTaskAPI,
} from '@services/taskService';
import { KEYS, getItem, setItem } from '@utils/storage';

type FilterType = 'all' | 'pending' | 'completed';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  filter: FilterType;
  searchQuery: string;
  fetchTasks: () => Promise<void>;
  addTask: (task: Pick<Task, 'title' | 'completed' | 'priority'>) => Promise<void>;
  toggleTask: (id: number) => Promise<void>;
  setFilter: (filter: FilterType) => void;
  setSearch: (query: string) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  filter: 'all',
  searchQuery: '',

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await fetchTasksAPI();
      set({ tasks, isLoading: false });
      await setItem(KEYS.TASKS_CACHE, tasks);
    } catch (err) {
      // Fall back to cached tasks when offline
      const cached = await getItem<Task[]>(KEYS.TASKS_CACHE);
      set({
        tasks: cached ?? [],
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch tasks',
      });
    }
  },

  addTask: async (taskInput) => {
    try {
      const created = await createTaskAPI(taskInput);
      // JSONPlaceholder always returns id 201 — override for local uniqueness
      const existing = get().tasks;
      const maxId = existing.reduce((max, t) => Math.max(max, t.id), 0);
      const task: Task = { ...created, id: maxId + 1 };
      set({ tasks: [task, ...existing] });
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add task');
    }
  },

  toggleTask: async (id: number) => {
    const prev = get().tasks;
    const target = prev.find((t) => t.id === id);
    if (!target) return;

    // Optimistic update
    set({
      tasks: prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      ),
    });

    try {
      await toggleTaskAPI(id, !target.completed);
    } catch {
      // Revert on failure
      set({ tasks: prev });
    }
  },

  setFilter: (filter) => set({ filter }),
  setSearch: (searchQuery) => set({ searchQuery }),
}));

// Derived selector — applies both filter and search
export function useFilteredTasks(): Task[] {
  const { tasks, filter, searchQuery } = useTaskStore();
  let result = tasks;

  if (filter === 'pending') result = result.filter((t) => !t.completed);
  if (filter === 'completed') result = result.filter((t) => t.completed);

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    result = result.filter((t) => t.title.toLowerCase().includes(q));
  }

  return result;
}
