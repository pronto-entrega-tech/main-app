import React from "react";
import { ScrollView, ScrollViewProps } from "react-native";
import device from "~/constants/device";
import globalStyles from "~/constants/globalStyles";
import myColors from "~/constants/myColors";

const FormContainer = (props: ScrollViewProps) => (
  <ScrollView
    showsVerticalScrollIndicator={false}
    {...props}
    contentContainerStyle={[
      globalStyles.container,
      device.web && { backgroundColor: myColors.background },
      props.contentContainerStyle,
    ]}
  />
);

export default FormContainer;
