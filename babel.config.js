module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@components': './src/components',
            '@screens': './src/screens',
            '@store': './src/store',
            '@services': './src/services',
            '@utils': './src/utils',
            '@theme': './src/theme',
            '@assets': './src/assets',
            '@navigation': './src/navigation',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
