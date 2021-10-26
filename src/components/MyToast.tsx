import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { device, globalStyles } from '~/constants';
import useMyContext from '~/core/MyContext';
import MyIcon from './MyIcon';
import MyText from './MyText';

function MyToast() {
  const { modalState, modalRefresh } = useMyContext();

  const [modal] = React.useState({
    opacity: new Animated.Value(0),
    scale: new Animated.Value(0.5),
  });

  React.useEffect(() => {
    const useNativeDriver = !device.web;
    if (modalState.message === '') return;
    Animated.parallel([
      Animated.timing(modal.opacity, {
        toValue: 0,
        duration: 0,
        useNativeDriver,
      }),
      Animated.timing(modal.scale, {
        toValue: 0.5,
        duration: 0,
        useNativeDriver,
      }),
    ]).start();

    Animated.parallel([
      Animated.timing(modal.opacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver,
      }),
      Animated.timing(modal.scale, {
        toValue: 1,
        duration: 150,
        useNativeDriver,
      }),
    ]).start();

    setTimeout(
      () => {
        Animated.parallel([
          Animated.timing(modal.opacity, {
            toValue: 0,
            duration: 150,
            useNativeDriver,
          }),
          Animated.timing(modal.scale, {
            toValue: 0.5,
            duration: 150,
            useNativeDriver,
          }),
        ]).start();
      },
      modalState.long ? 3500 : 2000
    );
    return () => {
      modalState.message = '';
    };
  }, [modalRefresh]);

  return (
    <Animated.View
      style={[
        styles.model,
        globalStyles.elevation4,
        {
          opacity: modal.opacity,
          transform: [{ scale: modal.scale }],
        },
      ]}>
      <MyIcon name='check' size={24} color='#FFF' />
      <MyText style={{ color: '#FFF', marginLeft: 8 }}>
        {modalState.message}
      </MyText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  model: {
    position: !device.web ? 'absolute' : ('fixed' as any),
    bottom: 0,
    backgroundColor: '#4BB543',
    padding: 10,
    marginBottom: device.iPhoneNotch ? 142 : 112,
    borderRadius: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default MyToast;
