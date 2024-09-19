import {
  ReactNode,
  createContext as createContextOrig,
  useContext as useContextOrig,
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react';
import { Context, useContextSelector } from 'use-context-selector';

export const createUseContext = <T extends Record<string | symbol, unknown>>(
  context: Context<T>,
) => {
  return () =>
    new Proxy({} as T, {
      get: (_, name) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useContextSelector(context, (c) => c[name]);
      },
    });
};

type Store<T> = {
  value: T;
  subscribe: (l: () => void) => () => boolean;
  notify: () => void;
};

export const createContext = <Value extends object>(useValue: () => Value) => {
  const context = createContextOrig({} as Store<Value>);

  function Provider({ children }: { children: ReactNode }) {
    const value = useValue();

    const [store] = useState(() => {
      const listeners = new Set<() => void>();
      return {
        value,
        subscribe: (l: () => void) => {
          listeners.add(l);
          return () => listeners.delete(l);
        },
        notify: () => listeners.forEach((l) => l()),
      };
    });

    useEffect(() => {
      if (!Object.is(store.value, value)) {
        store.value = value;
        store.notify();
      }
    }, [store, value]);

    return <context.Provider value={store}>{children}</context.Provider>;
  }

  const useContext = () => {
    const store = useContextOrig(context);
    return new Proxy({} as Value, {
      get: (_, name) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useSyncExternalStore(
          store.subscribe,
          () => store.value[name as keyof Value],
        );
      },
    });
  };

  const useContextSelector = <Selected,>(
    selector: (value: Value) => Selected,
  ) => {
    const store = useContextOrig(context);
    return useSyncExternalStore(store.subscribe, () => selector(store.value));
  };

  return [Provider, useContext, useContextSelector] as const;
};
