import { useCallback } from "react";
import { useAlertContext } from "~/contexts/AlertContext";
import { updateAddress, getAddress } from "~/functions/address";

export const useUpdateAddress = () => {
  const { alert } = useAlertContext();

  return useCallback(() => updateAddress(alert), [alert]);
};

export const useGetAddress = () => {
  const { alert } = useAlertContext();

  return useCallback(() => getAddress(alert), [alert]);
};
