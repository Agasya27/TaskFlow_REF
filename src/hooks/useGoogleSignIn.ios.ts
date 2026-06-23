import { useEffect, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Google from 'expo-auth-session/providers/google';

function getNativeGoogleRedirectUri(clientId: string): string {
  const prefix = clientId.replace('.apps.googleusercontent.com', '');
  return `com.googleusercontent.apps.${prefix}:/oauthredirect`;
}

export function isAndroidExpoGo(): boolean {
  return (
    Platform.OS === 'android' &&
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient
  );
}

function buildIosGoogleConfig() {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '';

  const config: {
    webClientId: string;
    iosClientId: string;
    androidClientId: string;
    selectAccount: boolean;
    redirectUri?: string;
  } = {
    webClientId,
    iosClientId,
    androidClientId: webClientId,
    selectAccount: true,
  };

  if (iosClientId) {
    config.redirectUri = getNativeGoogleRedirectUri(iosClientId);
  }

  return config;
}

export function useGoogleSignIn(
  onSuccess: (idToken: string) => void,
  onError: (message: string) => void,
) {
  const iosConfig = useMemo(() => buildIosGoogleConfig(), []);
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(iosConfig);

  useEffect(() => {
    if (!response) return;

    if (response.type === 'success') {
      const idToken =
        response.authentication?.idToken ?? response.params?.id_token ?? null;
      if (idToken) {
        onSuccess(idToken);
      } else {
        onError('No ID token returned from Google.');
      }
      return;
    }

    if (response.type === 'error') {
      onError(response.error?.message ?? 'Google sign-in failed');
    }
  }, [response, onSuccess, onError]);

  const signIn = useCallback(async () => {
    if (!process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID) {
      onError('Add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID to .env');
      return;
    }
    if (!process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID) {
      onError('Add EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID to .env');
      return;
    }
    if (!request) {
      onError('Google sign-in is still loading. Try again in a moment.');
      return;
    }

    await promptAsync();
  }, [request, promptAsync, onError]);

  return { signIn, isReady: Boolean(request) };
}
