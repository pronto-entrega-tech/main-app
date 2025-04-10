import React from "react";
import { Text, TextProps } from "react-native";
import myColors from "~/constants/myColors";

const MyText = ({ style, ...props }: TextProps) => (
  <Text
    style={[
      {
        color: myColors.text7,
        pointerEvents: "none",
      },
      style,
    ]}
    {...props}
  />
);

export default MyText;
