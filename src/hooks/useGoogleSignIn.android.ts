import { useCallback } from 'react';
import { NativeModules, Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

export function isAndroidExpoGo(): boolean {
  return (
    Platform.OS === 'android' &&
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient
  );
}

function isNativeGoogleSignInAvailable(): boolean {
  return Boolean(NativeModules.RNGoogleSignin);
}

export function useGoogleSignIn(
  onSuccess: (idToken: string) => void,
  onError: (message: string) => void,
) {
  const signIn = useCallback(async () => {
    if (!process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID) {
      onError('Add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID to .env');
      return;
    }

    if (isAndroidExpoGo()) {
      onError(
        'Google sign-in is not supported in Expo Go on Android. Use email/password here, or build a development APK.',
      );
      return;
    }

    if (!isNativeGoogleSignInAvailable()) {
      onError(
        'Google sign-in requires a native build. Install the latest APK from npm run build:apk.',
      );
      return;
    }

    try {
      const {
        GoogleSignin,
        isSuccessResponse,
        isErrorWithCode,
        statusCodes,
      } = require('@react-native-google-signin/google-signin') as typeof import('@react-native-google-signin/google-signin');

      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        offlineAccess: false,
      });

      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      const response = await GoogleSignin.signIn();
      if (!isSuccessResponse(response)) {
        onError('Google sign-in was cancelled');
        return;
      }

      const { idToken } = await GoogleSignin.getTokens();
      if (!idToken) {
        onError('No ID token returned from Google.');
        return;
      }

      onSuccess(idToken);
    } catch (error) {
      const { isErrorWithCode, statusCodes } =
        require('@react-native-google-signin/google-signin') as typeof import('@react-native-google-signin/google-signin');

      if (isErrorWithCode(error)) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          onError('Google sign-in was cancelled');
          return;
        }
        if (error.code === statusCodes.IN_PROGRESS) {
          onError('Google sign-in is already in progress');
          return;
        }
        if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          onError('Google Play Services is not available on this device');
          return;
        }
      }

      onError(error instanceof Error ? error.message : 'Google sign-in failed');
    }
  }, [onSuccess, onError]);

  return { signIn, isReady: true };
}
