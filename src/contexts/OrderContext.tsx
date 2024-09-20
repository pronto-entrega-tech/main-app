import React, { ReactNode, useCallback, useState } from 'react';
import { createContext } from 'use-context-selector';
import { CreateOrder, Order } from '~/core/models';
import { createUseContext } from '~/contexts/createContext';
import { api } from '~/services/api';

const useProviderValues = () => {
  const [orders, setOrders] = useState<Order[]>();

  const loadOrders = async (token: string) => {
    if (orders) return;

    setOrders(await api.orders.findMany(token));
  };

  const createOrder = async (token: string, dto: CreateOrder) => {
    const newOrder = await api.orders.create(token, dto);

    if (orders) setOrders([...orders, newOrder]);
    return newOrder;
  };

  return {
    orders,
    setOrders,
    loadOrders: useCallback(loadOrders, [orders]),
    createOrder: useCallback(createOrder, [orders]),
  };
};

type OrderContextValues = ReturnType<typeof useProviderValues>;

const OrderContext = createContext({} as OrderContextValues);

export const useOrderContext = createUseContext(OrderContext);

export const OrderProvider = (props: { children: ReactNode }) => (
  <OrderContext.Provider value={useProviderValues()} {...props} />
);
