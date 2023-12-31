import React, { ReactElement } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Product } from '~/core/models';
import ProdList from './ProdList';

const ProdListHorizontal = ({
  header,
  data,
  style,
  hideMarketLogo,
}: {
  header?: ReactElement;
  data?: Product[];
  style?: StyleProp<ViewStyle>;
  hideMarketLogo?: boolean;
}) => (
  <ProdList
    header={header}
    data={data}
    style={style}
    hideMarketLogo={hideMarketLogo}
    horizontalItems
  />
);

export default ProdListHorizontal;
