import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { prodModel } from './ProdItem';
import { StackNavigationProp } from '@react-navigation/stack';
import ProdList from './ProdList';

function ProdListHorizontal({navigation, header, data, style, merc = false}:
{navigation: StackNavigationProp<any, any>, header: any, data?: prodModel[], style?: StyleProp<ViewStyle>, merc?: boolean}) {
  return (
    <ProdList
      navigation={navigation}
      header={header}
      data={data}
      style={style}
      merc={merc}
      horizontalItems />
  )
}

export default ProdListHorizontal