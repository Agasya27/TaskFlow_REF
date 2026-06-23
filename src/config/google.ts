export function getGoogleWebClientId(): string | undefined {
  return process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
}

export function isGoogleAuthConfigured(): boolean {
  return Boolean(getGoogleWebClientId());
}

export function getGoogleAuthSetupError(): string | null {
  const clientId = getGoogleWebClientId();
  if (!clientId?.trim()) {
    return 'Google sign-in is not configured yet. Add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID to your .env file.';
  }
  return null;
}

export function getIosGoogleUrlScheme(iosClientId: string): string {
  const id = iosClientId.replace('.apps.googleusercontent.com', '');
  return `com.googleusercontent.apps.${id}`;
}
