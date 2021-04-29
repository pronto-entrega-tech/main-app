import React from 'react';
import { View, Text } from 'react-native';
import { myColors } from '../../constants';

function MercRating() {
  return(
    <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: myColors.background, flex: 1}}>
      <Text style={{fontSize: 15, color: myColors.text2}} >Nenhuma avaliação ainda</Text>
    </View>
  )
}

export default MercRating