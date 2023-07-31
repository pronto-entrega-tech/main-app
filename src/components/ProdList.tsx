import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  StyleProp,
  ViewStyle,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { myColors } from '~/constants';
import { SearchParams } from '~/services/api/products';
import { useConnection } from '~/functions/connection';
import ProdItem from './ProdItem';
import ProdItemHorizontal from './ProdItemHorizontal';
import Loading from './Loading';
import Errors, { NothingFeed } from './Errors';
import { Product } from '~/core/models';
import { getLatLong, toCityState } from '~/functions/converter';
import { useAddressContext } from '~/contexts/AddressContext';
import { api } from '~/services/api';
import { useCartContext } from '~/contexts/CartContext';

const ProdList = (props: {
  header?: JSX.Element;
  data?: Product[];
  isSearch?: boolean;
  searchParams?: SearchParams;
  style?: StyleProp<ViewStyle>;
  hideMarketLogo?: boolean;
  horizontalItems?: boolean;
  horizontal?: boolean;
  refreshLess?: boolean;
  tryAgain?: boolean;
}) => {
  const {
    header,
    data,
    isSearch,
    searchParams,
    style = {},
    hideMarketLogo = false,
    horizontalItems = false,
    horizontal = false,
    refreshLess = false,
    tryAgain,
  } = props;
  const { shoppingList, addProduct, removeProduct } = useCartContext();
  const { address } = useAddressContext();
  const [innerData, setInnerData] = useState<Product[]>();
  const [serverErr, setServerErr] = useState<'server'>();
  const [refreshing, setRefreshing] = useState(false);

  const listData = data ?? innerData;

  const hasInternet = useConnection();
  const connectErr = hasInternet === false ? 'connection' : undefined;

  const city = address && toCityState(address);

  const missingAddress = city === null ? 'missing_address' : undefined;

  const nothingErr =
    listData && !listData.length
      ? isSearch
        ? 'nothing_search'
        : 'nothing_feed'
      : undefined;

  const { width } = useWindowDimensions();
  const columns = (() => {
    if (width > 768) return 5; // desktop
    if (width > 430) return 4; // tablet
    return 3; // mobile
  })();

  const numColumns = horizontal ? 1 : columns;

  const tryFeed = useCallback(
    async (refresh = false) => {
      if ((listData && !refresh) || connectErr || !city) return;

      try {
        const prodFeed = await api.products.findMany(city, {
          ...searchParams,
          latLong: getLatLong(address),
        });

        setInnerData(prodFeed);
        setServerErr(undefined);
      } catch {
        setServerErr('server');
      }
    },
    [listData, connectErr, city, searchParams, address]
  );

  const searchParamsString = JSON.stringify(searchParams);
  useEffect(() => {
    setInnerData(undefined);
  }, [city, searchParamsString]);

  useEffect(() => {
    tryFeed();
  }, [tryAgain, tryFeed, city]);

  const error = connectErr ?? missingAddress ?? nothingErr ?? serverErr;
  if (error)
    return (
      <>
        {header}
        <Errors error={error} onPress={() => tryFeed()} />
      </>
    );

  if (!listData || !shoppingList) return <Loading />;

  if (!horizontalItems) {
    const margin = 1.5;
    const widthPercentage = (100 - margin * (numColumns + 1)) / numColumns;

    const _ProdItem = ({ item }: { item: Product }) => (
      <ProdItem
        style={{
          width: !horizontal ? `${widthPercentage}%` : width / columns - 14,
          marginLeft: !horizontal ? `${margin}%` : 4,
          marginBottom: !horizontal ? `${margin}%` : 4,
        }}
        item={item}
        showsMarketLogo={!hideMarketLogo}
        quantity={shoppingList.get(item.item_id)?.quantity}
        onPressAdd={() => addProduct(item)}
        onPressRemove={() => removeProduct(item)}
      />
    );

    const refresh = async () => {
      setRefreshing(true);
      await tryFeed(true);
      setRefreshing(false);
    };
    return (
      <FlatList
        getItemLayout={(_item, i) => ({
          length: 228,
          offset: 228 * i,
          index: i,
        })}
        refreshControl={
          refreshLess ? undefined : (
            <RefreshControl
              colors={[myColors.primaryColor]}
              refreshing={refreshing}
              onRefresh={refresh}
            />
          )
        }
        contentContainerStyle={[!horizontal && { paddingBottom: 50 }, style]}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={listData}
        extraData={numColumns}
        key={numColumns}
        numColumns={numColumns}
        horizontal={horizontal}
        keyExtractor={(v) => v.item_id}
        ListHeaderComponent={header}
        renderItem={_ProdItem}
        ListEmptyComponent={NothingFeed}
      />
    );
  }

  const _ProdItemHorizontal = ({ item }: { item: Product }) => (
    <ProdItemHorizontal
      item={item}
      showsMarketLogo={!hideMarketLogo}
      quantity={shoppingList.get(item.item_id)?.quantity}
      onPressAdd={() => addProduct(item)}
      onPressRemove={() => removeProduct(item)}
    />
  );

  return (
    <FlatList
      getItemLayout={(_item, i) => ({ length: 112, offset: 112 * i, index: i })}
      contentContainerStyle={[{ paddingBottom: 50 }, style]}
      showsVerticalScrollIndicator={false}
      data={listData}
      keyExtractor={({ prod_id, market_id }) => prod_id + market_id}
      ListHeaderComponent={header}
      renderItem={_ProdItemHorizontal}
      ListEmptyComponent={NothingFeed}
    />
  );
};

export default ProdList;
