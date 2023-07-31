import { apiAddresses } from './addresses';
import { apiAuth } from './auth';
import { apiCustomers } from './customers';
import errors from './error';
import { apiLocation } from './location';
import { apiMarkets } from './markets';
import { apiOrders } from './orders';
import chats from './chats';
import { apiPaymentCards } from './paymentCards';
import { apiProducts } from './products';

export const api = {
  ...errors,
  addresses: apiAddresses,
  auth: apiAuth,
  customers: apiCustomers,
  location: apiLocation,
  markets: apiMarkets,
  orders: apiOrders,
  chats,
  paymentCards: apiPaymentCards,
  products: apiProducts,
};
