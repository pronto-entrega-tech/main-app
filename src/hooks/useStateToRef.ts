import { useRef } from 'react';

export function useStateToRef<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
