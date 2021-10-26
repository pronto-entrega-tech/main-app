import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import icons from '~/constants/svgPaths';
import myColors from '~/constants/myColors';

export type IconNames = keyof typeof icons;

export interface MyIconProps {
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
}
function MyIcon({
  name,
  color = myColors.primaryColor,
  size = 24,
  style,
}: MyIconProps) {
  return <Icon name={name} color={color} size={size} style={style} />;
}

export default MyIcon;
