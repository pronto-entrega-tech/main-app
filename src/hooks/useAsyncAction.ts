import { useRef, useState } from "react";
import { serverError } from "~/components/Errors";
import { useAlertContext } from "~/contexts/AlertContext";

export function useAsyncAction<TArgs extends unknown[]>(
  action: (...args: TArgs) => Promise<unknown>,
): [action: (...args: TArgs) => Promise<unknown>, loading: boolean] {
  const { alert } = useAlertContext();

  const [loading, setLoading] = useState(false);
  const runningRef = useRef(false);

  const _action = async (...args: TArgs) => {
    if (runningRef.current) return;

    runningRef.current = true;
    setLoading(true);
    try {
      await action(...args);
    } catch {
      serverError(alert);
    } finally {
      runningRef.current = false;
      setLoading(false);
    }
  };

  return [_action, loading];
}
