import { Banner, ItemOrderBy, Product } from "~/core/models";
import { validateProduct } from "~/functions/converter";
import Utils from "./utils";

const { ApiClient, StaticClient } = Utils;

export type SearchParams = {
  ids?: string[];
  marketId?: string;
  orderBy?: ItemOrderBy;
  categories?: (string | number)[];
  query?: string;
  latLong?: string;
  distance?: string | number;
};

const findMany = async (city: string, _params?: SearchParams) => {
  const { marketId, ...params } = _params ?? {};
  const market = marketId ? `/market/${marketId}` : "";

  const { data } = await ApiClient.get(`/items/${city}${market}`, { params });
  return data.map(validateProduct) as Product[];
};

const findOne = async (city: string, itemId: string) => {
  const { data } = await ApiClient.get(`/items/${city}/${itemId}`);
  return validateProduct(data);
};

const banners = async () => {
  const { data } = await StaticClient.get("/banners/meta.json");
  return data as Banner[];
};

export const apiProducts = { findMany, findOne, banners };
