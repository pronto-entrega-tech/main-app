import { useWindowDimensions } from 'react-native';

export function useMediaQuery() {
  const width = useWindowDimensions().width || Infinity;

  const size = (() => {
    if (width > 768) return 'lg';
    if (width > 425) return 'md';
    return 'sm';
  })();

  return {
    width,
    size,
    isMobile: size === 'sm',
    isTablet: size === 'md',
    isDesktop: size === 'lg',
  } as const;
}
