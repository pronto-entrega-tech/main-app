import {
  Order,
  CreateOrder,
  Market,
  ReviewOrder,
  Review,
  RetryPayment,
  CancelOrder,
} from '~/core/models';
import { validateOrder } from '~/functions/converter';
import Utils from './utils';

const { ApiClient, authHeader } = Utils;

export const apiOrders = {
  async create(token: string, order: CreateOrder) {
    const { data } = await ApiClient.post(`/orders`, order, authHeader(token));

    return validateOrder(data) as Order & { confirmation_token: string };
  },

  async findMany(token: string) {
    const { data } = await ApiClient.get<unknown[]>(
      `/orders`,
      authHeader(token),
    );

    return data.map(validateOrder);
  },

  async findOne(
    token: string,
    id: Order['order_id'],
    market_id: Market['market_id'],
  ) {
    const { data } = await ApiClient.get(
      `/orders/${market_id}/${id}`,
      authHeader(token),
    );

    return validateOrder(data);
  },

  async retryPayment(token: string, order: Order, dto: RetryPayment) {
    await ApiClient.post(
      `/orders/${order.market_id}/${order.order_id}/retry-payment`,
      dto,
      authHeader(token),
    );
  },

  async cancel(token: string, order: Order, dto: CancelOrder) {
    await ApiClient.post(
      `/orders/${order.market_id}/${order.order_id}/cancel`,
      dto,
      authHeader(token),
    );
  },

  async getConfirmationToken(token: string, order: Order) {
    const { data } = await ApiClient.post(
      `/orders/${order.market_id}/${order.order_id}/confirmation-token`,
      {},
      authHeader(token),
    );

    return data as { token: string };
  },

  async review(token: string, dto: ReviewOrder) {
    const { data } = await ApiClient.post(
      `/orders/${dto.market_id}/${dto.order_id}/review`,
      dto,
      authHeader(token),
    );

    return data as Review;
  },
};
