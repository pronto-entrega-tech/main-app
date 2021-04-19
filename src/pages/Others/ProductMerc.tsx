import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text } from 'react-native';
import { prodModel } from '../../components/ProdItem';
import ProdListHorizontal from '../../components/ProdListHorizontal';
import { myColors, device } from '../../constants'; 

function ProductMerc({ navigation, item }:
  {navigation: StackNavigationProp<any, any>, item: prodModel}) {
  return(
    <View style={{backgroundColor: myColors.background, flex: 1}} >
      <ProdListHorizontal navigation={navigation} header={({ key }: { key: number }) => (
        <View key={key}>
          
        </View>
      )} />
    </View>
  )
}

export default ProductMerc