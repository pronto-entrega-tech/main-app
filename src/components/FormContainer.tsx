import React from "react";
import { ScrollView, ScrollViewProps } from "react-native";
import { device, globalStyles, myColors } from "~/constants";

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
