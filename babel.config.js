module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '~': './src',
            '@pages': './pages',
            '@public': './public',
            '@styles': './styles',
          },
        },
      ],
      'transform-inline-environment-variables',
      'babel-plugin-styled-components',
      'react-native-reanimated/plugin',
    ],
  };
};
