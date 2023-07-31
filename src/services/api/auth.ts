import { device } from '~/constants';
import { withCache } from '../cache';
import Utils from './utils';

const { ApiClient } = Utils;

const role = 'CUSTOMER';
const useCookie = device.web;

type Provider = 'GOOGLE';
const social = async (provider: Provider, token: string) => {
  const { data } = await ApiClient.post(
    `/customers/social`,
    { provider, token },
    { params: { useCookie } }
  );

  return data as any;
};

const email = async (email: string) => {
  type Res = {
    status: 'Success';
    key: string;
  };
  const { data } = await ApiClient.post<Res>('/auth/email', { role, email });
  return data;
};

const validate = async (key: string, otp: string) => {
  type Res = {
    type: 'CREATE' | 'CONNECT' | 'ACCESS';
    token: string;
    session?: {
      refresh_token: string;
      expiresIn: Date;
    };
  };
  const { data } = await ApiClient.post<Res>(
    '/auth/validate',
    { role, key, otp },
    { params: { useCookie } }
  );
  return data;
};

const revalidate = async (refreshToken?: string) => {
  type Res = { access_token: string; refresh_token?: string };
  const fetch = () =>
    ApiClient.post<Res>(
      `/auth/revalidate`,
      { role },
      { params: { useCookie, refreshToken } }
    );
  const { data } = await (refreshToken
    ? withCache(refreshToken, fetch)
    : fetch());

  return data;
};

const signOut = async (refreshToken?: string) => {
  const { data } = await ApiClient.post(
    `/auth/sign-out`,
    { role },
    { params: { refreshToken } }
  );

  return data as any;
};

export const apiAuth = { social, email, validate, revalidate, signOut };
