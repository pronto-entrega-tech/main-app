import React from "react";
import { StyleSheet, View } from "react-native";
import { useAlertContext } from "~/contexts/AlertContext";
import { myColors, myFonts } from "~/constants";
import CenterModal from "./CenterModal";
import MyButton from "./MyButton";
import MyText from "./MyText";

export type AlertState = {
  title: string;
  subtitle?: string;
  confirmTitle?: string;
  cancelTitle?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const MyAlert = () => {
  const { alertState, dismissAlert } = useAlertContext();

  const closeAnd = (fn?: () => void) => () => {
    fn?.();
    dismissAlert();
  };

  const { onConfirm: confirm, onCancel: cancel } = alertState ?? {};

  const buttons = alertState?.onConfirm ? (
    <View style={{ flexDirection: "row" }}>
      <MyButton
        title={alertState.cancelTitle ?? "Cancelar"}
        onPress={closeAnd(cancel)}
        type="outline"
        buttonStyle={[styles.button, styles.cancel]}
      />
      <MyButton
        title={alertState.confirmTitle ?? "Confirmar"}
        onPress={closeAnd(confirm)}
        buttonStyle={styles.button}
      />
    </View>
  ) : (
    <MyButton
      title="Ok"
      onPress={closeAnd(cancel)}
      buttonStyle={{ width: "100%" }}
    />
  );

  return (
    <CenterModal
      state={{ isVisible: alertState != null, onDismiss: closeAnd(cancel) }}
    >
      <View>
        <MyText style={styles.title}>{alertState?.title}</MyText>
        <MyText style={styles.subtitle}>{alertState?.subtitle}</MyText>
      </View>
      {buttons}
    </CenterModal>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontFamily: myFonts.Medium,
    fontSize: 20,
    color: myColors.text3,
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    color: myColors.text2,
    marginBottom: 24,
  },
  button: {
    flex: 1,
  },
  cancel: {
    marginRight: 12,
  },
});

export default MyAlert;
