import { StyleSheet } from "react-native";
import myColors from "./myColors";
import device, { notchHeight } from "./device";

const globalStyles = StyleSheet.create({
  centralizer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notch: {
    marginTop: notchHeight,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 66,
  },
  bottomButton: {
    backgroundColor: "white",
    position: device.web ? "fixed" : "absolute",
    alignSelf: "center",
    height: 46,
    minWidth: 210,
    // MyButton overwrite paddingHorizontal
    paddingLeft: 24,
    paddingRight: 24,
    bottom: device.iPhoneNotch ? 38 : 12,
    borderWidth: 2,
  },
  darkBorder: {
    borderWidth: device.web ? 1 : 0,
    borderColor: myColors.divider,
  },
  elevation1: device.web
    ? {
        boxShadow: "0 1px 3px rgb(0 0 0 / 18%);",
      }
    : {
        elevation: 1,
        shadowColor: "black",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1,
      },
  elevation2: device.web
    ? {
        boxShadow: "0 1px 2.41px rgb(0 0 0 / 20%);",
      }
    : {
        elevation: 2,
        shadowColor: "black",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
  elevation3: device.web
    ? {
        boxShadow: "0 1px 4.22px rgb(0 0 0 / 22%);",
      }
    : {
        elevation: 3,
        shadowColor: "black",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
      },
  elevation4: device.web
    ? {
        boxShadow: "0 2px 2.62px rgba(0, 0, 0, 0.23)",
      }
    : {
        elevation: 4,
        shadowColor: "black",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
      },
  elevation5: device.web
    ? { boxShadow: "0 2px 5.84px rgb(0 0 0 / 25%);" }
    : {
        elevation: 5,
        shadowColor: "black",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
});

export default globalStyles;
