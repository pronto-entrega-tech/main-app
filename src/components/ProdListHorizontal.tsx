import React, { ReactElement } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Product } from '~/core/models';
import ProdList from './ProdList';
import { SearchParams } from '~/services/api/products';

const ProdListHorizontal = ({
  header,
  data,
  searchParams,
  style,
  hideMarketLogo,
}: {
  header?: ReactElement;
  data?: Product[];
  searchParams?: SearchParams;
  style?: StyleProp<ViewStyle>;
  hideMarketLogo?: boolean;
}) => (
  <ProdList
    header={header}
    data={data}
    searchParams={searchParams}
    style={style}
    hideMarketLogo={hideMarketLogo}
    horizontalItems
  />
);

export default ProdListHorizontal;
