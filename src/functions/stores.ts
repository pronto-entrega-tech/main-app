import { PreinitializedWritableAtom, atom, computed } from 'nanostores';
import { useStore } from '@nanostores/react';
import { ReactNode, useEffect, useState } from 'react';
import { Store, StoreValue } from 'nanostores/map';

export function useAtom<T = undefined>(): PreinitializedWritableAtom<
  T | undefined
>;
export function useAtom<T>(initialValue: T): PreinitializedWritableAtom<T>;
export function useAtom<T>(initialValue?: T) {
  return useState(() => atom(initialValue))[0];
}

export function useComputed<Value, OriginStore extends Store>(
  store: OriginStore,
  cb: (value: StoreValue<OriginStore>) => Value,
) {
  return useState(() => computed(store, cb))[0];
}

export function useStoreEffect<Value = unknown>(
  store: Store<Value>,
  callback: (value: Value, oldValue?: Value) => void,
) {
  return useEffect(() => {
    return store.subscribe(callback);
  }, [callback, store]);
}

export function Show<S extends Store>(p: { when: S; children: ReactNode }) {
  const $show = useComputed(p.when, (v) => Boolean(v));
  const show = useStore($show);

  return show && p.children;
}

export function UseStore<S extends Store>(p: {
  store: S;
  children: (value: StoreValue<S>) => ReactNode;
}) {
  const value = useStore(p.store);

  return p.children(value);
}

export function UseStores<S extends Store[]>(p: {
  store: [...S];
  children: (...value: StoreValue<S[number]>[]) => ReactNode;
}) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const value = p.store.map((s) => useStore(s));

  return p.children(...value);
}
