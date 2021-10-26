import { useRef } from 'react';
import { useRouter } from 'next/router';
import { MyRouting } from '.';
import { stringifyParams } from '~/functions/converter';
import useMyContext from '~/core/MyContext';

function useRouting(): MyRouting {
  const { hasNavigated } = useMyContext();
  const { push, replace, back: goBack, pathname, query, asPath } = useRouter();
  // implement a pseudo `canGoBack` by tracking if we've navigated
  const canGoBack = useRef(() => hasNavigated.current).current;

  return {
    navigate: (path, params) => push(path + stringifyParams(params)),
    push: ({ path }, params) => push(path + stringifyParams(params)),
    replace: ({ path }, params) => replace(path + stringifyParams(params)),
    canGoBack,
    goBack: (fallback) => {
      if (canGoBack() || !fallback) return goBack();
      push(fallback);
    },
    pop: () => {},
    params: query,
    pathname,
    asPath,
  };
}

export default useRouting;
