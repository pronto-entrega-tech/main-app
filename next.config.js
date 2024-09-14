// @ts-check
// Learn more: https://github.com/expo/expo/blob/master/docs/pages/versions/unversioned/guides/using-nextjs.md#withexpo

const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')(['react-native-web', 'moti']);
const WithFonts = require('next-fonts');
const { withExpo } = require('@expo/next-adapter');
const withPwa = require('next-pwa');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const isDev = process.env.NODE_ENV !== 'production';

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  images: {
    domains: ['static.prontoentrega.com.br'],
  },
  experimental: { forceSwcTransforms: true },
  /* reactStrictMode: true, */
};

module.exports = withPlugins(
  [
    withTM,
    WithFonts,
    [withExpo, { projectRoot: __dirname }],
    withBundleAnalyzer,
    [withPwa, { pwa: { disable: isDev } }],
  ],
  nextConfig,
);
