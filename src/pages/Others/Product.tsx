import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Share } from 'react-native';
import { Divider } from 'react-native-elements';
import { CartBar } from './BottomTabs';
import IconButton from '../../components/IconButton';
import { myColors, device } from '../../constants'; 
import Mercado from '../Home/Mercado';
import ProductDetails from './ProductDetails';
import { prodModel } from '../../components/ProdItem';
import useMyContext from '../../functions/MyContext';
import requests from '../../services/requests';
import Loading from '../../components/Loading';
import { ProdContext } from './ProdContext';

export function ProductHeader({ navigation, item }:
{navigation: StackNavigationProp<any, any>, item: prodModel}) {
  const {favorites, onPressFav} = useMyContext();
  return(
    <View style={{backgroundColor: myColors.background, 
      marginTop: device.iPhoneNotch ? 34 : 0, flexDirection: 'row', justifyContent: 'flex-end', height: 46}} >
      <View style ={{position: 'absolute', left: 0}}>
        <IconButton
          icon='arrow-left'
          size={24}
          color={myColors.primaryColor}
          type='back'
          onPress={() => {
            if (navigation.canGoBack()) return navigation.goBack()
            navigation.navigate('BottomTabs', {screen: 'Home'})
            }} />
      </View>
      <IconButton
        icon='bell'
        size={24}
        color={myColors.primaryColor}
        type='back'
        onPress={() => navigation.navigate('Notifications')} />
      <IconButton
        icon={favorites.has(item?.prodKey)? 'heart' : 'heart-outline'}
        size={24}
        color={myColors.primaryColor}
        type='prodIcons'
        onPress={() => onPressFav(item)} />
      <IconButton
        icon='share-variant'
        size={24}
        color={myColors.primaryColor}
        type='prodIcons'
        onPress={() => {
          Share.share({message: requests+'produto/'+item.prodKey})
        }} />
    </View>
  )
}

const Tab = createMaterialTopTabNavigator(); 

function Product({ navigation, route }:
{navigation: StackNavigationProp<any, any>, route: any}) {
  const [item, setItem] = React.useState<prodModel>(route.params?.item);

  React.useEffect(() => {
    if (item) return;
    fetch(requests+'prodList.php')
      .then((response) => response.json())
      .then((json) => setItem(json[route.params?.prod-1]))
      .catch((error) => console.error(error))
  }, []);

  if (!item) return <Loading />

  return (
    <View style={device.web ? {height: device.height-56} : {flex: 1}} >
      <ProductHeader
        navigation={navigation}
        item={item} />
      <ProdContext.Provider value={{item: item, merc: item.mercKey}}>
        <Tab.Navigator tabBarOptions={{activeTintColor: myColors.text3, indicatorStyle: {backgroundColor: myColors.primaryColor}}} >
          <Tab.Screen name='Produto' component={ProductDetails} />
          <Tab.Screen name='Mercado' component={Mercado} />
        </Tab.Navigator>
      </ProdContext.Provider>
      <Divider style={{width: '100%', height: 1, marginTop: device.iPhoneNotch? 128 : 94, backgroundColor: myColors.divider, position: 'absolute'}} />
      <CartBar navigation={navigation} />
    </View>
  )
}

export default Product