import Constants from "expo-constants";

const lanIp = Constants.expoConfig?.extra?.lanIp;

const USE_HTTPS = process.env.NEXT_PUBLIC_HTTPS === "true";
const SSR_API = process.env.SSR_API;
const SSR_STATIC = process.env.SSR_STATIC;

const DEV_API = `http${USE_HTTPS ? "s" : ""}://${lanIp ?? "localhost"}:3000`;
const PROD_API = SSR_API ?? "https://api.prontoentrega.com.br";

const DEV_STATIC = `${DEV_API}/static`;
const PROD_STATIC = SSR_STATIC ?? "https://static.prontoentrega.com.br";

const WWW = "https://prontoentrega.com.br";

const STATIC = lanIp || __DEV__ ? DEV_STATIC : PROD_STATIC;

const API = lanIp || __DEV__ ? DEV_API : PROD_API;

const API_WS = API.replace("3000", "3002");

export const Urls = { WWW, STATIC, API, API_WS };
