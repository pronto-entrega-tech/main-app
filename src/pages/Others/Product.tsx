import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Share, StatusBar } from 'react-native';
import { Divider } from 'react-native-elements';
import { CartBar } from '../../core/BottomTabs';
import IconButton from '../../components/IconButton';
import { myColors, device } from '../../constants'; 
import Mercado from '../Home/Mercado';
import ProductDetails from './ProductDetails';
import { prodModel } from '../../components/ProdItem';
import requests from '../../services/requests';
import Loading, { Errors } from '../../components/Loading';
import { ProdContext } from '../../functions/ProdContext';
import { createProdItem } from '../../functions/converter';
import useMyContext from '../../functions/MyContext';

export function ProductHeader({navigation, item}:
{navigation: StackNavigationProp<any, any>, item: prodModel}) {
  const {notify, onPressNot} = useMyContext();
  
  return (
    <>
    <View style={{height: device.android? StatusBar.currentHeight : device.iPhoneNotch ? 34 : 0, backgroundColor: myColors.background}} />
    <View
      style={{backgroundColor: myColors.background, flexDirection: 'row', justifyContent: 'space-between', height: 46}} >
      <IconButton
        icon='arrow-left'
        size={24}
        color={myColors.primaryColor}
        type='back'
        onPress={() => {
          if (navigation.canGoBack()) return navigation.goBack()
          navigation.navigate('BottomTabs', {screen: 'Home'})
          }} />
      <View style={{flexDirection: 'row'}} >
        <IconButton
          icon={notify.has(item.prod_id)? 'bell' : 'bell-outline'}
          size={24}
          color={myColors.primaryColor}
          type='back'
          onPress={() => onPressNot(item)} />
        <IconButton
          icon='share-variant'
          size={24}
          color={myColors.primaryColor}
          type='prodIcons'
          onPress={() => {
            Share.share({message: requests+'produto/'+item.prod_id})
          }} />
      </View>
    </View>
    </>
  )
}

const Tab = createMaterialTopTabNavigator(); 

function Product({ navigation, route }:
{navigation: StackNavigationProp<any, any>, route: any}) {
  const [item, setItem] = React.useState<prodModel>(route.params?.item);
  const [error, setError] = React.useState<'server'|'connection'|'nothing'|null>(null);
  const [tryAgain, setTryAgain] = React.useState(false);

  React.useEffect(() => {
    if (item) return;
    fetch(requests+`prodList.php?market=${route.params?.market}&prod=${route.params?.prod}`)
      .then((response) => response.json())
      .then((json: any[]) => json.filter(item => item.prod_id == route.params?.prod)[0])
      .then((item) => setItem(createProdItem(item)))
      .catch(() => setError('server'))
  }, [tryAgain]);

  if (error)
  return (
    <Errors
      error={error}
      onPress={() => {
        setError(null)
        setTryAgain(!tryAgain)
      }} />
  )

  if (!(item))
  return <Loading />

  return (
    <>
      <ProductHeader
        navigation={navigation}
        item={item} />
      <View style={device.web ? {height: device.height} : {flex: 1}} >
        <ProdContext.Provider value={{item: item, city: route.params?.city, market: route.params?.market}}>
          <Tab.Navigator tabBarOptions={{activeTintColor: myColors.text3, indicatorStyle: {backgroundColor: myColors.primaryColor}}} >
            <Tab.Screen name='ProductDetails' component={ProductDetails} options={{tabBarLabel: 'Produto'}} />
            <Tab.Screen name='MercadoDetails' component={Mercado} options={{tabBarLabel: 'Mercado'}} />
          </Tab.Navigator>
        </ProdContext.Provider>
        <Divider style={{width: '100%', height: 1, marginTop: 48, backgroundColor: myColors.divider2, position: 'absolute'}} />
        <CartBar navigation={navigation} />
      </View>
    </>
  )
}

export default Product