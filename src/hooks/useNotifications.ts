import { useEffect, useRef } from 'react';
import { isNotificationsSupported } from '@services/notificationService';
import { useNotificationStore } from '@store/notificationStore';
import { useTaskStore } from '@store/taskStore';

export function useNotifications(): void {
  const supportedRef = useRef<boolean | null>(null);
  if (supportedRef.current === null) {
    try {
      supportedRef.current = isNotificationsSupported();
    } catch {
      supportedRef.current = false;
    }
  }
  const supported = supportedRef.current;
  const hydrate = useNotificationStore((s) => s.hydrate);
  const enabled = useNotificationStore((s) => s.enabled);
  const refreshDailyReminder = useNotificationStore((s) => s.refreshDailyReminder);
  const tasks = useTaskStore((s) => s.tasks);

  useEffect(() => {
    hydrate().catch(() => {});
  }, [hydrate]);

  useEffect(() => {
    if (!supported || !enabled) return;

    const pendingCount = tasks.filter((task) => !task.completed).length;
    refreshDailyReminder(pendingCount).catch(() => {});
  }, [enabled, supported, tasks, refreshDailyReminder]);

  useEffect(() => {
    if (!supported) return;

    let received: { remove: () => void } | undefined;
    let response: { remove: () => void } | undefined;

    try {
      if (!isNotificationsSupported()) return;

      const Notifications = require('expo-notifications') as typeof import('expo-notifications');
      received = Notifications.addNotificationReceivedListener(() => {});
      response = Notifications.addNotificationResponseReceivedListener(() => {});
    } catch {
      return;
    }

    return () => {
      received?.remove();
      response?.remove();
    };
  }, [supported]);
}
