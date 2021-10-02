import React from 'react';
import {
  View,
  TouchableNativeFeedback,
  StyleProp,
  ViewStyle,
  Insets,
} from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { device } from '~/constants';

function MyTouchable({
  onPress,
  children,
  disabled = false,
  hitSlop,
  style,
  solid = false,
}: {
  onPress: (item: any) => void;
  children?: any | any[];
  disabled?: boolean;
  hitSlop?: Insets;
  style?: StyleProp<ViewStyle>;
  solid?: boolean;
}) {
  if (device.android)
    return (
      <TouchableNativeFeedback
        useForeground
        background={
          solid
            ? TouchableNativeFeedback.Ripple('rgba(255, 255, 255, .32)', false)
            : undefined
        }
        hitSlop={hitSlop}
        disabled={disabled}
        onPress={onPress}>
        <View style={[{ overflow: 'hidden' }, style]}>{children}</View>
      </TouchableNativeFeedback>
    );

  return (
    <TouchableRipple
      rippleColor={solid ? 'rgba(255, 255, 255, .32)' : undefined}
      underlayColor={solid ? '#68b5f2' : undefined}
      hitSlop={hitSlop}
      disabled={disabled}
      onPress={onPress}
      style={style}>
      <>{children}</>
    </TouchableRipple>
  );
}

export default MyTouchable;
