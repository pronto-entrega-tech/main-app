import React from "react";
import { View } from "react-native";
import { MyIconProps } from "./MyIcon";
import icons from "~/constants/svgPaths";
import myColors from "~/constants/myColors";

const MyIcon = ({
  name,
  color = myColors.primaryColor,
  size = 24,
  style,
}: MyIconProps) => (
  <View style={style}>
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path fill={color} d={icons[name]} />
    </svg>
  </View>
);

export default MyIcon;
