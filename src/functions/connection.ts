import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export const hasInternet = async () => {
  const { isInternetReachable } = await NetInfo.fetch();

  return isInternetReachable ?? true;
};

export const useConnection = () => {
  const [hasInternet, setHasInternet] = useState<boolean | null>(null);

  useEffect(() => {
    return NetInfo.addEventListener((state) => {
      setHasInternet(state.isInternetReachable);
    });
  }, []);

  return hasInternet;
};
