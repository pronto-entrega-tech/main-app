import { Market, MarketRating } from '~/core/models';
import { validateMarket } from '~/functions/converter';
import { SearchParams } from './products';
import Utils from './utils';

const { ApiClient } = Utils;

type MarketParams = Omit<SearchParams, 'categories' | 'ids'>;

export const apiMarkets = {
  async findMany(city: string, params: MarketParams) {
    const { data } = await ApiClient.get(`/markets/${city}`, { params });
    return data.map(validateMarket) as Market[];
  },

  async findOne(city: string, marketId: string) {
    const { data } = await ApiClient.get(`/markets/${city}/${marketId}`);
    return validateMarket(data);
  },

  async reviews(city: string, marketId: string) {
    const { data } = await ApiClient.get(
      `/markets/${city}/${marketId}/reviews`,
    );
    return data as MarketRating;
  },
};
