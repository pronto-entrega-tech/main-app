import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, StyleSheet, TouchableNativeFeedback, TouchableHighlight, Pressable } from 'react-native';
import { myColors, device, globalStyles } from '../constants';
import colors from '../constants/colors';

function IconButton ({onPress, icon, size=24, color=myColors.primaryColor, type } : 
{onPress: (item: any) => void, icon: string, size?: number, color?: string, 
  type?: 'clear'|'add'|'addHorizontal'|'fill'|'back'|'profile'|'address'|'prodIcons'|'profile2'|'cancel' }) {
  let style = {};
  let conteinerStyle = {};
  let rippleRadius = 30;
  let hitSlop = 0;
  switch(type){
    case 'clear':
      style = styles.buttonClear;
      rippleRadius = 22;
      break;
    case 'add':
      conteinerStyle = [styles.buttonAdd, globalStyles.elevation4, globalStyles.darkBoader];
      hitSlop = 16;
      break;
    case 'addHorizontal':
      conteinerStyle = [styles.buttonAddHorizontal, globalStyles.elevation4, globalStyles.darkBoader];
      break;
    case 'back':
      style = styles.buttonBack;
      rippleRadius = 24;
      break;
    case 'cancel':
      style = styles.cancel;
      rippleRadius = 24;
      break;
    case 'prodIcons':
      style = styles.buttonProdIcons;
      rippleRadius = 24;
      break;
    case 'profile':
      conteinerStyle = [styles.buttonProfile, globalStyles.elevation4, globalStyles.darkBoader];
      break;
    case 'profile2':
      conteinerStyle = [styles.buttonProfile2, globalStyles.elevation4];
      break;
    case 'address':
      conteinerStyle = styles.buttonAddress;
      rippleRadius = 24;
      break;
    default:
      conteinerStyle = [styles.button, globalStyles.elevation4, globalStyles.darkBoader];
  }
  if (device.android)
  return (
    <View style={conteinerStyle}>
      <TouchableNativeFeedback 
        style={{borderRadius: 60}}
        background={TouchableNativeFeedback.Ripple('#aaa', true, rippleRadius)}
        onPress={onPress} >
        <View style={style} >
          <Icon name={icon} size={size} color={color} />
        </View>  
      </TouchableNativeFeedback>
    </View>
  )
  
  return (
    <TouchableHighlight
      style={[style, conteinerStyle]} 
      underlayColor={myColors.buttonUnderlayColor}
      onPress={onPress} >
      <Icon name={icon} size={size} color={color} />
    </TouchableHighlight>
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