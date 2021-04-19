import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text } from 'react-native';
import { myColors } from '../../constants';

function Questions({navigation, route}:
  {navigation: StackNavigationProp<any, any>}) {
  const item: string[] = route.params;
  return (
    <View style={{backgroundColor: myColors.background, flex: 1, padding: 16}}>
      <Text style={{fontSize: 20, color: myColors.grey4}} >{item[0]}</Text>
      <Text style={{fontSize: 15, color: myColors.text2, marginTop: 8}} >{item[1]}</Text>
    </View>
  )
}

export default Questions