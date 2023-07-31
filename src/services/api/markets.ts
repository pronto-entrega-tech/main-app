import { Market, MarketRating } from '~/core/models';
import { validateMarket } from '~/functions/converter';
import { SearchParams } from './products';
import Utils from './utils';

const { ApiClient } = Utils;

type MarketParams = Omit<SearchParams, 'categories' | 'ids'>;

const findMany = async (city: string, params: MarketParams) => {
  const { data } = await ApiClient.get(`/markets/${city}`, { params });
  return data.map(validateMarket) as Market[];
};

const findOne = async (city: string, marketId: string) => {
  const { data } = await ApiClient.get(`/markets/${city}/${marketId}`);
  return validateMarket(data);
};

const reviews = async (city: string, marketId: string) => {
  const { data } = await ApiClient.get(`/markets/${city}/${marketId}/reviews`);
  return data as MarketRating;
};

export const apiMarkets = { findMany, findOne, reviews };
