import React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { AppContexts } from '~/core/AppContexts';
import MyAlert from '~/components/MyAlert';

import 'raf/polyfill'; // makes Reanimated web usable with server-side rendering

const MyApp = ({ Component, pageProps }: AppProps) => (
  <AppContexts>
    <Head>
      <meta name='viewport' content='width=device-width,initial-scale=1' />
      <title>ProntoEntrega</title>
    </Head>
    <Component {...pageProps} />
    <MyAlert />
  </AppContexts>
);

export default MyApp;
