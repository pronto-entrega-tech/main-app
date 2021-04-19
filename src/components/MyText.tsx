import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

function MyText({style={}, children}: {style: StyleProp<TextStyle>, children: string | string[]}) {
  return (
    <Text style={[{fontFamily: 'Regular'}, style]} >{children}</Text>
  )
}

export default MyText