import React, { ComponentProps } from "react";
import { Switch as NativeSwitch } from "react-native";
import device from "~/constants/device";
import myColors from "~/constants/myColors";

type Props = ComponentProps<typeof NativeSwitch> & {
  color?: string;
};
const Switch = ({
  onValueChange,
  color = myColors.colorAccent,
  ...props
}: Props) => {
  const activeTrackColor = props.disabled
    ? "rgba(255, 255, 255, 0.12)"
    : "rgba(6, 121, 183, 0.5)";

  const thumbColor = props.disabled
    ? "#bdbdbd"
    : props.value
      ? color
      : "#fafafa";

  const baseProps = device.web
    ? {
        thumbColor,
        activeThumbColor: color,
      }
    : device.iOS
      ? {
          trackColor: {
            true: color,
            false: "",
          },
        }
      : {
          thumbColor,
          trackColor: {
            true: activeTrackColor,
            false: "",
          },
        };

  return (
    <NativeSwitch
      onValueChange={props.disabled ? undefined : onValueChange}
      {...baseProps}
      {...props}
    />
  );
};

export default Switch;
