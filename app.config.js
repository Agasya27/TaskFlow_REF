const baseConfig = require('./app.json');

function getIosGoogleUrlScheme(iosClientId) {
  const id = iosClientId.replace('.apps.googleusercontent.com', '');
  return `com.googleusercontent.apps.${id}`;
}

module.exports = () => {
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim();
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID?.trim();
  const isDevClientBuild = process.env.EAS_BUILD_PROFILE === 'development';
  const schemes = new Set([baseConfig.expo.scheme].flat().filter(Boolean));

  const addGoogleScheme = (clientId) => {
    const id = clientId.replace('.apps.googleusercontent.com', '');
    schemes.add(`com.googleusercontent.apps.${id}`);
  };

  if (iosClientId) addGoogleScheme(iosClientId);
  if (androidClientId) addGoogleScheme(androidClientId);

  const plugins = [...(baseConfig.expo.plugins ?? [])].filter(
    (plugin) => isDevClientBuild || plugin !== 'expo-dev-client',
  );
  if (iosClientId) {
    plugins.push([
      '@react-native-google-signin/google-signin',
      { iosUrlScheme: getIosGoogleUrlScheme(iosClientId) },
    ]);
  } else {
    plugins.push('@react-native-google-signin/google-signin');
  }

  plugins.push([
    'expo-notifications',
    {
      icon: './assets/android-icon-monochrome.png',
      color: '#6366F1',
    },
  ]);

  return {
    ...baseConfig,
    expo: {
      ...baseConfig.expo,
      scheme: Array.from(schemes),
      plugins,
      extra: {
        ...baseConfig.expo.extra,
      },
    },
  };
};
