import { useCallback, useEffect, useRef, useState } from "react";
import { useAlertContext } from "~/contexts/AlertContext";
import { calcSubtotal } from "~/functions/calcSubtotal";
import { pick } from "~/functions/converter";
import { createContext } from "~/contexts/createContext";
import { money } from "~/functions/money";
import { api } from "~/services/api";
import {
  getActiveMarketId,
  getLastPayment,
  getShoppingList,
  saveActiveMarketId,
  saveLastPayment,
  saveShoppingList,
} from "../services/localStorage";
import {
  Market,
  OrderPayment,
  OrderSchedule,
  Product,
  ShoppingList,
} from "../core/models";
import { useStateToRef } from "~/hooks/useStateToRef";

type FullMarketId = { market_id?: string; city_slug?: string };

function useCart() {
  const { alert } = useAlertContext();
  const [subtotal, setSubtotal] = useState(money("0"));
  const [totalOff, setTotalOff] = useState(money("0"));
  const [shoppingList, _setShoppingList] = useState<ShoppingList>();
  const shoppingListRef = useStateToRef(shoppingList);
  const [activeMarketId, _setActiveMarketId] = useState<FullMarketId>({});
  const activeMarketIdRef = useStateToRef(activeMarketId.market_id);
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
    _setActiveMarketId(pick(v, "market_id", "city_slug"));
    saveActiveMarketId(v.market_id, v.city_slug);
  };

  const cleanCart = () => {
    setShoppingList(new Map());
    setActiveMarketId({});
  };

  const setPayment = useCallback((v: OrderPayment | null) => {
    _setPayment(v);
    saveLastPayment(v);
  }, []);

  const loadLastPayment = useCallback(
    async (token: string) => {
      if (payment !== undefined) return;

      const [lastPayment, paymentCards] = await Promise.all([
        getLastPayment(),
        api.paymentCards.find(token),
      ]);

      const hasCardSaved = () =>
        paymentCards.find((c) => c.id === lastPayment?.cardId);

      if (!lastPayment?.cardId || hasCardSaved()) _setPayment(lastPayment);
    },
    [payment],
  );

  const addProduct = (item: Product) => {
    const shoppingList = shoppingListRef.current;

    if (!activeMarketIdRef.current) {
      setActiveMarketId(item);
    } else if (item.market_id !== activeMarketIdRef.current)
      return alert(
        "O carrinho já possui itens de outro mercado",
        "Deseja limpar o carrinho?",
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

    if (value >= 99) return alert("Quantidade máxima permitida de 99");

    const newShoppingList = new Map(shoppingList).set(item.item_id, {
      quantity: value + 1,
      item: item,
    });
    setShoppingList(newShoppingList);
  };

  const removeProduct = (item: Product) => {
    const shoppingList = shoppingListRef.current;

    const value = shoppingList?.get(item.item_id)?.quantity;
    if (!value) return alert("Erro ao remover produto");

    if (value > 1) {
      const newShoppingList = new Map(shoppingList).set(item.item_id, {
        quantity: value - 1,
        item: item,
      });

      setShoppingList(newShoppingList);
    } else if (value === 1) {
      const newShoppingList = new Map(shoppingList);

      if (!newShoppingList.delete(item.item_id))
        return alert("Erro ao remover produto");

      if (!newShoppingList.size) setActiveMarketId({});

      setShoppingList(newShoppingList);
    }
  };

  const refetchCartItems = useCallback(
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
  }, []);

  useEffect(() => {
    getShoppingList().then((list) => {
      _setShoppingList(list);
      updateTotal(list);

      refetchCartItems(list);
    });
  }, [refetchCartItems]);

  return {
    subtotal,
    totalOff,
    total,
    shoppingList,
    refetchCartItems: useCallback(
      () => shoppingList && refetchCartItems(shoppingList),
      [shoppingList, refetchCartItems],
    ),
    cleanCart: useCallback(cleanCart, [setShoppingList]),
    addProduct: useCallback(addProduct, [
      alert,
      activeMarketIdRef,
      shoppingListRef,
      setShoppingList,
    ]),
    removeProduct: useCallback(removeProduct, [
      shoppingListRef,
      alert,
      setShoppingList,
    ]),
    activeMarketId,
    activeMarket,
    setActiveMarket,
    payment,
    setPayment,
    loadLastPayment,
    activeSchedule,
    setActiveSchedule,
    schedules,
    setSchedules,
  };
}

export const [CartProvider, useCartContext, useCartContextSelector] =
  createContext(useCart);
