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
    { params: { useCookie } },
  );
  return data as { access_token: string; refresh_token?: string };
};

const email = async (email: string) => {
  const { data } = await ApiClient.post('/auth/email', { role, email });
  return data as {
    status: 'Success';
    key: string;
  };
};

const validate = async (key: string, otp: string) => {
  const { data } = await ApiClient.post(
    '/auth/validate',
    { role, key, otp },
    { params: { useCookie } },
  );
  return data as {
    type: 'CREATE' | 'CONNECT' | 'ACCESS';
    token: string;
    session?: {
      refresh_token: string;
      expiresIn: Date;
    };
  };
};

const revalidate = async (refreshToken?: string) => {
  const fetch = () =>
    ApiClient.post(
      `/auth/revalidate`,
      { role },
      { params: { useCookie, refreshToken } },
    );
  const { data } = await (refreshToken
    ? withCache(refreshToken, fetch)
    : fetch());

  return data as { access_token: string; refresh_token?: string };
};

const signOut = async (refreshToken?: string) => {
  await ApiClient.post(
    `/auth/sign-out`,
    { role },
    { params: { refreshToken } },
  );
};

export const apiAuth = { social, email, validate, revalidate, signOut };
