import { useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { MyRouting } from '.';
import { screenFrom, urlFrom } from '~/functions/converter';
import useMyContext from '~/core/MyContext';

const useRouting = (): MyRouting => {
  const { hasNavigated } = useMyContext();
  const { push, replace, back, pathname, query, isReady } = useRouter();
  // pseudo `canGoBack` implemented by tracking if we've navigated
  const canGoBack = useRef(() => hasNavigated.current).current;

  const navigate: MyRouting['navigate'] = useCallback(
    (screen, params) => push(urlFrom(screen, params)),
    [push],
  );

  return {
    navigate,
    push: navigate,
    replace: useCallback(
      (screen, params) => replace(urlFrom(screen, params)),
      [replace],
    ),
    canGoBack,
    goBack: (fallback = 'Home') => {
      if (canGoBack()) return back();
      push(urlFrom(fallback));
    },
    pop: () => {},
    params: query,
    pathname,
    screen: screenFrom(pathname) ?? '',
    isReady,
  };
};

export default useRouting;
