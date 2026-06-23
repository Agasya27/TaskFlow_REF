import { NativeModules, Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

export const DAILY_REMINDER_ID = 'taskflow-daily-reminder';

type NotificationsModule = typeof import('expo-notifications');
type DeviceModule = typeof import('expo-device');

let notificationsModule: NotificationsModule | null | undefined;
let deviceModule: DeviceModule | null | undefined;
let notificationsAvailable: boolean | undefined;
let handlerConfigured = false;

function isExpoGo(): boolean {
  return Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
}

function isStandaloneBuild(): boolean {
  return (
    Constants.executionEnvironment === ExecutionEnvironment.Standalone ||
    Constants.executionEnvironment === ExecutionEnvironment.Bare
  );
}

function hasNotificationsNativeModule(): boolean {
  try {
    return Boolean(
      NativeModules.ExpoPushTokenManager ??
        NativeModules.ExpoNotifications ??
        NativeModules.ExpoNotificationsModule,
    );
  } catch {
    return false;
  }
}

function canLoadNotificationsModule(): boolean {
  if (Platform.OS === 'ios') return true;
  if (Platform.OS === 'android' && isExpoGo()) return false;
  if (Platform.OS === 'android' && isStandaloneBuild()) return true;
  return hasNotificationsNativeModule();
}

function hasDeviceNativeModule(): boolean {
  try {
    return Boolean(NativeModules.ExpoDevice);
  } catch {
    return false;
  }
}

function loadNotifications(): NotificationsModule | null {
  if (notificationsModule !== undefined) return notificationsModule;
  if (!canLoadNotificationsModule()) {
    notificationsModule = null;
    return null;
  }

  try {
    const mod = require('expo-notifications') as NotificationsModule;
    notificationsModule = mod;

    if (!handlerConfigured) {
      mod.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
      handlerConfigured = true;
    }

    return mod;
  } catch {
    notificationsModule = null;
    return null;
  }
}

function loadDevice(): DeviceModule | null {
  if (deviceModule !== undefined) return deviceModule;
  const canLoad =
    Platform.OS === 'ios' ||
    isStandaloneBuild() ||
    (Platform.OS === 'android' && !isExpoGo() && hasDeviceNativeModule());
  if (!canLoad) {
    deviceModule = null;
    return null;
  }

  try {
    deviceModule = require('expo-device') as DeviceModule;
    return deviceModule;
  } catch {
    deviceModule = null;
    return null;
  }
}

export function isNotificationsSupported(): boolean {
  try {
    if (notificationsAvailable === true) return true;
    if (Platform.OS === 'android' && isExpoGo()) return false;

    const loaded = loadNotifications() !== null;
    if (loaded) notificationsAvailable = true;
    return loaded;
  } catch {
    return false;
  }
}

async function ensureAndroidChannel(): Promise<void> {
  const Notifications = loadNotifications();
  if (!Notifications || Platform.OS !== 'android') return;

  try {
    await Notifications.setNotificationChannelAsync('taskflow-default', {
      name: 'Task reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6366F1',
    });
  } catch {
    // Native notifications unavailable in this build
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  const Notifications = loadNotifications();
  if (!Notifications) return false;

  try {
    await ensureAndroidChannel();

    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

export async function getExpoPushToken(): Promise<string | null> {
  const Notifications = loadNotifications();
  const Device = loadDevice();
  if (!Notifications || !Device?.isDevice) return null;

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

  if (!projectId) return null;

  try {
    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    return token.data;
  } catch {
    return null;
  }
}

export async function scheduleDailyReminder(pendingCount: number): Promise<void> {
  const Notifications = loadNotifications();
  if (!Notifications) return;

  try {
    await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID);

    if (pendingCount <= 0) return;

    await Notifications.scheduleNotificationAsync({
      identifier: DAILY_REMINDER_ID,
      content: {
        title: 'TaskFlow',
        body: `You have ${pendingCount} pending task${pendingCount === 1 ? '' : 's'} waiting.`,
        data: { screen: 'Tasks' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 9,
        minute: 0,
        channelId: 'taskflow-default',
      },
    });
  } catch {
    // Native notifications unavailable in this build
  }
}

export async function showTaskAddedNotification(title: string): Promise<void> {
  const Notifications = loadNotifications();
  if (!Notifications) return;

  try {
    await ensureAndroidChannel();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Task added',
        body: `"${title}" was added to your list.`,
        data: { screen: 'Tasks' },
      },
      trigger: null,
    });
  } catch {
    // Native notifications unavailable in this build
  }
}

export async function cancelAllNotifications(): Promise<void> {
  const Notifications = loadNotifications();
  if (!Notifications) return;

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.dismissAllNotificationsAsync();
  } catch {
    // Native notifications unavailable in this build
  }
}
