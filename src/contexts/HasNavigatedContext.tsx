import React, { ReactNode, createContext } from 'react';
import { createUseContext } from '~/functions/converter';

const HasNavigatedContext = createContext(
  {} as { hasNavigated: React.MutableRefObject<boolean> },
);

export const useHasNavigatedContext = createUseContext(HasNavigatedContext);

export const HasNavigatedProvider = (props: { children: ReactNode }) =>
  props.children;
