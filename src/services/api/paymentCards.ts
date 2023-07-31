import {
  CreatePaymentCard,
  PaymentCard,
  UpdatePaymentCard,
} from '~/core/models';
import Utils from './utils';

const { ApiClient, authHeader } = Utils;

const create = async (token: string, card: CreatePaymentCard) => {
  const { data } = await ApiClient.post(
    `/customers/cards`,
    card,
    authHeader(token)
  );

  return data as any;
};

const find = async (token: string) => {
  const { data } = await ApiClient.get(`/customers/cards`, authHeader(token));

  return data as PaymentCard[];
};

const update = async (token: string, card: UpdatePaymentCard) => {
  const { data } = await ApiClient.patch(
    `/customers/cards/${card.id}`,
    card,
    authHeader(token)
  );

  return data as any;
};

const remove = async (token: string, id: PaymentCard['id']) => {
  const { data } = await ApiClient.delete(
    `/customers/cards/${id}`,
    authHeader(token)
  );

  return data as any;
};

export const apiPaymentCards = { create, find, update, remove };
