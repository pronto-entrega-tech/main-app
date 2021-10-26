// @ts-check
// Learn more: https://github.com/expo/expo/blob/master/docs/pages/versions/unversioned/guides/using-nextjs.md#withexpo

const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')(['react-native-web']);
const WithFonts = require('next-fonts');
const { withExpo } = require('@expo/next-adapter');
const withPwa = require('next-pwa');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const isDev = process.env.NODE_ENV === 'development';

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  /* reactStrictMode: true, */
  /* 
  webpack: (config) => {

    config
  
    return config;
  },
 */
};

module.exports = withPlugins(
  [
    withTM,
    WithFonts,
    [withExpo, { projectRoot: __dirname }],
    withBundleAnalyzer,
    [withPwa, { pwa: { disable: isDev } }],
  ],
  nextConfig
);
