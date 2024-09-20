import { AnimatePresence, MotiView } from "moti";
import React, { ReactNode } from "react";
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Pressable,
} from "react-native";
import { myColors, device } from "~/constants";
import { zIndex } from "~/constants/zIndex";
import { ModalState } from "~/hooks/useModalState";

const CenterModal = ({
  state: { isVisible, onDismiss: dismiss },
  style,
  children,
}: {
  state: Partial<ModalState>;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <MotiView
          transition={{ type: "timing", duration: 200 }}
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={[StyleSheet.absoluteFill, styles.container]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={dismiss} />
          <View style={[styles.modal, style]}>{children}</View>
        </MotiView>
      )}
    </AnimatePresence>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: zIndex.Modal,
    position: device.web ? "fixed" : "absolute",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    alignSelf: "center",
    position: "absolute",
    width: "90%",
    maxWidth: 500,
    padding: 24,
    borderRadius: 10,
    backgroundColor: "white",
  },
  title: {
    fontSize: 18,
    color: myColors.text4,
  },
  subtitle: {
    color: myColors.text2,
  },
});

export default CenterModal;
