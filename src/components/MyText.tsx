import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

function MyText({children, style={}, ellipsizeMode, numberOfLines}:
{children?: any | any[], style?: StyleProp<TextStyle>, ellipsizeMode?: 'head'|'middle'|'tail'|'clip', numberOfLines?: number}) {
  return (
    <Text
      style={[{fontFamily: 'Regular'}, style]}
      ellipsizeMode={ellipsizeMode}
      numberOfLines={numberOfLines} >
      {children}
    </Text>
  )
}

export default MyText