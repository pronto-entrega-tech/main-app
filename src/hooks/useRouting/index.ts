import { useLinkTo, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback } from 'react';
import { stringifyParams } from '~/functions/converter';

export interface MyRouting {
  navigate(path: string, params?: any): void;
  push(route: { screen: string; path: string }, params?: any): void;
  replace(route: { screen: string; path: string }, params?: any): void;
  canGoBack(): boolean;
  goBack(fallback?: string): void;
  pop(count?: number): void;
  params: any;
  pathname: string;
  asPath: string;
}
function useRouting(): MyRouting {
  const {
    push,
    replace,
    canGoBack,
    goBack,
    pop,
  }: StackNavigationProp<any, any> = useNavigation();
  const linkTo = useLinkTo();
  const { params, path } = useRoute();

  return {
    navigate: useCallback(
      (path, params) => linkTo(path + stringifyParams(params)),
      [linkTo]
    ),
    push: useCallback(({ screen }, params) => push(screen, params), [push]),
    replace: useCallback(
      ({ screen }, params) => replace(screen, params),
      [replace]
    ),
    canGoBack,
    goBack: (fallback) => {
      if (canGoBack() || !fallback) return goBack();
      linkTo(fallback);
    },
    pop,
    params: params ?? {},
    pathname: path ?? '',
    asPath: path ?? '',
  };
}

export default useRouting;
