import {
  StackNavigationState,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback } from 'react';

type Params = Record<string, any>;
export type MyRouting = {
  navigate(screen: string, params?: Params): void;
  push(screen: string, params?: Params): void;
  replace(screen: string, params?: Params): void;
  canGoBack(): boolean;
  goBack(fallback?: string): void;
  pop(count?: number): void;
  params: any;
  pathname: string;
  screen: string;
  isReady: boolean;
};
const useRouting = (): MyRouting => {
  const {
    navigate,
    push,
    replace,
    canGoBack,
    goBack,
    pop,
    getState,
  }: StackNavigationProp<any, any> = useNavigation();
  const { params, path, name } = useRoute();

  const getScreenName = (
    s: StackNavigationState<any>['routes'][number]['state']
  ): string => {
    if (s?.index === undefined) throw new Error();

    const route = s.routes[s.index];
    return route.state ? getScreenName(route.state) : route.name;
  };

  return {
    navigate: useCallback(
      (...args) => {
        navigate(...validate(...args));
      },
      [navigate]
    ),
    push: useCallback((...args) => push(...validate(...args)), [push]),
    replace: useCallback((...args) => replace(...validate(...args)), [replace]),
    canGoBack,
    goBack: (fallback = 'Home') => {
      if (canGoBack()) return goBack();
      navigate(fallback);
    },
    pop,
    params: params ?? {},
    pathname: path ?? '',
    screen: name !== 'BottomTabs' ? name : getScreenName(getState()),
    isReady: true,
  };
};

const validate = (screen: string, params?: Params) => {
  const map: { [x: string]: [string, Params | undefined] } = {
    Home: ['BottomTabs', params],
    OrderDetails: [
      'BottomTabs',
      { screen: 'OrdersTab', params: { screen: 'OrderDetails', params } },
    ],
  };

  return map[screen] ?? [screen, params];
};

export default useRouting;
