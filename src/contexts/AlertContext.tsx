import { useCallback, useState } from "react";
import { createContext } from "~/contexts/createContext";
import { AlertState } from "~/components/MyAlert";

export type ShowAlert = (
  title: string,
  subtitle?: string,
  opts?: Omit<AlertState, "title" | "subtitle">,
) => void;

function useAlert() {
  const [alertState, setAlertState] = useState<AlertState>();

  const alert: ShowAlert = useCallback(
    (title, subtitle, opts) => setAlertState({ title, subtitle, ...opts }),
    [],
  );

  const dismissAlert = useCallback(() => {
    setAlertState(undefined);
  }, []);

  return {
    alertState,
    alert,
    dismissAlert,
  };
}

export const [AlertProvider, useAlertContext, useAlertContextSelector] =
  createContext(useAlert);
