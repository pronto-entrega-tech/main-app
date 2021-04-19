import React from 'react'
import { Text, View, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { myColors } from '../constants'
import IconButton from './IconButton';

interface typeModal {
  size: number,
  color: string,
  style: StyleProp<TextStyle>,
}

function IconButtonText ({ icon, text, onPress, type='fill' }:
{icon: string, text: string, onPress: (item: any) => void, type?: 'fill'|'profile2'}) {
  const [state, setState] = React.useState<typeModal>({
    size: 32,
    color: myColors.grey2,
    style: {},
  });

  React.useEffect(() => {
    if (type == 'profile2')
      setState({
        size: 28,
        color: '#fff',
        style: {fontFamily: 'Medium', paddingTop: 4},
      })
  }, [])
  
  return (
    <View>
      <IconButton icon={icon} size={state.size} color={state.color} type={type} onPress={onPress} />
      <Text style={[styles.text, state.style]} >{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    marginTop: -4,
    alignSelf: 'center',
    color: myColors.text,
    fontSize: 13,
    textAlign: 'center'
  }
})

export default IconButtonText