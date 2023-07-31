import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import { myColors } from '~/constants';

const MyText = ({
  children,
  style,
  ellipsizeMode,
  numberOfLines,
}: {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  numberOfLines?: number;
}) => (
  <Text
    {...{ pointerEvents: 'none' }}
    style={[{ color: myColors.text7 }, style]}
    ellipsizeMode={ellipsizeMode}
    numberOfLines={numberOfLines}>
    {children}
  </Text>
);

export default MyText;
