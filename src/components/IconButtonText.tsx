import React from "react";
import { View, StyleSheet } from "react-native";
import { globalStyles, myColors } from "~/constants";
import IconButton from "./IconButton";
import { ButtonOrLink } from "./MyTouchable";
import { IconNames } from "./MyIcon";
import MyText from "./MyText";

type IconButtonTextBase = {
  icon: IconNames;
  text: string;
};

type IconButtonTextProps = ButtonOrLink<IconButtonTextBase>;

const IconButtonText = ({ icon, text, ...props }: IconButtonTextProps) => {
  return (
    <View style={styles.container}>
      <IconButton
        icon={icon}
        size={32}
        color={myColors.grey2}
        style={[
          styles.iconButton,
          globalStyles.elevation4,
          globalStyles.darkBorder,
        ]}
        {...props}
      />
      <MyText style={styles.text}>{text}</MyText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 2,
    alignItems: "center",
  },
  iconButton: {
    width: 54,
    height: 54,
    backgroundColor: "#fff",
  },
  text: {
    color: myColors.text,
    fontSize: 13,
    textAlign: "center",
  },
});

export default IconButtonText;
