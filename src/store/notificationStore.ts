import { create } from 'zustand';
import { KEYS, getItem, setItem, removeItem } from '@utils/storage';
import {
  cancelAllNotifications,
  getExpoPushToken,
  isNotificationsSupported,
  requestNotificationPermission,
  scheduleDailyReminder,
} from '@services/notificationService';

interface NotificationState {
  enabled: boolean;
  pushToken: string | null;
  isHydrated: boolean;
  isUpdating: boolean;
  hydrate: () => Promise<void>;
  setEnabled: (enabled: boolean, pendingCount?: number) => Promise<{ ok: boolean; message?: string }>;
  refreshDailyReminder: (pendingCount: number) => Promise<void>;
}

async function persistEnabled(enabled: boolean): Promise<void> {
  await setItem(KEYS.NOTIFICATIONS_ENABLED, enabled);
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  enabled: false,
  pushToken: null,
  isHydrated: false,
  isUpdating: false,

  hydrate: async () => {
    const stored = await getItem<boolean>(KEYS.NOTIFICATIONS_ENABLED);
    const enabled = stored ?? false;
    set({ enabled, isHydrated: true });

    if (!enabled || !isNotificationsSupported()) return;

    const granted = await requestNotificationPermission();
    if (!granted) {
      await persistEnabled(false);
      set({ enabled: false, pushToken: null });
      return;
    }

    const pushToken = await getExpoPushToken();
    set({ pushToken });
  },

  setEnabled: async (enabled, pendingCount = 0) => {
    set({ isUpdating: true });

    try {
      if (enabled) {
        if (!isNotificationsSupported()) {
          return {
            ok: false,
            message: 'Notifications need a newer app build. Run npm run build:apk and reinstall.',
          };
        }

        const granted = await requestNotificationPermission();
        if (!granted) {
          return {
            ok: false,
            message: 'Notification permission was denied. Enable it in system settings.',
          };
        }

        const pushToken = await getExpoPushToken();
        if (pushToken) {
          await setItem(KEYS.PUSH_TOKEN, pushToken);
        } else {
          await removeItem(KEYS.PUSH_TOKEN);
        }
        await scheduleDailyReminder(pendingCount);
        await persistEnabled(true);
        set({ enabled: true, pushToken });
        return { ok: true };
      }

      await cancelAllNotifications();
      await persistEnabled(false);
      await removeItem(KEYS.PUSH_TOKEN);
      set({ enabled: false, pushToken: null });
      return { ok: true };
    } finally {
      set({ isUpdating: false });
    }
  },

  refreshDailyReminder: async (pendingCount) => {
    if (!get().enabled) return;
    await scheduleDailyReminder(pendingCount);
  },
}));
