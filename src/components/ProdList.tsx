import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  StyleProp,
  ViewStyle,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { myColors } from '~/constants';
import useMyContext from '~/core/MyContext';
import { getProdFeed, SearchParams } from '~/services/requests';
import { getCity } from '~/core/dataStorage';
import { hasInternet } from '~/functions/connection';
import ProdItem, { Product } from './ProdItem';
import ProdItemHorizontal from './ProdItemHorizontal';
import Loading, { Errors, myErrors, NothingFeed } from './Loading';

function ProdList(props: {
  header?: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  data?: Product[];
  isSearch?: boolean;
  searchParams?: SearchParams;
  style?: StyleProp<ViewStyle>;
  hideMarketLogo?: boolean;
  horizontalItems?: boolean;
  horizontal?: boolean;
  refreshless?: boolean;
  tryAgain?: boolean;
}) {
  const {
    header,
    data,
    isSearch,
    searchParams,
    style = {},
    hideMarketLogo = false,
    horizontalItems = false,
    horizontal = false,
    refreshless = false,
    tryAgain,
  } = props;
  const [isLoading, setIsLoading] = useState(!data);
  const [error, setError] = useState<myErrors>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [innerData, setInnerData] = useState<Product[]>();
  const [city, setCity] = React.useState('');
  const { shoppingList, onPressAdd, onPressRemove } = useMyContext();

  const { width } = useWindowDimensions();

  const [columns, setColumns] = React.useState(3);

  React.useEffect(() => {
    setColumns(
      (() => {
        if (width > 768) return 5; // desktop
        if (width > 425) return 4; // tablet
        return 3; // mobile
      })()
    );
  }, [width]);

  const numColumns = horizontal ? 1 : columns;

  async function tryFeed() {
    if (data) return;
    try {
      setIsLoading(true);
      setError(null);

      if (!(await hasInternet())) return setError('connection');

      const city = await getCity();
      setCity(city);
      const prodFeed = await getProdFeed(city, searchParams);

      if (!prodFeed.length)
        return setError(isSearch ? 'nothing_search' : 'nothing');

      setInnerData(prodFeed);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError('server');
    }
  }

  useEffect(() => {
    tryFeed();
  }, [tryAgain]);

  useEffect(() => {
    setIsLoading(!data && !innerData);
  }, [data, innerData]);

  if (error)
    return (
      <Errors
        error={error}
        onPress={() => {
          setError(null);
          tryFeed();
        }}
      />
    );

  if (isLoading) return <Loading />;

  if (!horizontalItems) {
    const margin = 1.5;
    const widthPercentage = (100 - margin * (numColumns + 1)) / numColumns;

    const myRenderItem = ({ item }: { item: Product }) => (
      <ProdItem
        style={{
          width: !horizontal ? `${widthPercentage}%` : width / columns - 14,
          marginLeft: !horizontal ? `${margin}%` : 4,
          marginBottom: !horizontal ? `${margin}%` : 4,
        }}
        city={city}
        item={item}
        showsMarketLogo={!hideMarketLogo}
        quantity={shoppingList.get(item.prod_id)?.quantity}
        onPressAdd={() => onPressAdd(item)}
        onPressRemove={() => onPressRemove(item)}
      />
    );

    return (
      <FlatList
        getItemLayout={(_item, i) => ({
          length: 228,
          offset: 228 * i,
          index: i,
        })}
        refreshControl={
          refreshless ? undefined : (
            <RefreshControl
              colors={[myColors.primaryColor]}
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
                await tryFeed();
                setRefreshing(false);
              }}
            />
          )
        }
        contentContainerStyle={[!horizontal && { paddingBottom: 50 }, style]}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={data ?? innerData}
        extraData={numColumns}
        key={numColumns}
        numColumns={numColumns}
        horizontal={horizontal}
        keyExtractor={({ prod_id, market_id }) => prod_id + market_id}
        ListHeaderComponent={header}
        renderItem={myRenderItem}
        ListEmptyComponent={NothingFeed}
      />
    );
  }

  const myRenderItem = ({ item }: { item: Product }) => (
    <ProdItemHorizontal
      item={item}
      city={city}
      showsMarketLogo={!hideMarketLogo}
      quantity={shoppingList.get(item.prod_id)?.quantity}
      onPressAdd={() => onPressAdd(item)}
      onPressRemove={() => onPressRemove(item)}
    />
  );

  return (
    <FlatList
      getItemLayout={(_item, i) => ({ length: 112, offset: 112 * i, index: i })}
      contentContainerStyle={[{ paddingBottom: 50 }, style]}
      showsVerticalScrollIndicator={false}
      data={data ?? innerData}
      keyExtractor={({ prod_id, market_id }) => prod_id + market_id}
      ListHeaderComponent={header}
      renderItem={myRenderItem}
      ListEmptyComponent={NothingFeed}
    />
  );
}

export default ProdList;
