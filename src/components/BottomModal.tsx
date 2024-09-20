import { MotiView, AnimatePresence } from "moti";
import { MotiPressable } from "moti/interactions";
import React, { ReactNode, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  BackHandler,
  Keyboard,
  Pressable,
} from "react-native";
import { myColors, device } from "~/constants";
import { zIndex } from "~/constants/zIndex";
import { ModalState } from "~/hooks/useModalState";

const BottomModal = ({
  state: { isVisible, onDismiss: dismiss },
  style,
  children,
}: {
  state: ModalState;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    if (!isVisible || !device.android) return;

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
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
    const es1 = Keyboard.addListener("keyboardWillShow", setKbVisibleFn(true));
    const es2 = Keyboard.addListener("keyboardWillHide", setKbVisibleFn(false));

    return () => {
      es1.remove();
      es2.remove();
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <View style={[StyleSheet.absoluteFill, styles.container]}>
          <Pressable onPress={dismiss} style={StyleSheet.absoluteFill}>
            <MotiView
              transition={{ type: "timing", duration: 200 }}
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: "rgba(0, 0, 0, 0.5)" },
              ]}
            />
          </Pressable>
          <MotiView
            transition={{ type: "timing", duration: 200 }}
            from={{ translateY: device.height }}
            animate={{ translateY: 0 }}
            exit={{ translateY: device.height }}
            style={[
              styles.modal,
              { paddingBottom: keyboardVisible ? 24 : 0 },
              style,
            ]}
          >
            {children}
          </MotiView>
        </View>
      )}
    </AnimatePresence>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: zIndex.Modal,
    position: device.web ? "fixed" : "absolute",
    justifyContent: "center",
  },
  modal: {
    width: "100%",
    position: device.web ? "fixed" : "absolute",
    bottom: 0,
    backgroundColor: myColors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
    padding: 24,
  },
});

export default BottomModal;
