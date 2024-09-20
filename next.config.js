// @ts-check
const withPlugins = require("next-compose-plugins");
const { withExpo } = require("@expo/next-adapter");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const os = require("node:os");

const isDev = process.env.NODE_ENV !== "production";

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = withBundleAnalyzer(
  withExpo({
    images: {
      remotePatterns: [
        { hostname: isDev ? "*" : "static.prontoentrega.com.br" },
      ],
    },
    reactStrictMode: true,
    swcMinify: true,
    transpilePackages: [
      "react-native",
      "react-native-web",
      "react-native-reanimated",
      "expo",
      "expo-modules-core",
      "expo-linking",
      "expo-constants",
      "expo-notifications",
      "expo-application",
      "expo-location",
      "moti",
    ],
    experimental: { forceSwcTransforms: true },
  }),
);

module.exports = withPlugins([withExpo, withBundleAnalyzer], nextConfig);

const lanIp =
  os.networkInterfaces().en0?.find((v) => v.family === "IPv4")?.address ??
  fail("Missing LAN IP");

process.env.NEXT_PUBLIC_LAN_IP = lanIp;
