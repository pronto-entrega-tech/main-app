// @ts-check
const { withExpo } = require('@expo/next-adapter');
const os = require('node:os');

const isDev = process.env.NODE_ENV !== 'production';

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = withExpo({
  images: {
    remotePatterns: [{ hostname: isDev ? '*' : 'static.prontoentrega.com.br' }],
  },
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    'react-native',
    'react-native-web',
    'react-native-reanimated',
    'expo',
    'expo-modules-core',
    'expo-linking',
    'expo-constants',
    'expo-notifications',
    'expo-application',
    'expo-location',
    'moti',
  ],
  experimental: { forceSwcTransforms: true },
});

module.exports = nextConfig;

const lanIp =
  os.networkInterfaces().en0?.find((v) => v.family === 'IPv4')?.address ??
  fail('Missing LAN IP');

process.env.NEXT_PUBLIC_LAN_IP = lanIp;
