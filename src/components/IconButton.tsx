import React from 'react';
import { Insets, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { myColors } from '~/constants';
import MyTouchable, { ButtonOrLink } from './MyTouchable';
import MyIcon, { IconNames } from './MyIcon';

type IconButtonBase = {
  icon: IconNames;
  /**
   * @default 24
   */
  size?: number;
  /**
   * @default primaryColor
   */
  color?: string;
  style?: StyleProp<ViewStyle>;
  disabledStyle?: StyleProp<ViewStyle>;
  /**
   *  @platform web.
   */
  hoverStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  hitSlop?: Insets;
};

type IconButtonProps = ButtonOrLink<IconButtonBase>;

const IconButton = ({
  icon,
  size = 24,
  color = myColors.primaryColor,
  style,
  disabledStyle,
  hoverStyle,
  disabled,
  hitSlop,
  ...props
}: IconButtonProps) => {
  return (
    <MyTouchable
      hitSlop={hitSlop}
      style={[
        styles.base,
        style,
        disabled ? disabledStyle ?? { opacity: 0.4 } : {},
      ]}
      hoverStyle={hoverStyle}
      disabled={disabled}
      {...props}>
      <MyIcon name={icon} size={size} color={color} />
    </MyTouchable>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    width: 44,
    height: 44,
  },
});

export default IconButton;
