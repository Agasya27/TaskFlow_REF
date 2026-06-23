import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from '@firebase/auth';
import { getFirebaseAuth, isFirebaseConfigured } from '@config/firebase';
import { KEYS, getItem, setItem, removeItem } from '@utils/storage';

interface User {
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isInitializing: boolean;
  isAuthenticating: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  clearError: () => void;
}

function nameFromEmail(email: string): string {
  const local = email.split('@')[0];
  return local.charAt(0).toUpperCase() + local.slice(1);
}

function userFromFirebase(firebaseUser: FirebaseUser): User {
  return {
    email: firebaseUser.email ?? '',
    name: firebaseUser.displayName || nameFromEmail(firebaseUser.email ?? 'user'),
  };
}

function mapFirebaseError(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'Enter a valid email address';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign-in method';
    default:
      return 'Sign in failed. Please try again';
  }
}

function mapResetPasswordError(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'Enter a valid email address';
    case 'auth/missing-email':
      return 'Enter your email address';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again';
    case 'auth/user-not-found':
      return 'If an account exists for this email, a reset link has been sent';
    default:
      return 'Could not send reset email. Please try again';
  }
}

async function mockLogin(email: string): Promise<{ user: User; token: string }> {
  await new Promise((r) => setTimeout(r, 800));
  const user: User = { email, name: nameFromEmail(email) };
  const token = btoa(email + Date.now());
  return { user, token };
}

let authUnsubscribe: (() => void) | null = null;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isInitializing: true,
  isAuthenticating: false,
  error: null,

  clearError: () => set({ error: null }),

  login: async (email: string, password: string) => {
    set({ isAuthenticating: true, error: null });

    try {
      if (isFirebaseConfigured()) {
        const credential = await signInWithEmailAndPassword(
          getFirebaseAuth(),
          email,
          password,
        );
        const user = userFromFirebase(credential.user);
        const token = await credential.user.getIdToken();
        await setItem(KEYS.USER, user);
        await setItem(KEYS.TOKEN, token);
        set({ user, token, isAuthenticating: false });
        return;
      }

      const { user, token } = await mockLogin(email);
      await setItem(KEYS.USER, user);
      await setItem(KEYS.TOKEN, token);
      set({ user, token, isAuthenticating: false });
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? '';
      const message = isFirebaseConfigured()
        ? mapFirebaseError(code)
        : err instanceof Error
          ? err.message
          : 'Sign in failed';
      set({ isAuthenticating: false, error: message });
      throw new Error(message);
    }
  },

  register: async (email: string, password: string) => {
    set({ isAuthenticating: true, error: null });

    try {
      if (!isFirebaseConfigured()) {
        throw new Error('Firebase is required to create an account');
      }

      const credential = await createUserWithEmailAndPassword(
        getFirebaseAuth(),
        email,
        password,
      );
      const user = userFromFirebase(credential.user);
      const token = await credential.user.getIdToken();
      await setItem(KEYS.USER, user);
      await setItem(KEYS.TOKEN, token);
      set({ user, token, isAuthenticating: false });
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? '';
      const message =
        err instanceof Error && !code
          ? err.message
          : mapFirebaseError(code);
      set({ isAuthenticating: false, error: message });
      throw new Error(message);
    }
  },

  loginWithGoogle: async (idToken: string) => {
    set({ isAuthenticating: true, error: null });

    try {
      if (!isFirebaseConfigured()) {
        throw new Error('Firebase is required for Google sign-in');
      }

      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(getFirebaseAuth(), credential);
      const user = userFromFirebase(result.user);
      const token = await result.user.getIdToken();
      await setItem(KEYS.USER, user);
      await setItem(KEYS.TOKEN, token);
      set({ user, token, isAuthenticating: false });
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? '';
      const message =
        err instanceof Error && !code
          ? err.message
          : mapFirebaseError(code);
      set({ isAuthenticating: false, error: message });
      throw new Error(message);
    }
  },

  resetPassword: async (email: string) => {
    set({ isAuthenticating: true, error: null });

    try {
      if (!isFirebaseConfigured()) {
        throw new Error('Password reset requires Firebase authentication');
      }

      await sendPasswordResetEmail(getFirebaseAuth(), email.trim());
      set({ isAuthenticating: false, error: null });
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? '';
      const message =
        err instanceof Error && !code
          ? err.message
          : mapResetPasswordError(code);
      set({ isAuthenticating: false, error: message });
      throw new Error(message);
    }
  },

  logout: async () => {
    if (isFirebaseConfigured()) {
      await signOut(getFirebaseAuth());
    }
    await removeItem(KEYS.USER);
    await removeItem(KEYS.TOKEN);
    set({ user: null, token: null, error: null });
  },

  restoreSession: async () => {
    set({ isInitializing: true });

    if (authUnsubscribe) {
      authUnsubscribe();
      authUnsubscribe = null;
    }

    if (isFirebaseConfigured()) {
      const cachedUser = await getItem<User>(KEYS.USER);
      const cachedToken = await getItem<string>(KEYS.TOKEN);

      return new Promise<void>((resolve) => {
        authUnsubscribe = onAuthStateChanged(getFirebaseAuth(), async (firebaseUser) => {
          if (firebaseUser) {
            const user = userFromFirebase(firebaseUser);
            const token = await firebaseUser.getIdToken();
            await setItem(KEYS.USER, user);
            await setItem(KEYS.TOKEN, token);
            set({ user, token, isInitializing: false });
          } else if (cachedUser && cachedToken) {
            set({ user: cachedUser, token: cachedToken, isInitializing: false });
          } else {
            await removeItem(KEYS.USER);
            await removeItem(KEYS.TOKEN);
            set({ user: null, token: null, isInitializing: false });
          }
          resolve();
        });
      });
    }

    const user = await getItem<User>(KEYS.USER);
    const token = await getItem<string>(KEYS.TOKEN);

    if (user && token) {
      set({ user, token, isInitializing: false });
    } else {
      set({ isInitializing: false });
    }
  },
}));
