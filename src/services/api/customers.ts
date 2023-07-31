import { device } from '~/constants';
import { Profile } from '~/core/models';
import Utils from './utils';

const { ApiClient, authHeader } = Utils;

const create = async (create_token: string, name: string) => {
  type Res = {
    access_token: string;
    refresh_token?: string;
    expires_in?: Date;
  };
  const { data } = await ApiClient.post<Res>(
    '/customers',
    { name },
    { params: { useCookie: device.web }, headers: { create_token } }
  );
  return data;
};

const find = async (access_token: string) => {
  const { data } = await ApiClient.get<Profile>(
    '/customers',
    authHeader(access_token)
  );
  return data;
};

type UpdateCustomer = {
  name?: string;
  document?: string;
  phone?: string;
};

const update = async (access_token: string, dto: UpdateCustomer) => {
  type Res = { name: string };
  const { data } = await ApiClient.patch<Res>(
    '/customers',
    dto,
    authHeader(access_token)
  );
  return data;
};

export const apiCustomers = { create, find, update };
