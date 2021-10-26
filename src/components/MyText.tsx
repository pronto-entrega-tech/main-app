import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import myFonts from '~/constants/myFonts';

function MyText({
  children,
  style,
  ellipsizeMode,
  numberOfLines,
}: {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  numberOfLines?: number;
}) {
  return (
    <Text
      {...{ pointerEvents: 'none' }}
      style={[
        {
          fontFamily: myFonts.Regular,
        },
        style,
      ]}
      ellipsizeMode={ellipsizeMode}
      numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
}

export default MyText;
