const DEV_SERVER = process.env.ENV_MODE === 'dev';

const WWW = 'https://prontoentrega.com.br/';
const API = !DEV_SERVER
  ? 'https://api.prontoentrega.com.br/'
  : 'http://127.0.0.1:3000/';
const ASSETS = 'https://assets.prontoentrega.com.br/';

export default API;
