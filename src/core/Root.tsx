import React, { useEffect, useRef, useState } from 'react';
import { View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadAsync } from 'expo-font';
import { createURL, getInitialURL } from 'expo-linking';
import { myColors, device, images } from '~/constants';
import Loading from '~/components/Loading';
import fonts from '~/assets/fonts';

const prefix = createURL('');

const NAVIGATION_PERSISTENCE_KEY = '@prontoentrega/NAVIGATION_STATE';

function Root() {
  const navigationRef = useRef(null);
  const [app, setApp] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        await loadAsync(fonts);

        let initialState;
        if (device.web) {
          const initialUrl = await getInitialURL();
          const url = initialUrl?.replace(prefix, '');

          const savedState = await AsyncStorage.getItem(
            NAVIGATION_PERSISTENCE_KEY
          );
          const state = savedState ? JSON.parse(savedState) : undefined;

          if (
            url !== '/' &&
            !url?.startsWith('/produto') &&
            !url?.startsWith('/mercado?')
          )
            initialState = state;
        }
        const { App } = await import('./App');

        setApp(
          App({
            navigationRef,
            initialState,
            onStateChange: (state) => {
              AsyncStorage.setItem(
                NAVIGATION_PERSISTENCE_KEY,
                JSON.stringify(state)
              );
            },
          })
        );
      } catch {}
    })();
  }, []);

  if (!app) {
    if (device.web) return <Loading />;
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          backgroundColor: myColors.primaryColor,
        }}>
        <Image
          fadeDuration={0}
          source={images.splash}
          style={{
            width: Math.round((device.height * 1284) / 2778),
            height: device.height,
          }}
        />
      </View>
    );
  }

  return app;
}

export default Root;
