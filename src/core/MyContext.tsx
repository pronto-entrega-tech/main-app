import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { Product } from '~/components/ProdItem';
import { add, money, Money, multiply } from '~/functions/converter';
import {
  getActiveMarketId,
  getFavorites,
  getShoppingList,
  getIsGuest,
  getCity,
  saveIsGuest,
  saveShoppingList,
  saveNotify,
  saveActiveMarketId,
  saveFavorites,
} from '~/core/dataStorage';
import { Router } from 'next/router';

interface MyContextValues {
  hasNavigated: React.MutableRefObject<boolean>;
  isGuest: boolean;
  setIsGuest: (isGuest: boolean) => Promise<void>;
  refresh: boolean;
  subtotal: Money;
  setSubtotal: React.Dispatch<React.SetStateAction<Money>>;
  shoppingList: Map<
    string,
    {
      quantity: number;
      item: Product;
    }
  >;
  setShoppingList: React.Dispatch<
    React.SetStateAction<
      Map<
        string,
        {
          quantity: number;
          item: Product;
        }
      >
    >
  >;
  notify: Map<string, Product>;
  onPressNot: (item: Product) => void;
  favorites: Map<string, Product>;
  onPressFav: (item: Product) => void;
  onPressAdd: (item: Product) => void;
  onPressRemove: (item: Product) => void;
  setActiveMarketId: React.Dispatch<React.SetStateAction<string>>;
  modalState: {
    message: string;
    long?: boolean;
  };
  toast: (message: string, long?: boolean) => void;
  modalRefresh: boolean;
}

const MyContext = React.createContext({} as MyContextValues);

function useMyContext() {
  const context = React.useContext(MyContext);
  if (!context) {
    throw new Error(`useMyContext must be used within a MyContext`);
  }
  return context;
}

type shoppingList = Map<string, { quantity: number; item: Product }>;

export function MyProvider(props: any) {
  const [isGuest, setIsGuest] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [subtotal, setSubtotal] = useState(money('0'));
  const [city, setCity] = useState('');
  const [activeMarketId, setActiveMarketId] = useState('');
  const [shoppingList, setShoppingList] = useState<shoppingList>(new Map());
  const [notify, setNotify] = useState<Map<string, Product>>(new Map());
  const [favorites, setFavorites] = useState<Map<string, Product>>(new Map());
  const setSaveIsGuest = async (isGuest: boolean) => {
    setIsGuest(isGuest);
    await saveIsGuest(isGuest);
  };
  const doRefresh = () => setRefresh((c) => !c);
  const [modalRefresh, setModalRefresh] = useState<boolean>(false);
  const doModalRefresh = () => setModalRefresh((c) => !c);
  const [modalState, setModalState] = useState({
    message: '',
    long: false,
  });

  const hasNavigated = useRef(false);

  useEffect(() => {
    getIsGuest().then(setIsGuest);

    getCity().then(setCity);

    getActiveMarketId().then(setActiveMarketId);

    getFavorites().then(setFavorites);

    getShoppingList().then((list) => {
      setSubtotal(updateCart(list));
      setShoppingList(list);
    });

    const onRouteChange = () => {
      hasNavigated.current = true;
    };
    Router.events.on('routeChangeComplete', onRouteChange);
    return () => {
      Router.events.off('routeChangeComplete', onRouteChange);
    };
  }, []);

  const toast = (message: string, long = false) => {
    setModalState({
      message: message,
      long: long,
    });
    doModalRefresh();
  };

  const onPressNot = (item: Product) => {
    const isNotify = notify.has(item.prod_id);
    if (isNotify) {
      if (!notify.delete(item.prod_id)) return alert('Erro ao remover produto');

      setNotify(notify);
      saveNotify(notify);
      doRefresh();
    } else {
      const newNotify = notify.set(item.prod_id, item);
      setNotify(newNotify);
      saveNotify(newNotify);
      doRefresh();
    }
  };

  const onPressFav = (item: Product) => {
    const isFavorite = favorites.has(item.prod_id);
    if (isFavorite) {
      if (!favorites.delete(item.prod_id))
        return alert('Erro ao remover produto');

      setFavorites(favorites);
      saveFavorites(favorites);
      doRefresh();
    } else {
      const newFavorites = favorites.set(item.prod_id, item);
      setFavorites(newFavorites);
      saveFavorites(newFavorites);
      doRefresh();
    }
  };

  const onPressAdd = (item: Product) => {
    if (activeMarketId === '') {
      saveActiveMarketId(item.market_id, city);
      setActiveMarketId(item.market_id);
    } else if (item.market_id !== activeMarketId)
      return alert(
        'O carrinho já possui itens de outro mercado'
        /* 'Deseja limpar o carrinho?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Confirmar',
            onPress: () => {
              saveActiveMarketId(item.market_id, city);
              setActiveMarketId(item.market_id);
              const newShoppingList = new Map([
                [item.prod_id, { quantity: 1, item: item }],
              ]);
              setShoppingList(newShoppingList);
              setSubtotal(updateCart(newShoppingList));
              saveShoppingList(newShoppingList);
              doRefresh();
            },
          },
        ],
        { cancelable: true } */
      );

    const value = shoppingList.get(item.prod_id)?.quantity ?? 0;

    if (value >= 99) return alert('Quantidade máxima permitida de 99');

    shoppingList.set(item.prod_id, { quantity: value + 1, item: item });
    setShoppingList(shoppingList);
    setSubtotal(updateCart(shoppingList));
    saveShoppingList(shoppingList);
    doRefresh();
  };

  const onPressRemove = (item: Product) => {
    const value = shoppingList.get(item.prod_id)?.quantity;
    if (!value)
      return alert('Erro ao remover produto' /* , 'Tente novamente' */);

    if (value > 1) {
      setShoppingList((shoppingList) =>
        shoppingList.set(item.prod_id, { quantity: value - 1, item: item })
      );
      setSubtotal(updateCart(shoppingList));
      saveShoppingList(shoppingList);
      doRefresh();
    } else if (value === 1) {
      if (!shoppingList.delete(item.prod_id))
        return alert('Erro ao remover produto');

      if (shoppingList.size === 0) {
        saveActiveMarketId('');
        setActiveMarketId('');
      }
      setShoppingList(shoppingList);
      setSubtotal(updateCart(shoppingList));
      saveShoppingList(shoppingList);
      doRefresh();
    }
  };

  return (
    <MyContext.Provider
      value={{
        hasNavigated,
        refresh,
        isGuest,
        setIsGuest: setSaveIsGuest,
        subtotal,
        setSubtotal,
        shoppingList,
        setShoppingList,
        notify,
        onPressNot,
        favorites,
        onPressFav,
        onPressAdd: useCallback(onPressAdd, [
          activeMarketId,
          city,
          shoppingList,
        ]),
        onPressRemove: useCallback(onPressRemove, [shoppingList]),
        setActiveMarketId,
        modalState,
        modalRefresh,
        toast,
      }}
      {...props}
    />
  );
}

function updateCart(
  shoppingList: Map<string, { quantity: number; item: Product }>
) {
  let final = money('0');
  if (!shoppingList || shoppingList.size === 0) return final;
  const keys = Array.from(shoppingList.keys());

  for (const i of keys) {
    const item = shoppingList.get(i);
    if (item) final = add(final, multiply(item.item.price, item.quantity));
  }
  return final;
}

export default useMyContext;
