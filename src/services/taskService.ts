import api from './api';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

interface TodoResponse {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

const PRIORITIES: Task['priority'][] = ['low', 'medium', 'high'];

function assignPriority(id: number): Task['priority'] {
  return PRIORITIES[id % 3];
}

export async function fetchTasks(): Promise<Task[]> {
  const { data } = await api.get<TodoResponse[]>('/todos');

  return data.map((todo) => ({
    id: todo.id,
    title: todo.title,
    completed: todo.completed,
    userId: todo.userId,
    createdAt: new Date().toISOString(),
    priority: assignPriority(todo.id),
  }));
}

export async function createTask(
  task: Pick<Task, 'title' | 'completed' | 'priority'>,
): Promise<Task> {
  const { data } = await api.post<TodoResponse>('/todos', {
    title: task.title,
    completed: task.completed,
    userId: 1,
  });

  return {
    ...data,
    createdAt: new Date().toISOString(),
    priority: task.priority,
  };
}

export async function toggleTask(
  id: number,
  completed: boolean,
): Promise<Task> {
  const { data } = await api.patch<TodoResponse>(`/todos/${id}`, {
    completed,
  });

  return {
    ...data,
    createdAt: new Date().toISOString(),
    priority: assignPriority(id),
  };
}
