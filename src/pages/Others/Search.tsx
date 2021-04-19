import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import { CartBar } from './BottomTabs';
import ProdList from '../../components/ProdList';
import { myColors, device } from '../../constants';

function Search({ navigation, route }:
  {navigation: StackNavigationProp<any, any>}) {
  return(
    <View style={[{backgroundColor: myColors.background, flex: 1}, device.web ? {height: device.height-110} : {}]}>
      <ProdList navigation={navigation} title={route.params} header={({ key }: { key: number }) => (
        <View key={key} >
        </View>
      )} />
      <CartBar navigation={navigation} />
    </View>
  )
}

export default Search