import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { prodModel } from './ProdItem';
import { StackNavigationProp } from '@react-navigation/stack';
import ProdList from './ProdList';

function ProdListHorizontal({
  navigation,
  header,
  data,
  style,
  marketless = false,
}: {
  navigation: StackNavigationProp<any, any>;
  header: any;
  data?: prodModel[];
  style?: StyleProp<ViewStyle>;
  marketless?: boolean;
}) {
  return (
    <ProdList
      navigation={navigation}
      header={header}
      data={data}
      style={style}
      marketless={marketless}
      horizontalItems
    />
  );
}

export default ProdListHorizontal;
