import React from 'react';
import { View, TouchableNativeFeedback, TouchableHighlight , StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import { myColors, device } from '../constants';

function MyButton ({ style, underlayColor = myColors.buttonUnderlayColor, onPress, children, disabled=false } : 
  { style?: StyleProp<ViewStyle>, underlayColor?: string, onPress: (item: any) => void, children: any | any[], disabled?: boolean}) {
  if (device.android) {
    return (
      <TouchableNativeFeedback 
        useForeground
        disabled={disabled}
        onPress={onPress} >
        <View style={style}>
          <>
            {children}
          </>
        </View>
      </TouchableNativeFeedback>
    )
  }
  return (
    <TouchableHighlight 
      style={style}
      disabled={disabled}
      underlayColor={underlayColor}
      onPress={onPress} >
      <>
        {children}
      </>
    </TouchableHighlight>
  )
}

export function ButtonClear ({ style, onPress, children } : 
  { style: StyleProp<ViewStyle>, onPress: (item: any) => void, children: any}) {
  if (device.android) {
    return (
      <TouchableNativeFeedback 
        onPress={onPress} >
        <View style={style}>
          {children}
        </View>
      </TouchableNativeFeedback>
    )
  }
  return (
    <TouchableOpacity 
      style={style}
      onPress={onPress} >
      {children}
    </TouchableOpacity>
  )
}

export default MyButton