import React, { useEffect, useState } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { device, globalStyles } from '~/constants';
import { zIndex } from '~/constants/zIndex';
import useMyContext from '~/core/MyContext';
import MyIcon, { IconNames } from './MyIcon';
import MyText from './MyText';

export type ToastState = {
  message: string;
  long?: boolean;
  type?: 'Confirmation' | 'Error';
};

const MyToast = () => {
  const { toastState } = useMyContext();
  const [modalState] = useState({
    opacity: new Animated.Value(0),
    scale: new Animated.Value(0.5),
  });

  useEffect(() => {
    if (toastState.message === '') return;

    const useNativeDriver = !device.web;

    modalState.opacity.setValue(0);
    modalState.scale.setValue(0.5);

    Animated.parallel([
      Animated.timing(modalState.opacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver,
      }),
      Animated.timing(modalState.scale, {
        toValue: 1,
        duration: 150,
        useNativeDriver,
      }),
    ]).start();

    Animated.delay(toastState.long ? 3500 : 2000).start(() =>
      Animated.parallel([
        Animated.timing(modalState.opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver,
        }),
        Animated.timing(modalState.scale, {
          toValue: 0.5,
          duration: 150,
          useNativeDriver,
        }),
      ]).start()
    );

    return () => {
      toastState.message = '';
    };
  }, [toastState, modalState.opacity, modalState.scale]);

  const map: { [x: string]: { icon: IconNames; color: string } } = {
    Error: { icon: 'close-circle', color: 'red' },
    Confirmation: { icon: 'check', color: '#4BB543' },
  };
  const { icon, color } = map[toastState.type ?? ''] ?? map.Confirmation;

  return (
    <Animated.View
      style={[
        styles.model,
        globalStyles.elevation4,
        {
          backgroundColor: color,
          opacity: modalState.opacity,
          transform: [{ scale: modalState.scale }],
        },
      ]}>
      <MyIcon name={icon} size={24} color='white' />
      <MyText style={{ color: 'white', marginLeft: 8 }}>
        {toastState.message}
      </MyText>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  model: {
    zIndex: zIndex.Toast,
    position: !device.web ? 'absolute' : ('fixed' as any),
    bottom: 0,
    padding: 10,
    marginBottom: device.iPhoneNotch ? 142 : 112,
    borderRadius: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default MyToast;
