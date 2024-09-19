import React, { ReactNode, useEffect, useRef } from 'react';
import { createContext } from 'use-context-selector';
import { createUseContext } from '~/functions/converter';
import { Router } from 'next/router';

const useProviderValues = () => {
  const hasNavigated = useRef(false);

  useEffect(() => {
    const onRouteChange = () => {
      hasNavigated.current = true;
    };

    Router.events.on('routeChangeComplete', onRouteChange);
    return () => Router.events.off('routeChangeComplete', onRouteChange);
  }, []);

  return { hasNavigated };
};

const HasNavigatedContext = createContext(
  {} as ReturnType<typeof useProviderValues>,
);

export const useHasNavigatedContext = createUseContext(HasNavigatedContext);

export const HasNavigatedProvider = (props: { children: ReactNode }) => (
  <HasNavigatedContext.Provider value={useProviderValues()} {...props} />
);
