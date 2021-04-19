import React from 'react';
import { View, StyleSheet } from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp, TransitionPreset, TransitionPresets } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from '../Home';
import Categorias from '../Categorias';
import Compras from '../Compras';
import Perfil from '../Perfil';
import Header3 from '../../components/Header3';
import { device, myColors, myTitle } from '../../constants';
import Header2 from '../../components/Header2';
import Header from '../../components/Header';
import MyButton from '../../components/MyButton';
import MyText from '../../components/MyText';
import { converter } from '../../functions';
import useMyContext from '../../functions/MyContext';

const Tab = createMaterialBottomTabNavigator();
const HomeStack = createStackNavigator();
const ComprasStack = createStackNavigator();
const PerfilStack = createStackNavigator();

const TransitionScreenOptions: TransitionPreset = {
  ...TransitionPresets.SlideFromRightIOS,
};

function BottomTabs({ navigation, route }:
{navigation: StackNavigationProp<any, any>}) {
  return (
    <>
    <Tab.Navigator
      shifting={false}
      barStyle={{ backgroundColor: '#FFF' }}
      activeColor={ myColors.primaryColor } >
      <Tab.Screen
        name='HomeTab'
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <Icon name={focused ? 'home' : 'home-outline'} color={color} size={24} />
          )}}>
        {() => {
          return(
          <HomeStack.Navigator detachInactiveScreens
            screenOptions={TransitionScreenOptions}
            headerMode='screen'>
            <HomeStack.Screen
              name='Home'
              component={Home.Home}
              options={{header: Home.HomeHeader, title: myTitle}} />
            <HomeStack.Screen
              name='ListMercados'
              component={Home.ListMercados}
              options={{header: props => <Home.ListMercadosHeader {...props} title={'Mercados'} />, title: myTitle}} />
            <HomeStack.Screen
              name='Cupons'
              component={Home.Cupons}
              options={{header: props => <Home.ListMercadosHeader {...props} title={'Cupons'} />, title: myTitle}} />
            <HomeStack.Screen
              name='Favoritos'
              component={Home.Favoritos}
              options={{header: props => <Home.FavoritosHeader {...props} />, title: myTitle}} />
            <HomeStack.Screen
              name='Mercado'
              component={Home.Mercado}
              options={{header: props => <Header2 {...props} fallback='ListMercados' />, title: myTitle}} />
            <HomeStack.Screen
              name='MercInfo'
              component={Home.MercInfo}
              options={{header: props => <Header {...props} title={'Informações'} />, title: myTitle}} />
            <HomeStack.Screen
              name='MercRating'
              component={Home.MercRating}
              options={{header: props => <Header {...props} title={'Avaliações'} />, title: myTitle}} />
          </HomeStack.Navigator>
        )}}
      </Tab.Screen>
      <Tab.Screen
        name='CategoriasTab'
        component={Categorias.Categorias}
        options={{
          tabBarLabel: 'Categorias',
          title: myTitle,
          tabBarIcon: ({ focused, color }) => (
            <Icon name={focused ? 'view-grid' : 'view-grid-outline'} color={color} size={24} />
          )}}/>
      <Tab.Screen
        name='ComprasTab'
        options={{
          tabBarLabel: 'Compras',
          tabBarIcon: ({ focused, color }) => (
            <Icon name={focused ? 'shopping' : 'shopping-outline'} color={color} size={24} />
          )}}>
        {() => {
          const routeName = getFocusedRouteNameFromRoute(route)
          return(
          <View style={{flex: routeName === 'ComprasTab' ? 1 : 0}} >
            <ComprasStack.Navigator
              screenOptions={TransitionScreenOptions}
              headerMode='screen'>
              <ComprasStack.Screen
                name='Compras'
                component={Compras.Compras}
                options={{header: props => <Header3 title={'Compras'} />, title: myTitle}}/>
              <ComprasStack.Screen
                name='Order'
                component={Compras.Order}
                options={{header: props => <Header {...props} title={'Detalhes do pedido'} />, title: myTitle}}/>
            </ComprasStack.Navigator>
          </View>
        )}}
      </Tab.Screen>
      <Tab.Screen
        name='PerfilTab'
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ focused, color }) => (
            <Icon name={focused ? 'account' : 'account-outline'} color={color} size={24} />
          )}}>
        {() => {
          const routeName = getFocusedRouteNameFromRoute(route)
          return (
          <View style={{flex: routeName === 'PerfilTab' ? 1 : 0}} >
            <PerfilStack.Navigator
              screenOptions={TransitionScreenOptions}
              headerMode='screen'>
              <PerfilStack.Screen
                name='Profile'
                component={Perfil.Profile}
                options={{headerShown: false, title: myTitle}}/>
              <PerfilStack.Screen
                name='Notifications'
                component={Perfil.Notifications}
                options={{header: props => <Header {...props} title={'Notificações'}/>, title: myTitle}}/>
              <PerfilStack.Screen
                name='Help'
                component={Perfil.Help}
                options={{header: props => <Header {...props} title={'Central de ajuda'}/>, title: myTitle}}/>
              <PerfilStack.Screen
                name='Config'
                component={Perfil.Config}
                options={{header: props => <Header {...props} title={'Configurações'}/>, title: myTitle}}/>
              <PerfilStack.Screen
                name='ConfigNotifications'
                component={Perfil.ConfigNotifications}
                options={{header: props => <Header {...props} title={'Gerenciar notificações'}/>, title: myTitle}}/>
              <PerfilStack.Screen
                name='Questions'
                component={Perfil.Questions}
                options={{header: props => <Header {...props} title={'Perguntas frequentes'}/>, title: myTitle}}/>
            </PerfilStack.Navigator>
          </View>
        )}}
      </Tab.Screen>
    </Tab.Navigator>
    <CartBarApp navigation={navigation} />
  </>
  )
}

function CartBarApp({navigation, toped = true}: {navigation: any, toped?: boolean}) {
  const {subtotal} = useMyContext();
  if (subtotal === 0) {
    return null;
  } else {
    return (
      <View style={[styles.cartBar, toped? {marginBottom: device.iOS ? 54+34 : 54} : {height: device.iOS ? 50+24 : 50}]} >
        <MyButton
          style={[styles.cartBar2, {marginBottom: !toped && device.iOS? 24 : 0}]}
          underlayColor={myColors.primaryColorDark}
          onPress={() => navigation.navigate('Cart')} >
          <>
            <Icon style={styles.iconCart} name={'cart'} size={28} color={'#FFF'} />
            <MyText style={styles.textCart}>Ver carrinho</MyText>
            <MyText style={styles.priceCart} >R${converter.toPrice(subtotal)}</MyText>
          </>
        </MyButton>
      </View>
    )
  }
}

export function CartBar({navigation}: {navigation: any}) {
  return (
    <CartBarApp navigation={navigation} toped={false} />
  )
}

const styles = StyleSheet.create({
  cartBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: myColors.primaryColor,
    width: '100%',
    height: 50, 
    position: 'absolute', 
    bottom: 0,
    alignItems: 'center'
  },
  cartBar2: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    height: 50, 
    alignItems: 'center'
  },
  iconCart: {
    position: 'absolute',
    left: 24
  },
  textCart: {
    color: '#FFF',
    fontSize: 14
  },
  priceCart: {
    position: 'absolute',
    right: 18,
    alignContent: 'flex-end',
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Medium',
  }
})

export default BottomTabs