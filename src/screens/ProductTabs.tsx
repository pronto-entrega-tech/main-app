import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useState } from 'react';
import { View } from 'react-native';
import CartBar from '~/components/CartBar';
import { myColors, myTitle } from '~/constants';
import { ProductDetails } from '@pages/produto/[city]/[itemId]';
import { MarketFeed } from '@pages/inicio/mercado/[city]/[marketId]';
import ProductHeader from '~/components/ProductHeader';
import useRouting from '~/hooks/useRouting';
import { UseStore, useAtom } from '~/functions/stores';

const Tab = createMaterialTopTabNavigator();

const ProductTabs = () => {
  const { params } = useRouting();
  const $marketId = useAtom<string>();

  return (
    <>
      <ProductHeader />
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={{
            title: myTitle,
            tabBarActiveTintColor: myColors.text3,
            tabBarIndicatorStyle: { backgroundColor: myColors.primaryColor },
          }}>
          <Tab.Screen
            name='ProductDetails'
            initialParams={params}
            options={{ tabBarLabel: 'Produto' }}>
            {() => <ProductDetails setMarketId={$marketId.set} />}
          </Tab.Screen>
          <Tab.Screen
            name='ProductMarket'
            initialParams={params}
            options={{ tabBarLabel: 'Mercado' }}>
            {() => (
              <UseStore store={$marketId}>
                {(marketId) => <MarketFeed marketId={marketId} />}
              </UseStore>
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
      <CartBar />
    </>
  );
};

export default ProductTabs;
