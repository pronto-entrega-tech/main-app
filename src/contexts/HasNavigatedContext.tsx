import { useRef } from 'react';
import { createContext } from '~/contexts/createContext';

// noop on mobile

function useHasNavigated() {
  const hasNavigated = useRef(false);
  return { hasNavigated };
}

export const [
  HasNavigatedProvider,
  useHasNavigatedContext,
  useHasNavigatedContextSelector,
] = createContext(useHasNavigated);
