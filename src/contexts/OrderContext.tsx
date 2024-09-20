import { useState, useCallback } from "react";
import { createContext } from "~/contexts/createContext";
import { CreateOrder, Order } from "~/core/models";
import { api } from "~/services/api";

function useOrder() {
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
}

export const [OrderProvider, useOrderContext, useOrderContextSelector] =
  createContext(useOrder);
