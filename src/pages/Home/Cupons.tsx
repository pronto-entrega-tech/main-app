import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { View, Text } from 'react-native';
import { myColors } from '../../constants';

function Cupons() {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: myColors.background, flex: 1}}>
      <Text style={{fontSize: 15, color: myColors.text2}} >Nenhum cupom ainda</Text>
    </View>
  )
}

export default Cupons
