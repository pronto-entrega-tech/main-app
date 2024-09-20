import React, { ReactNode, useCallback, useState } from 'react';
import { createContext } from 'use-context-selector';
import { createUseContext } from '~/contexts/createContext';
import { ToastState } from '~/components/MyToast';
import { AlertState } from '~/components/MyAlert';

export type MyContextValues = {
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
  const [toastState, setToastState] = useState<ToastState>({ message: '' });
  const [alertState, setAlertState] = useState<AlertState>();

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
