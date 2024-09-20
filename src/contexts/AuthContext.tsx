import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { createContext } from 'use-context-selector';
import { fail, getJwtExpiration } from '~/functions/converter';
import { createUseContext } from '~/contexts/createContext';
import { saveRefreshToken, getRefreshToken } from '~/core/dataStorage';
import { device } from '~/constants';
import { useConnection } from '~/functions/connection';
import { api } from '~/services/api';
import { withMutex } from '~/services/mutex';
import { useAlertContext } from '~/contexts/AlertContext';

type AuthToken = { accessToken?: string | null; refreshToken?: string | null };

type AuthContextValues = {
  accessToken?: string | null;
  refreshToken?: string | null;
  signIn: (v: AuthToken) => void;
  signOut: () => Promise<void>;
} & (
  | { isAuth: undefined; accessToken: undefined }
  | { isAuth: false; accessToken: null }
  | { isAuth: true; accessToken: string }
);

const AuthContext = createContext({} as AuthContextValues);

export const useAuthContext = createUseContext(AuthContext);

export const AuthProvider = (props: { children: ReactNode }) => {
  const { alert } = useAlertContext();
  const hasInternet = useConnection();
  const [accessToken, setAccessToken] = useState<string | null>();
  const [refreshToken, _setRefreshToken] = useState<string | null>();

  const isAuth = accessToken === undefined ? undefined : !!accessToken;

  const setRefreshToken = (v?: string | null) => {
    _setRefreshToken(v);
    saveRefreshToken(v ?? null);
  };
  const signIn = ({ accessToken, refreshToken }: AuthToken) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  };
  const signOut = async () => {
    await api.auth.signOut(refreshToken ?? undefined);
    setAccessToken(null);
    setRefreshToken(null);
  };

  useEffect(() => {
    if (!device.web) getRefreshToken().then(_setRefreshToken);
  }, []);

  useEffect(() => {
    if (accessToken === null || hasInternet === false) return;

    const revalidateToken = () =>
      withMutex('revalidate', async () => {
        if (!device.web && refreshToken === undefined) return;

        try {
          const _refreshToken = device.web
            ? undefined
            : refreshToken === null
            ? fail('Unauthorized')
            : refreshToken;

          const res = await api.auth.revalidate(_refreshToken);
          setAccessToken(res.access_token);
          setRefreshToken(res.refresh_token ?? null);
        } catch (err) {
          api.isError('Unauthorized', err) ||
          (err as Error).message === 'Unauthorized'
            ? setAccessToken(null)
            : alert('Error ao tentar entrar', 'Tente novamente mais tarde');
        }
      });

    if (!accessToken) {
      revalidateToken();
      return;
    }

    const expiration = getJwtExpiration(accessToken) - 60 * 1000;
    const revalidateTimeout = setTimeout(
      revalidateToken,
      expiration - Date.now(),
    );
    return () => clearTimeout(revalidateTimeout);
  }, [hasInternet, accessToken, refreshToken, alert]);

  const authValue = (() => {
    if (accessToken === undefined) {
      return { isAuth: undefined, accessToken: undefined };
    }
    if (accessToken === null) {
      return { isAuth: false as const, accessToken: null };
    }
    return { isAuth: true as const, accessToken };
  })();

  return (
    <AuthContext.Provider
      value={{
        ...authValue,
        refreshToken,
        signIn: useCallback(signIn, []),
        signOut: useCallback(signOut, [refreshToken]),
      }}
      {...props}
    />
  );
};
