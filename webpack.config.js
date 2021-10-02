const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  /* config.plugins = [
    new CspHtmlWebpackPlugin({
      'base-uri': ["'self'"],
      'object-src': ["'none'"],
      'script-src': ["'self'"],
      'style-src': ["'unsafe-inline'"],
      'img-src': ['self', 'static.prontoentrega.com.br'],
    }),
  ]; */

  /* if (env.mode === 'development') {
  } */

  if (env.mode === 'production') {
    /* config.plugins.push(
      new BundleAnalyzerPlugin({
        path: 'web-report',
      })
    ); */
  }
  return config;
};
