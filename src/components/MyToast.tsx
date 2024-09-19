import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { device, globalStyles } from '~/constants';
import { zIndex } from '~/constants/zIndex';
import useMyContext from '~/core/MyContext';
import MyIcon, { IconNames } from './MyIcon';
import MyText from './MyText';
import { AnimatePresence, MotiView } from 'moti';

export type ToastState = {
  message: string;
  long?: boolean;
  type?: 'Confirmation' | 'Error';
};

const MyToast = () => {
  const { toastState } = useMyContext();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (toastState.message === '') return;

    const delay = toastState.long ? 3500 : 2000;

    setShow(true);
    const timeout = setTimeout(() => {
      setShow(false);
      toastState.message = '';
    }, delay);

    return () => clearTimeout(timeout);
  }, [toastState]);

  const map: Record<string, { icon: IconNames; color: string }> = {
    Error: { icon: 'close-circle', color: 'red' },
    Confirmation: { icon: 'check', color: '#4BB543' },
  };
  const { icon, color } = map[toastState.type ?? 'Confirmation'];

  return (
    <AnimatePresence>
      {show && (
        <MotiView
          key={toastState.message}
          transition={{ type: 'timing', duration: 200 }}
          from={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          style={[
            styles.model,
            globalStyles.elevation4,
            { backgroundColor: color },
          ]}>
          <MyIcon name={icon} color='white' />
          <MyText style={{ color: 'white', marginLeft: 8 }}>
            {toastState.message}
          </MyText>
        </MotiView>
      )}
    </AnimatePresence>
  );
};

const styles = StyleSheet.create({
  model: {
    zIndex: zIndex.Toast,
    position: device.web ? 'fixed' : 'absolute',
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
