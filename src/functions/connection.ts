import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export async function hasInternet() {
  const { isInternetReachable } = await NetInfo.fetch();

  return isInternetReachable ?? true;
}

export function useConnection() {
  const [hasInternet, setHasInternet] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setHasInternet(state.isInternetReachable);
    });
    return unsubscribe();
  }, []);

  return hasInternet;
}
