import React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { AppContexts } from '~/core/AppContexts';
import MyAlert from '~/components/MyAlert';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <AppContexts>
    <Head>
      <meta name='viewport' content='width=device-width,initial-scale=1' />
      {/* <meta
          name='viewport'
          content='width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1.00001,viewport-fit=cover'
        /> */}
      <title>ProntoEntrega</title>
    </Head>
    <Component {...pageProps} />
    <MyAlert />
  </AppContexts>
);

export default MyApp;
