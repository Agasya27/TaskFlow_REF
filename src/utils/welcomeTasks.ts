import { Task } from '@services/taskService';

export function createWelcomeTasks(): Task[] {
  const createdAt = new Date().toISOString();

  return [
    {
      id: 1,
      title: 'Welcome to TaskFlow',
      completed: false,
      userId: 1,
      createdAt,
      priority: 'medium',
    },
    {
      id: 2,
      title: 'Tap a task to view its details',
      completed: false,
      userId: 1,
      createdAt,
      priority: 'low',
    },
    {
      id: 3,
      title: 'Create your own tasks from the Add Task tab',
      completed: false,
      userId: 1,
      createdAt,
      priority: 'high',
    },
  ];
}
