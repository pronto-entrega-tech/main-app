import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import icons from '~/constants/svgPaths';
import myColors from '~/constants/myColors';

export type IconNames = keyof typeof icons;

export type MyIconProps = {
  name: IconNames;
  /**
   * @default primaryColor
   */
  color?: string;
  /**
   * @default 24
   */
  size?: number;
  style?: StyleProp<TextStyle>;
};
const MyIcon = ({
  name,
  color = myColors.primaryColor,
  size = 24,
  style,
}: MyIconProps) => (
  /**
   * cellphone-android and cellphone-iphone was removed
   *
   * @ts-expect-error */
  <Icon name={name} color={color} size={size} style={style} />
);

export default MyIcon;
