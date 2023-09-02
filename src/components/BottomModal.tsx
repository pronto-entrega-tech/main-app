import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Animated,
  ViewStyle,
  StyleProp,
  BackHandler,
  Keyboard,
} from 'react-native';
import { myColors, device } from '~/constants';
import { zIndex } from '~/constants/zIndex';
import { ModalState } from '~/hooks/useModalState';

const BottomModal = ({
  state: { isVisible, onDismiss: dismiss },
  style,
  children,
}: {
  state: ModalState;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) => {
  const [show, setShow] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const state = useRef({
    opacity: new Animated.Value(0),
    modal: new Animated.Value(device.height),
  }).current;

  useEffect(() => {
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
      ]).start(() => setShow(false));
    };

    isVisible ? openModal() : closeModal();
  }, [isVisible, state.modal, state.opacity]);

  useEffect(() => {
    if (!isVisible || !device.android) return;

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        dismiss();
        return true;
      },
    );
    return backHandler.remove;
  }, [isVisible, dismiss]);

  useEffect(() => {
    if (!device.iPhoneNotch) return;

    const setKbVisibleFn = (bool: boolean) => () => setKeyboardVisible(bool);
    const es1 = Keyboard.addListener('keyboardWillShow', setKbVisibleFn(true));
    const es2 = Keyboard.addListener('keyboardWillHide', setKbVisibleFn(false));

    return () => {
      es1.remove();
      es2.remove();
    };
  }, []);

  return !show ? null : (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: state.opacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={dismiss} />
      </Animated.View>
      <Animated.View
        style={[
          styles.modal,
          {
            paddingBottom: keyboardVisible ? 24 : 0,
            transform: [{ translateY: state.modal }],
          },
          style,
        ]}>
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: zIndex.Modal,
    position: device.web ? ('fixed' as any) : 'absolute',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    width: '100%',
    position: device.web ? ('fixed' as any) : 'absolute',
    bottom: 0,
    backgroundColor: myColors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    padding: 24,
  },
});

export default BottomModal;
