import { Context, useContextSelector } from 'use-context-selector';

export const createUseContext = <T>(context: Context<T>) => {
  return () =>
    new Proxy(
      {},
      {
        get: (_, name) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          return useContextSelector(context, (c: any) => c[name]);
        },
      }
    ) as T;
};
