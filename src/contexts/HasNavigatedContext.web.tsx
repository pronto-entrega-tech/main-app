import { useEffect, useRef } from 'react';
import { createContext } from '~/contexts/createContext';
import { Router } from 'next/router';

function useHasNavigated() {
  const hasNavigated = useRef(false);

  useEffect(() => {
    const onRouteChange = () => {
      hasNavigated.current = true;
    };

    Router.events.on('routeChangeComplete', onRouteChange);
    return () => Router.events.off('routeChangeComplete', onRouteChange);
  }, []);

  return { hasNavigated };
}

export const [
  HasNavigatedProvider,
  useHasNavigatedContext,
  useHasNavigatedContextSelector,
] = createContext(useHasNavigated);
