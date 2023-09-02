import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { createContext } from 'use-context-selector';
import useMyContext from '~/core/MyContext';
import { calcSubtotal } from '~/functions/calcSubtotal';
import { createUseContext, pick } from '~/functions/converter';
import { money, Money } from '~/functions/money';
import { api } from '~/services/api';
import {
  getActiveMarketId,
  getLastPayment,
  getShoppingList,
  saveActiveMarketId,
  saveLastPayment,
  saveShoppingList,
} from '../core/dataStorage';
import {
  Market,
  OrderPayment,
  OrderSchedule,
  Product,
  SetState,
  ShoppingList,
} from '../core/models';

type FullMarketId = { market_id?: string; city_slug?: string };

type CartValue = {
  subtotal: Money;
  totalOff: Money;
  total: Money;
  shoppingList?: ShoppingList;
  revalidateCart: () => Promise<void> | undefined;
  cleanCart: () => void;
  addProduct: (item: Product) => void;
  removeProduct: (item: Product) => void;
  payment?: OrderPayment | null;
  setPayment: (v: OrderPayment | null) => void;
  loadLastPayment: (token: string) => Promise<void>;
  activeMarketId: FullMarketId;
  activeMarket?: Market;
  setActiveMarket: SetState<Market | undefined>;
  activeSchedule: OrderSchedule | undefined;
  setActiveSchedule: SetState<OrderSchedule | undefined>;
  schedules: OrderSchedule[] | undefined;
  setSchedules: SetState<OrderSchedule[] | undefined>;
};

const CartContext = createContext({} as CartValue);

export const useCartContext = createUseContext(CartContext);

export const CartProvider = (props: { children: ReactNode }) => {
  const { alert } = useMyContext();
  const [subtotal, setSubtotal] = useState(money('0'));
  const [totalOff, setTotalOff] = useState(money('0'));
  const [shoppingList, _setShoppingList] = useState<ShoppingList>();
  const [activeMarketId, _setActiveMarketId] = useState<FullMarketId>({});
  const [activeMarket, setActiveMarket] = useState<Market>();
  const [payment, _setPayment] = useState<OrderPayment | null>();
  const [activeSchedule, setActiveSchedule] = useState<OrderSchedule>();
  const [schedules, setSchedules] = useState<OrderSchedule[]>();

  const total = money.plus(subtotal, activeMarket?.delivery_fee ?? 0);

  const updateTotal = (v: ShoppingList) => {
    const { subtotal, totalOff } = calcSubtotal(v);
    setSubtotal(subtotal);
    setTotalOff(totalOff);
  };

  const setShoppingList = useCallback((v: ShoppingList) => {
    _setShoppingList(v);
    saveShoppingList(v);
    updateTotal(v);
  }, []);

  const setActiveMarketId = (v: FullMarketId) => {
    _setActiveMarketId(pick(v, 'market_id', 'city_slug'));
    saveActiveMarketId(v.market_id, v.city_slug);
  };

  const cleanCart = () => {
    setShoppingList(new Map());
    setActiveMarketId({});
  };

  const setPayment = (v: OrderPayment | null) => {
    _setPayment(v);
    saveLastPayment(v);
  };

  const loadLastPayment = async (token: string) => {
    if (payment !== undefined) return;

    const [lastPayment, paymentCards] = await Promise.all([
      getLastPayment(),
      api.paymentCards.find(token),
    ]);

    const hasCardSaved = () =>
      paymentCards.find((c) => c.id === lastPayment?.cardId);

    if (!lastPayment?.cardId || hasCardSaved()) _setPayment(lastPayment);
  };

  const addProduct = (item: Product) => {
    if (!activeMarketId.market_id) {
      setActiveMarketId(item);
    } else if (item.market_id !== activeMarketId.market_id)
      return alert(
        'O carrinho já possui itens de outro mercado',
        'Deseja limpar o carrinho?',
        {
          onConfirm: () => {
            setActiveMarketId(item);
            const newShoppingList = new Map([
              [item.item_id, { quantity: 1, item: item }],
            ]);
            setShoppingList(newShoppingList);
          },
        },
      );

    const value = shoppingList?.get(item.item_id)?.quantity ?? 0;

    if (value >= 99) return alert('Quantidade máxima permitida de 99');

    const newShoppingList = new Map(shoppingList).set(item.item_id, {
      quantity: value + 1,
      item: item,
    });
    setShoppingList(newShoppingList);
  };

  const removeProduct = (item: Product) => {
    const value = shoppingList?.get(item.item_id)?.quantity;
    if (!value) return alert('Erro ao remover produto');

    if (value > 1) {
      const newShoppingList = new Map(shoppingList).set(item.item_id, {
        quantity: value - 1,
        item: item,
      });

      setShoppingList(newShoppingList);
    } else if (value === 1) {
      const newShoppingList = new Map(shoppingList);

      if (!newShoppingList.delete(item.item_id))
        return alert('Erro ao remover produto');

      if (!newShoppingList.size) setActiveMarketId({});

      setShoppingList(newShoppingList);
    }
  };

  const revalidateCart = useCallback(
    async (list: ShoppingList) => {
      const { city_slug: city } = [...list][0]?.[1].item ?? {};
      if (!city) return;

      const items = await api.products.findMany(city, {
        ids: [...list].map(([id]) => id),
      });

      const newList = items.map((item) => {
        const quantity = list.get(item.item_id)?.quantity ?? 0;

        return [item.item_id, { quantity, item }] as const;
      });
      setShoppingList(new Map(newList));
    },
    [setShoppingList],
  );

  useEffect(() => {
    getActiveMarketId().then(_setActiveMarketId);

    getShoppingList().then(async (list) => {
      _setShoppingList(list);
      updateTotal(list);

      revalidateCart(list);
    });
  }, [setShoppingList, revalidateCart]);

  return (
    <CartContext.Provider
      value={{
        subtotal,
        totalOff,
        total,
        shoppingList,
        revalidateCart: useCallback(
          () => shoppingList && revalidateCart(shoppingList),
          [shoppingList, revalidateCart],
        ),
        cleanCart: useCallback(cleanCart, [setShoppingList]),
        addProduct: useCallback(addProduct, [
          activeMarketId.market_id,
          shoppingList,
          setShoppingList,
          alert,
        ]),
        removeProduct: useCallback(removeProduct, [
          shoppingList,
          setShoppingList,
          alert,
        ]),
        activeMarketId,
        activeMarket,
        setActiveMarket,
        payment,
        setPayment: useCallback(setPayment, []),
        loadLastPayment: useCallback(loadLastPayment, [payment]),
        activeSchedule,
        setActiveSchedule,
        schedules,
        setSchedules,
      }}
      {...props}
    />
  );
};
