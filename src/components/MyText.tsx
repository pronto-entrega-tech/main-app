import React from 'react';
import { Text, TextProps } from 'react-native';
import { myColors } from '~/constants';

const MyText = ({ style, ...props }: TextProps) => (
  <Text
    style={[{ color: myColors.text7 }, style]}
    {...{ pointerEvents: 'none' }}
    {...props}
  />
);

export default MyText;
