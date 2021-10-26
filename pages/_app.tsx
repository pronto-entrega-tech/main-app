import React from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { MyProvider } from '~/core/MyContext';
import { NextPage } from 'next';

interface Children {
  children: JSX.Element;
}

type Page<P = {}> = NextPage<P> & {
  getLayout?: ({ children }: Children) => JSX.Element;
};

type Props = AppProps & {
  Component: Page;
};

function MyApp({ Component, pageProps }: Props) {
  const Layout = Component.getLayout ?? (({ children }: Children) => children);

  return (
    <MyProvider>
      <Head>
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        {/* <meta
          name='viewport'
          content='width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1.00001,viewport-fit=cover'
        /> */}
        <title>ProntoEntrega</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </MyProvider>
  );
}

export default MyApp;
