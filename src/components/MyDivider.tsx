import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { myColors } from "~/constants";

const MyDivider = ({ style }: { style?: StyleProp<ViewStyle> }) => (
  <View
    style={[
      { height: 1, alignSelf: "stretch", backgroundColor: myColors.divider },
      style,
    ]}
  />
);

export default MyDivider;
