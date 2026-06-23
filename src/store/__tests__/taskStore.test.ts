import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useTaskStore, filterTasks } from '@store/taskStore';
import * as taskService from '@services/taskService';
import { KEYS } from '@utils/storage';

jest.mock('@services/taskService');

const mockTasks: taskService.Task[] = [
  {
    id: 1,
    title: 'Buy milk',
    completed: false,
    userId: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    priority: 'low',
  },
  {
    id: 2,
    title: 'Walk dog',
    completed: true,
    userId: 1,
    createdAt: '2026-01-02T00:00:00.000Z',
    priority: 'medium',
  },
  {
    id: 3,
    title: 'Read book',
    completed: false,
    userId: 1,
    createdAt: '2026-01-03T00:00:00.000Z',
    priority: 'high',
  },
];

describe('taskStore', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    (NetInfo.fetch as jest.Mock).mockResolvedValue({
      isConnected: true,
      isInternetReachable: true,
    });
    (taskService.createTask as jest.Mock).mockResolvedValue({
      ...mockTasks[0],
      id: 201,
      title: 'New task',
    });
    (taskService.toggleTask as jest.Mock).mockResolvedValue({
      ...mockTasks[0],
      completed: true,
    });

    useTaskStore.setState({
      tasks: [],
      isLoading: false,
      error: null,
      filter: 'all',
      searchQuery: '',
      isFromCache: false,
      pendingCount: 0,
    });
  });

  it('seeds welcome tasks on first launch', async () => {
    await useTaskStore.getState().fetchTasks();

    const { tasks } = useTaskStore.getState();
    expect(tasks).toHaveLength(3);
    expect(tasks[0].title).toBe('Welcome to TaskFlow');

    const cached = await AsyncStorage.getItem(KEYS.TASKS_CACHE);
    expect(cached).toBeTruthy();
  });

  it('loads saved tasks from local storage', async () => {
    await AsyncStorage.setItem(KEYS.TASKS_CACHE, JSON.stringify(mockTasks));

    await useTaskStore.getState().fetchTasks();

    expect(useTaskStore.getState().tasks).toHaveLength(3);
    expect(useTaskStore.getState().tasks[0].title).toBe('Buy milk');
  });

  it('queues add when offline', async () => {
    (NetInfo.fetch as jest.Mock).mockResolvedValue({
      isConnected: false,
      isInternetReachable: false,
    });

    await useTaskStore.getState().addTask({
      title: 'Offline task',
      completed: false,
      priority: 'medium',
    });

    expect(useTaskStore.getState().tasks[0].title).toBe('Offline task');
    expect(useTaskStore.getState().pendingCount).toBe(1);
    expect(useTaskStore.getState().isFromCache).toBe(true);
  });

  it('filters tasks by status and search', () => {
    useTaskStore.setState({ tasks: mockTasks, filter: 'pending', searchQuery: 'book' });

    const filtered = filterTasks(mockTasks, 'pending', 'book');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('Read book');
  });
});
