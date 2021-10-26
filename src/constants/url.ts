// Set true to use a dev API
const USE_DEV_API = false;

const SSR_API = process.env.SSR_API;
const SSR_STATIC = process.env.SSR_STATIC;

const DEV_API = 'http://192.168.15.12:3000';
const PROD_API = SSR_API ?? 'https://api.prontoentrega.com.br';

export const WWW = 'https://prontoentrega.com.br';
export const STATIC = SSR_STATIC ?? 'https://static.prontoentrega.com.br';

export const API = USE_DEV_API && __DEV__ ? DEV_API : PROD_API;
