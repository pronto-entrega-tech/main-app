import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import { CartBar } from './BottomTabs';
import ProdList, { ListHeader } from '../../components/ProdList';
import { myColors, device } from '../../constants';

function Search({ navigation, route }:
  {navigation: StackNavigationProp<any, any>, route: any}) {
  return(
    <View style={[{backgroundColor: myColors.background}, device.web ? {height: device.height-114} : {flex: 1}]}>
      <ProdList refreshless navigation={navigation} header={({ key }: { key: number }) => (
        <View key={key} >
          <ListHeader navigation={navigation} title={route.params} />
        </View>
      )} />
      <CartBar navigation={navigation} />
    </View>
  )
}

export default Search