import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Share, StatusBar } from 'react-native';
import { Divider } from 'react-native-elements';
import { CartBar } from '~/core/BottomTabs';
import IconButton from '~/components/IconButton';
import { myColors, device, myTitle } from '~/constants';
import Mercado from '../Home/Mercado';
import ProductDetails from './ProductDetails';
import { prodModel } from '~/components/ProdItem';
import requests, { getProd } from '~/services/requests';
import Loading, { Errors, myErrors } from '~/components/Loading';
import { ProdContext } from '~/functions/ProdContext';
import { createProdItem } from '~/functions/converter';
import useMyContext from '~/functions/MyContext';

export function ProductHeader({
  navigation,
  item,
  city,
}: {
  navigation: StackNavigationProp<any, any>;
  item: prodModel;
  city: string;
}) {
  const { notify, onPressNot } = useMyContext();

  return (
    <>
      <View
        style={{
          height: device.android
            ? StatusBar.currentHeight
            : device.iPhoneNotch
            ? 34
            : 0,
          backgroundColor: myColors.background,
        }}
      />
      <View
        style={{
          backgroundColor: myColors.background,
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 46,
        }}>
        <IconButton
          icon='arrow-left'
          size={24}
          color={myColors.primaryColor}
          type='back'
          onPress={() => {
            if (navigation.canGoBack()) return navigation.goBack();
            navigation.navigate('BottomTabs', { screen: 'Home' });
          }}
        />
        <View style={{ flexDirection: 'row' }}>
          <IconButton
            icon={notify.has(item.prod_id) ? 'bell' : 'bell-outline'}
            size={24}
            color={myColors.primaryColor}
            type='back'
            onPress={() => onPressNot(item)}
          />
          <IconButton
            icon='share-variant'
            size={24}
            color={myColors.primaryColor}
            type='prodIcons'
            onPress={() => {
              console.log(navigation.getState());
              Share.share({
                message: `${requests}produto/${city}/${item.market_id}/${item.prod_id}`,
              });
            }}
          />
        </View>
      </View>
    </>
  );
}

const Tab = createMaterialTopTabNavigator();

function Product({
  navigation,
  route: { params },
}: {
  navigation: StackNavigationProp<any, any>;
  route: any;
}) {
  const [product, setItem] = React.useState<prodModel>(params?.item);
  const [error, setError] = React.useState<myErrors>(null);
  const [tryAgain, setTryAgain] = React.useState(false);

  React.useEffect(() => {
    if (product) return;
    (async () => {
      try {
        const { city, marketId, prodId } = params;

        const { data } = await getProd(city, marketId, prodId);

        if (!data) return setError('nothing');
        setItem(createProdItem(data));
      } catch {
        setError('server');
      }
    })();
  }, [tryAgain]);

  if (error)
    return (
      <Errors
        error={error}
        onPress={() => {
          setError(null);
          setTryAgain(!tryAgain);
        }}
      />
    );

  if (!product) return <Loading />;
  return (
    <>
      <ProductHeader
        navigation={navigation}
        item={product}
        city={params.city}
      />
      <View style={device.web ? { height: device.height } : { flex: 1 }}>
        <ProdContext.Provider
          value={{
            product: product,
            city: params.city,
            marketId: params.marketId,
          }}>
          <Tab.Navigator
            tabBarOptions={{
              activeTintColor: myColors.text3,
              indicatorStyle: { backgroundColor: myColors.primaryColor },
            }}>
            <Tab.Screen
              name='ProductDetails'
              component={ProductDetails}
              options={{ tabBarLabel: 'Produto', title: myTitle }}
            />
            <Tab.Screen
              name='MercadoDetails'
              component={Mercado}
              options={{ tabBarLabel: 'Mercado', title: myTitle }}
            />
          </Tab.Navigator>
        </ProdContext.Provider>
        <Divider
          style={{
            width: '100%',
            height: 1,
            marginTop: 48,
            backgroundColor: myColors.divider2,
            position: 'absolute',
          }}
        />
        <CartBar navigation={navigation} />
      </View>
    </>
  );
}

export default Product;
