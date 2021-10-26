import axios from 'axios';
import { stringify } from 'qs';
import { API, STATIC } from '~/constants/url';
import {
  createMercItem,
  createMercList,
  createProdItem,
  createProdList,
} from '~/functions/converter';

interface res {
  data: any;
}

const paramsSerializer = (params: any) =>
  stringify(params, { arrayFormat: 'repeat' });

const callApi = axios.create({
  baseURL: API,
  paramsSerializer,
});

const callStatic = axios.create({
  baseURL: STATIC,
  paramsSerializer,
});

export interface SearchParams {
  categories?: (string | number)[];
  search?: string;
}
export async function getProdFeed(city: string, params?: SearchParams) {
  const { data } = await callApi.get(`/products/${city}`, {
    params,
  });
  return createProdList(data);
}

export async function getProdFeedByMarket(
  city: string,
  market: string,
  params?: SearchParams
) {
  const { data } = await callApi.get(`/products/${city}/${market}`, {
    params,
  });
  return createProdList(data);
}

export async function getProd(city: string, marketId: string, prodId: string) {
  const { data } = await callApi.get(`/products/${city}/${marketId}/${prodId}`);
  return createProdItem(data);
}

export async function getMarketFeed(city: string) {
  const { data } = await callApi.get(`/market/${city}`);
  return createMercList(data);
}

export async function getMarket(city: string, id: string) {
  const { data } = await callApi.get(`/market/${city}/${id}`);
  return createMercItem(data);
}

const API_URL = '';
export async function fetchPaymentIntentClientSecret(title: string, cart: any) {
  const postData = {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      currency: 'brl',
      items: title === 'GooglePay' ? [{ id: 'id' }] : cart,
      force3dSecure: true,
    }),
  };

  const { data }: res = await axios.post('/create-payment-intent', postData, {
    baseURL: API_URL,
  });

  return data.clientSecret;
}

export async function getSlidesJson() {
  const { data } = await callStatic.get('/slide/slides.json');
  return data as string[];
}
