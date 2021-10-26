import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Product } from './ProdItem';
import ProdList from './ProdList';

function ProdListHorizontal({
  header,
  data,
  style,
  hideMarketLogo,
}: {
  header?: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  data?: Product[];
  style?: StyleProp<ViewStyle>;
  hideMarketLogo?: boolean;
}) {
  return (
    <ProdList
      header={header}
      data={data}
      style={style}
      hideMarketLogo={hideMarketLogo}
      horizontalItems
    />
  );
}

export default ProdListHorizontal;
