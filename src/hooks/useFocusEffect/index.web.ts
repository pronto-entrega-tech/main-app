import { EffectCallback, useEffect } from "react";

const useFocusEffect = (callback: EffectCallback) =>
  useEffect(callback, [callback]);

export default useFocusEffect;
