import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { myColors, device, globalStyles } from '../constants';
import colors from '../constants/colors';
import { TouchableRipple } from 'react-native-paper';
import MyTouchable from './MyTouchable';

function IconButton ({onPress, icon, size=24, color=myColors.primaryColor, type } : 
{onPress: (item: any) => void, icon: string, size?: number, color?: string, 
  type?: 'clear'|'add'|'addHorizontal'|'fill'|'back'|'profile'|'address'|'prodIcons'|'profile2'|'cancel' }) {
  let hitSlop;
  let style = {};
  switch(type){
    case 'clear':
      style = styles.buttonClear;
      break;
    case 'add':
      style = [styles.buttonAdd, globalStyles.elevation4, globalStyles.darkBoader];
      hitSlop = {top: 9, bottom: 9, left: 12, right: 12};
      break;
    case 'addHorizontal':
      style = [styles.buttonAddHorizontal, globalStyles.elevation4, globalStyles.darkBoader];
      hitSlop = {top: 10, bottom: 10, left: 10, right: 12};
      break;
    case 'back':
      style = styles.buttonBack;
      break;
    case 'cancel':
      style = styles.cancel;
      break;
    case 'prodIcons':
      style = styles.buttonProdIcons;
      break;
    case 'profile':
      style = [styles.buttonProfile, globalStyles.elevation4, globalStyles.darkBoader];
      break;
    case 'profile2':
      style = [styles.buttonProfile2, globalStyles.elevation4];
      break;
    case 'address':
      style = styles.buttonAddress;
      break;
    default:
      style = [styles.button, globalStyles.elevation4, globalStyles.darkBoader];
  }
  
  return (
    <MyTouchable
      hitSlop={hitSlop}
      onPress={onPress}
      style={style} >
      <Icon name={icon} size={size} color={color} />
    </MyTouchable>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 54,
    height: 54,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
    margin: 5,
  },
  buttonClear: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 48,
    padding: 10
  },
  buttonAdd: {
    width: 32,
    height: 28,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
    margin: 2,
  },
  buttonAddHorizontal: {
    width: 26,
    height: 26,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
    margin: 2,
  },
  buttonBack: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 56
  },
  buttonProdIcons: {
    marginLeft: -8,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 56
  },
  buttonProfile: {
    width: 50,
    height: 50,
    marginTop: -45,
    right: -40,
    marginBottom: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
    margin: 5,
  },
  buttonProfile2: {
    width: 50,
    height: 50,
    backgroundColor: colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
    margin: 5,
  },
  buttonAddress: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
    marginTop: -2,
  },
  cancel: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 48,
  }
})

export default IconButton