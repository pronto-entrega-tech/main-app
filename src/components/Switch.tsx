import React from 'react';
import { NativeModules, Switch as NativeSwitch } from 'react-native';
import { device } from '~/constants';

const version = NativeModules.PlatformConstants
  ? NativeModules.PlatformConstants.reactNativeVersion
  : undefined;

type Props = React.ComponentPropsWithRef<typeof NativeSwitch> & {
  color?: string;
};
const Switch = ({ value, disabled, onValueChange, color, ...rest }: Props) => {
  const onTintColor = device.iOS
    ? color
    : disabled
    ? 'rgba(255, 255, 255, 0.12)'
    : 'rgba(6, 121, 183, 0.5)'; /* setColor(color).alpha(0.5).rgb().string() */

  const thumbTintColor = device.iOS
    ? undefined
    : disabled
    ? '#bdbdbd'
    : value
    ? color
    : '#fafafa';

  const props =
    version && version.major === 0 && version.minor <= 56
      ? {
          onTintColor,
          thumbTintColor,
        }
      : device.web
      ? {
          activeTrackColor: onTintColor,
          thumbColor: thumbTintColor,
          activeThumbColor: color,
        }
      : {
          thumbColor: thumbTintColor,
          trackColor: {
            true: onTintColor,
            false: '',
          },
        };

  return (
    <NativeSwitch
      value={value}
      disabled={disabled}
      onValueChange={disabled ? undefined : onValueChange}
      {...props}
      {...rest}
    />
  );
};

export default Switch;
