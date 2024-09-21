import { ExpoConfig, ConfigContext } from "expo/config";
import os from "node:os";
import { fail } from "node:assert";

const lanIp =
  os.networkInterfaces().en0?.find((v) => v.family === "IPv4")?.address ??
  fail("Missing LAN IP");

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: config.name!,
    slug: config.slug!,

    extra: {
      ...config.extra,
      lanIp,
    },
  };
};
