import { useCallback } from 'react';
import useMyContext from '~/core/MyContext';
import { updateAddress, getAddress } from '~/functions/address';

export const useUpdateAddress = () => {
  const { alert } = useMyContext();

  return useCallback(() => updateAddress(alert), [alert]);
};

export const useGetAddress = () => {
  const { alert } = useMyContext();

  return useCallback(() => getAddress(alert), [alert]);
};
