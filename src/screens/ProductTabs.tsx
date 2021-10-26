import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { View } from 'react-native';
import CartBar from '~/components/CartBar';
import { myColors, myTitle } from '~/constants';
import ProductDetails from '@pages/produto/[city]/[marketId]/[prodId]';
import ProductMarket from '@pages/produto/[city]/[marketId]/[prodId]/mercado';
import useRouting from '~/hooks/useRouting';
import ProductHeader from '~/components/ProductHeader';
import { RouteProp } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

function ProductTabs({ route: { params } }: { route: RouteProp<any> }) {
  return (
    <>
      <ProductHeader pathname={params?.path} />
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
            {() => <ProductDetails product={params?.item} />}
          </Tab.Screen>
          <Tab.Screen
            name='ProductMarket'
            initialParams={params}
            options={{ tabBarLabel: 'Mercado' }}
            component={ProductMarket}
          />
        </Tab.Navigator>
        {/* <MyDivider
        style={{
          width: '100%',
          marginTop: 48,
          backgroundColor: myColors.divider2,
          position: 'absolute',
        }}
      /> */}
      </View>
      <CartBar />
    </>
  );
}

export default ProductTabs;
