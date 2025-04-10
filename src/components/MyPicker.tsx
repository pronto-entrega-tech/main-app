import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import {
  View,
  Modal,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Pressable,
  TouchableOpacity,
} from "react-native";
import device from "~/constants/device";
import myColors from "~/constants/myColors";
import myFonts from "~/constants/myFonts";
import MyIcon from "./MyIcon";
import MyDivider from "./MyDivider";
import MyText from "./MyText";

const MyPicker = ({
  items,
  label,
  errorMessage = "",
  style,
  selectedValue = "-",
  onValueChange,
}: {
  items: string[];
  label: string;
  errorMessage?: string;
  style: StyleProp<ViewStyle>;
  selectedValue?: string;
  onValueChange: (v: string) => void;
}) => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(selectedValue);

  const pickerItems = ["-", ...items].map((item, i) => (
    <Picker.Item
      key={item}
      label={item}
      value={item}
      color={i === 0 ? "#9EA0A4" : myColors.text4_5}
      style={{ fontSize: 18 }}
    />
  ));

  if (device.iOS)
    return (
      <View style={[styles.container, style]}>
        <MyText style={styles.label}>{label}</MyText>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onPress={() => setVisible(true)}
        >
          <MyText style={styles.input}>{value}</MyText>
          <MyIcon name="menu-down" color="#777" style={{ marginRight: 12 }} />
        </TouchableOpacity>
        <MyDivider style={styles.divider} />
        <MyText style={styles.error}>{errorMessage}</MyText>
        <Modal transparent visible={visible} animationType="slide">
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setVisible(false)}
          />
          <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
            <View style={styles.toolbar}>
              <Pressable onPress={() => setVisible(false)}>
                <MyText style={styles.done}>Done</MyText>
              </Pressable>
            </View>
            <Picker
              style={{ backgroundColor: "#d0d4da" }}
              selectedValue={value}
              onValueChange={(v) => {
                onValueChange(v);
                setValue(v);
              }}
            >
              {pickerItems}
            </Picker>
          </View>
        </Modal>
      </View>
    );

  if (device.web)
    return (
      <View style={[styles.container, style]}>
        <MyText style={styles.label}>{label}</MyText>
        <Picker
          style={{ height: 52, paddingVertical: 8, zIndex: 2, opacity: 0 }}
          selectedValue={value}
          onValueChange={(v) => {
            onValueChange(v);
            setValue(v);
          }}
        >
          {pickerItems}
        </Picker>
        <View
          style={{
            marginTop: -52,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            height: 46,
          }}
        >
          <MyText style={styles.input}>{value}</MyText>
          <MyIcon name="menu-down" color="#777" style={{ marginRight: 12 }} />
        </View>
        <MyDivider style={styles.divider} />
        <MyText style={styles.error}>{errorMessage}</MyText>
      </View>
    );

  return (
    <View style={[styles.container, style]}>
      <MyText style={[styles.label, { marginBottom: 10 }]}>{label}</MyText>
      <Picker
        mode="dropdown"
        selectedValue={value}
        onValueChange={(v) => {
          onValueChange(v);
          setValue(v);
        }}
      >
        {pickerItems}
      </Picker>
      <MyDivider style={[styles.divider, { top: 8 }]} />
      <MyText style={styles.error}>{errorMessage}</MyText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 3,
    paddingBottom: 4,
  },
  label: {
    color: myColors.primaryColor,
    marginLeft: 7,
    alignSelf: "flex-start",
    fontSize: 16,
    fontFamily: myFonts.Bold,
  },
  input: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    fontSize: 18,
  },
  error: {
    fontSize: 12,
    color: "red",
    marginLeft: 12,
  },
  divider: {
    top: -6,
    marginLeft: 6,
    marginRight: 10,
    height: 1,
    backgroundColor: "#aaa",
  },
  toolbar: {
    height: 45,
    width: "100%",
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "#dedede",
    zIndex: 2,
  },
  done: {
    color: "#007aff",
    fontWeight: "600",
    fontSize: 17,
    paddingTop: 1,
    paddingRight: 11,
  },
});

export default MyPicker;
