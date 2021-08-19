import React from 'react';
import { StyleProp, ViewStyle, TouchableOpacity, TextStyle, PixelRatio } from 'react-native';
import { device, myColors } from '../constants';
import MyText from './MyText';
import MyTouchable from './MyTouchable';

function MyButton ({onPress, title, icon, iconRight = false, disabled = false, type = 'solid', buttonStyle, titleStyle}: 
{onPress: (item: any) => void, title: string, icon?: any, iconRight?: boolean, disabled?: boolean, type?: 'solid'|'outline'|'clear',
buttonStyle?: StyleProp<ViewStyle>, titleStyle?: StyleProp<TextStyle>}) {
  const baseStyle: StyleProp<ViewStyle> = {
    borderRadius: 4,
    minHeight: 44,
    minWidth: 44,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: iconRight? 'row-reverse' : 'row'}

  let typeStyle: StyleProp<ViewStyle>;
  switch (type) {
    case 'solid':
      typeStyle =  {backgroundColor: !disabled? myColors.primaryColor : '#E3E6E8'}
      break;
    case 'outline':
      typeStyle = {borderColor: !disabled? myColors.primaryColor : '#9CA3AA', borderWidth: 1}
      break;
    default:
      typeStyle = {}
      break;
  }

  const ButtonText = () => {
    return (
      <>
        {icon}
        <MyText style={[{
          color: disabled? '#9CA3AA' : type == 'solid'? 'white' : myColors.primaryColor,
          fontFamily: device.iOS? 'Regular' : 'Medium',
          fontSize: 12 + PixelRatio.get() * 2
        }, titleStyle]} >{title}</MyText>
      </>
    )
  }

  if (device.iOS)
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[baseStyle, typeStyle, buttonStyle]} >
      <ButtonText/>
    </TouchableOpacity>
  )

  return (
    <MyTouchable
      solid={type == 'solid'}
      disabled={disabled}
      onPress={onPress}
      style={[baseStyle, typeStyle, buttonStyle]} >
      <ButtonText/>
    </MyTouchable>
  )
}

export default MyButton