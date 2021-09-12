import axios from 'axios';
import qs from 'qs';

// Set true to use a dev API
const USE_DEV_API = false;

const DEV_API = 'http://192.168.15.12:3000/';
const PROD_API = 'https://api.prontoentrega.com.br/';

export default 'https://prontoentrega.com.br/';
export const STATIC = 'https://static.prontoentrega.com.br/';

export const API = USE_DEV_API && __DEV__ ? DEV_API : PROD_API;

export interface searchParams {
  categories?: number[];
  search?: string;
}
export function getProdFeed(city: string, params?: searchParams) {
  return axios.get(`${API}products/${city}/`, {
    params,
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: 'repeat' }),
  });
}

export function getProdFeedByMarket(
  city: string,
  market?: string,
  params?: searchParams
) {
  return axios.get(`${API}products/${city}/${market}`, {
    params,
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: 'repeat' }),
  });
}

export function getProd(city: string, marketId: string, prodId: string) {
  return axios.get(`${API}products/${city}/${marketId}/${prodId}`);
}

export function getMarketFeed(city: string) {
  return axios.get(`${API}market/${city}`);
}

export function getMarket(city: string, id: string) {
  return axios.get(`${API}market/${city}/${id}`);
}

const API_URL = '';
export async function fetchPaymentIntentClientSecret(title: string, cart: any) {
  const {
    data: { clientSecret },
  } = await axios.post(`${API_URL}/create-payment-intent`, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      currency: 'brl',
      items: title === 'GooglePay' ? [{ id: 'id' }] : cart,
      force3dSecure: true,
    }),
  });
  return clientSecret;
}

export function getSlidesJson() {
  return axios.get(`${STATIC}slide/slides.json`);
}
