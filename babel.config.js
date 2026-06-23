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
            '@assets': './assets',
            '@navigation': './src/navigation',
            '@config': './src/config',
            '@hooks': './src/hooks',
          },
        },
      ],
    ],
  };
};
