import { create } from 'zustand';
import { KEYS, getItem, setItem, removeItem } from '@utils/storage';

interface User {
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

function nameFromEmail(email: string): string {
  const local = email.split('@')[0];
  return local.charAt(0).toUpperCase() + local.slice(1);
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,

  login: async (email: string, _password: string) => {
    set({ isLoading: true });

    // Simulate network latency
    await new Promise((r) => setTimeout(r, 800));

    const user: User = { email, name: nameFromEmail(email) };
    const token = btoa(email + Date.now());

    await setItem(KEYS.USER, user);
    await setItem(KEYS.TOKEN, token);

    set({ user, token, isLoading: false });
  },

  logout: async () => {
    await removeItem(KEYS.USER);
    await removeItem(KEYS.TOKEN);
    set({ user: null, token: null });
  },

  restoreSession: async () => {
    set({ isLoading: true });
    const user = await getItem<User>(KEYS.USER);
    const token = await getItem<string>(KEYS.TOKEN);

    if (user && token) {
      set({ user, token, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },
}));
