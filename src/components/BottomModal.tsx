import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Animated,
  ViewStyle,
  StyleProp,
  BackHandler,
} from 'react-native';
import { myColors, device } from '~/constants';

function BottomModal({
  isVisible,
  onDismiss,
  style,
  children,
}: {
  isVisible: boolean;
  onDismiss(): void;
  style?: StyleProp<ViewStyle>;
  children: any;
}) {
  const [show, setShow] = React.useState(false);
  const [state] = React.useState({
    opacity: new Animated.Value(0),
    modal: new Animated.Value(device.height),
  });
  const useNativeDriver = !device.web;

  const openModal = () => {
    setShow(true);
    Animated.parallel([
      Animated.timing(state.opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver,
      }),
      Animated.timing(state.modal, {
        toValue: 0,
        duration: 200,
        useNativeDriver,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(state.modal, {
        toValue: device.height,
        duration: 300,
        useNativeDriver,
      }),
      Animated.timing(state.opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver,
      }),
    ]).start();
    setTimeout(() => setShow(false), 300);
  };

  React.useEffect(() => {
    if (isVisible) {
      openModal();
    } else {
      closeModal();
    }
  }, [isVisible]);

  React.useEffect(() => {
    if (!isVisible || !device.android) return;
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        onDismiss();
        return true;
      }
    );

    return backHandler.remove;
  }, [isVisible]);

  if (!show) return null;

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 999 }]}>
      <Animated.View style={[styles.background, { opacity: state.opacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />
      </Animated.View>
      <Animated.View
        style={[
          styles.modal,
          {
            paddingBottom: device.iPhoneNotch ? 30 : 0,
            transform: [{ translateY: state.modal }],
          },
          style,
        ]}>
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'rgba(0,0,0,.5)',
    height: '100%',
    width: '100%',
  },
  modal: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: myColors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});

export default BottomModal;
