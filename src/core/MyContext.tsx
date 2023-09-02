import React, {
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createContext } from 'use-context-selector';
import { createUseContext } from '~/functions/converter';
import { saveNotifies, saveFavorites, getFavorites } from '~/core/dataStorage';
import { Router } from 'next/router';
import { Product } from './models';
import { ToastState } from '~/components/MyToast';
import { AlertState } from '~/components/MyAlert';

export type MyContextValues = {
  notify: Map<string, Product>;
  setNotify: (item: Product) => void;
  favorites: Map<string, Product>;
  setFav: (item: Product) => void;
  hasNavigated: MutableRefObject<boolean>;
  toastState: ToastState;
  toast: (message: string, opts?: Omit<ToastState, 'message'>) => void;
  alertState?: AlertState;
  alert: (
    title: string,
    subtitle?: string,
    opts?: Omit<AlertState, 'title' | 'subtitle'>,
  ) => void;
  dismissAlert: () => void;
};

const MyContext = createContext({} as MyContextValues);

const useMyContext = createUseContext(MyContext);
export default useMyContext;

export const MyProvider = (props: { children: ReactNode }) => {
  const [notify, setNotifies] = useState(new Map<string, Product>());
  const [favorites, setFavorites] = useState(new Map<string, Product>());
  const [toastState, setToastState] = useState<ToastState>({ message: '' });
  const [alertState, setAlertState] = useState<AlertState>();

  const hasNavigated = useRef(false);

  useEffect(() => {
    getFavorites().then(setFavorites);

    const onRouteChange = () => {
      hasNavigated.current = true;
    };

    Router.events.on('routeChangeComplete', onRouteChange);
    return () => Router.events.off('routeChangeComplete', onRouteChange);
  }, []);

  const setNotify: MyContextValues['setNotify'] = (item) => {
    const isNotify = notify.has(item.item_id);
    const newNotify = new Map(notify);

    if (isNotify) {
      if (!newNotify.delete(item.item_id)) alert('Erro ao remover produto');
    } else {
      newNotify.set(item.item_id, item);
    }

    setNotifies(newNotify);
    saveNotifies(newNotify);
  };

  const setFav: MyContextValues['setFav'] = (item) => {
    const isFavorite = favorites.has(item.item_id);
    const newFavorites = new Map(favorites);

    if (isFavorite) {
      if (!newFavorites.delete(item.item_id)) alert('Erro ao remover produto');
    } else {
      newFavorites.set(item.item_id, item);
    }

    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const toast: MyContextValues['toast'] = (message, opts) => {
    setToastState({ message, ...opts });
  };

  const alert: MyContextValues['alert'] = useCallback(
    (title, subtitle, opts) => setAlertState({ title, subtitle, ...opts }),
    [],
  );

  const dismissAlert = () => {
    setAlertState(undefined);
  };

  return (
    <MyContext.Provider
      value={{
        notify,
        setNotify: useCallback(setNotify, [notify, alert]),
        favorites,
        setFav: useCallback(setFav, [favorites, alert]),
        hasNavigated,
        toastState,
        toast: useCallback(toast, []),
        alertState,
        alert,
        dismissAlert: useCallback(dismissAlert, []),
      }}
      {...props}
    />
  );
};
