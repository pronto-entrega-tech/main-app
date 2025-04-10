import React, { ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import device from "~/constants/device";
import { zIndex } from "~/constants/zIndex";

const HeaderContainer = ({
  children,
  style,
}: {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) =>
  !device.web ? (
    <View style={style}>{children}</View>
  ) : (
    <View style={styles.container}>
      <View style={[styles.subContainer, style]}>{children}</View>
    </View>
  );

const styles = StyleSheet.create({
  container: {
    height: 56,
    zIndex: zIndex.Header,
  },
  subContainer: {
    position: "fixed",
    width: "100%",
  },
});

export default HeaderContainer;
