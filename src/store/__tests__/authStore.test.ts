import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendPasswordResetEmail } from '@firebase/auth';
import { useAuthStore } from '@store/authStore';
import { KEYS } from '@utils/storage';
import { isFirebaseConfigured, getFirebaseAuth } from '@config/firebase';

describe('authStore', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    (isFirebaseConfigured as jest.Mock).mockReturnValue(false);
    jest.clearAllMocks();
    useAuthStore.setState({
      user: null,
      token: null,
      isInitializing: false,
      isAuthenticating: false,
      error: null,
    });
  });

  it('logs in with mock auth and persists session', async () => {
    await useAuthStore.getState().login('test@example.com', 'password1');

    const { user, token } = useAuthStore.getState();
    expect(user).toEqual({ email: 'test@example.com', name: 'Test' });
    expect(token).toBeTruthy();

    const storedUser = await AsyncStorage.getItem(KEYS.USER);
    const storedToken = await AsyncStorage.getItem(KEYS.TOKEN);
    expect(storedUser).toBeTruthy();
    expect(storedToken).toBeTruthy();
  });

  it('restores session from storage', async () => {
    await AsyncStorage.setItem(
      KEYS.USER,
      JSON.stringify({ email: 'saved@example.com', name: 'Saved' }),
    );
    await AsyncStorage.setItem(KEYS.TOKEN, JSON.stringify('saved-token'));

    await useAuthStore.getState().restoreSession();

    const { user, token, isInitializing } = useAuthStore.getState();
    expect(user?.email).toBe('saved@example.com');
    expect(token).toBe('saved-token');
    expect(isInitializing).toBe(false);
  });

  it('clears user on logout', async () => {
    await useAuthStore.getState().login('test@example.com', 'password1');
    await useAuthStore.getState().logout();

    const { user, token } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(token).toBeNull();

    expect(await AsyncStorage.getItem(KEYS.USER)).toBeNull();
    expect(await AsyncStorage.getItem(KEYS.TOKEN)).toBeNull();
  });

  it('sends password reset email when Firebase is configured', async () => {
    (isFirebaseConfigured as jest.Mock).mockReturnValue(true);
    (getFirebaseAuth as jest.Mock).mockReturnValue({});

    await useAuthStore.getState().resetPassword('test@example.com');

    expect(sendPasswordResetEmail).toHaveBeenCalledWith({}, 'test@example.com');
    expect(useAuthStore.getState().isAuthenticating).toBe(false);
    expect(useAuthStore.getState().error).toBeNull();
  });

  it('rejects password reset when Firebase is not configured', async () => {
    (isFirebaseConfigured as jest.Mock).mockReturnValue(false);

    await expect(useAuthStore.getState().resetPassword('test@example.com')).rejects.toThrow(
      'Password reset requires Firebase authentication',
    );
  });
});
