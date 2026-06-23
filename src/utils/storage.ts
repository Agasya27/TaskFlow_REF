import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER: '@taskflow/user',
  TOKEN: '@taskflow/token',
  TASKS_CACHE: '@taskflow/tasks_cache',
  PENDING_MUTATIONS: '@taskflow/pending_mutations',
  THEME_PREF: '@taskflow/theme',
  NOTIFICATIONS_ENABLED: '@taskflow/notifications_enabled',
  PUSH_TOKEN: '@taskflow/push_token',
} as const;

async function getItem<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  return JSON.parse(raw) as T;
}

async function setItem<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

async function removeItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

export { KEYS, getItem, setItem, removeItem };
