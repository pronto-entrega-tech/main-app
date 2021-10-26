module.exports = function (api) {
  api.cache(true);
  const isWeb = process.env.WEB === 'true';
  return {
    presets: [isWeb ? '@expo/next-adapter/babel' : 'babel-preset-expo'],
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
      'react-native-reanimated/plugin',
      isWeb
        ? ([
            '@babel/plugin-proposal-private-property-in-object',
            { loose: true },
          ],
          ['@babel/plugin-proposal-private-methods', { loose: true }])
        : {},
    ],
  };
};
