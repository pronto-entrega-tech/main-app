import { useCallback, useRef } from "react";
import { useRouter } from "next/router";
import { MyRouting } from ".";
import { screenFrom, urlFrom } from "~/functions/converter";
import { useHasNavigatedContext } from "~/contexts/HasNavigatedContext";

const useRouting = (): MyRouting => {
  const { hasNavigated } = useHasNavigatedContext();
  const { push, replace, back, pathname, query, isReady } = useRouter();
  // pseudo `canGoBack` implemented by tracking if we've navigated
  const canGoBack = useRef(() => hasNavigated.current).current;

  const navigate: MyRouting["navigate"] = useCallback(
    (screen, params) => push(urlFrom(screen, params)),
    [push]
  );

  return {
    navigate,
    push: navigate,
    replace: useCallback(
      (screen, params) => replace(urlFrom(screen, params)),
      [replace]
    ),
    canGoBack,
    goBack: (fallback = "Home") => {
      if (canGoBack()) return back();
      push(urlFrom(fallback));
    },
    pop: () => {},
    setParams: useCallback(
      (params) => replace(urlFrom(screenFrom(pathname) ?? "/", params)),
      [replace]
    ),
    params: query,
    pathname,
    screen: screenFrom(pathname) ?? "",
    isReady,
  };
};

export default useRouting;
