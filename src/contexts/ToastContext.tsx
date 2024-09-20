import { useCallback, useState } from 'react';
import { ToastState } from '~/components/MyToast';
import { createContext } from '~/contexts/createContext';

function useToast() {
  const [toastState, setToastState] = useState<ToastState>({ message: '' });

  const toast = useCallback(
    (message: string, opts?: Omit<ToastState, 'message'>) => {
      setToastState({ message, ...opts });
    },
    [],
  );

  return {
    toastState,
    toast,
  };
}

export const [ToastProvider, useToastContext, useToastContextSelector] =
  createContext(useToast);
