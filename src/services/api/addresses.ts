import { Address } from '~/core/models';
import Utils from './utils';

const { ApiClient, authHeader } = Utils;

const convert = ({ coords, ...a }: Address) => ({
  ...a,
  latitude: coords?.lat,
  longitude: coords?.lng,
});

const create = async (token: string, address: Address) => {
  const { data } = await ApiClient.post(
    `/customers/addresses`,
    convert(address),
    authHeader(token)
  );

  return data as { id: string };
};

const find = async (token: string) => {
  const { data } = await ApiClient.get(
    `/customers/addresses`,
    authHeader(token)
  );

  return data as Address[];
};

const update = async (token: string, address: Address) => {
  const { data } = await ApiClient.patch(
    `/customers/addresses/${address.id}`,
    convert(address),
    authHeader(token)
  );

  return data as any;
};

const remove = async (token: string, id: Address['id']) => {
  const { data } = await ApiClient.delete(
    `/customers/addresses/${id}`,
    authHeader(token)
  );

  return data as any;
};

export const apiAddresses = { create, find, update, remove };
