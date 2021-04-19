import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text } from 'react-native';
import { myColors } from '../../constants';

function UploadQuestion({navigation}:
  {navigation: StackNavigationProp<any, any>}) {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: myColors.background, flex: 1}}>
      <Text style={{fontSize: 15, color: myColors.text}} >Ainda não</Text>
    </View>
  )
}

export default UploadQuestion