import { useEffect } from 'react';

const useFocusEffect = (callback: (...args: any) => any) =>
  useEffect(callback, [callback]);

export default useFocusEffect;
