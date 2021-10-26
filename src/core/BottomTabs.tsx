import React from 'react';
import { View } from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { myColors } from '~/constants';
import { myScreenOptions } from '~/constants/others';
import Home from '@pages/inicio';
import Cupons from '@pages/inicio/cupons';
import Favorites from '@pages/inicio/favoritos';
import MarketList from '@pages/inicio/lista-mercados';
import Market from '@pages/inicio/mercado/[city]/[marketId]';
import MarketRating from '@pages/inicio/mercado/[city]/[marketId]/avaliacao';
import MarketDetails from '@pages/inicio/mercado/[city]/[marketId]/detalhes';
import Categories from '@pages/categorias';
import Shopping from '@pages/compras';
import Order from '@pages/compras/pedido';
import Profile from '@pages/perfil';
import ConfigNoti from '@pages/perfil/config-notificoes';
import Config from '@pages/perfil/config';
import Help from '@pages/perfil/ajuda';
import Questions from '@pages/perfil/perguntas/[question]';
import Notifications from '@pages/perfil/notificacoes';
import CartBar from '~/components/CartBar';

const Tab = createMaterialBottomTabNavigator();
const HomeStack = createStackNavigator();
const ShoppingStack = createStackNavigator();
const ProfileStack = createStackNavigator();

type IconNames = keyof typeof Icon.glyphMap;
function TabBarIcon(name: IconNames) {
  const TabBarIcon = ({
    focused,
    color,
  }: {
    focused: boolean;
    color: string;
  }) => (
    <Icon
      name={focused ? name : (`${name}-outline` as IconNames)}
      color={color}
      size={24}
    />
  );
  return TabBarIcon;
}

function BottomTabs({ route }: { route?: any }) {
  return (
    <>
      <Tab.Navigator
        shifting={false}
        barStyle={{ backgroundColor: '#FFF' }}
        activeColor={myColors.primaryColor}>
        <Tab.Screen
          name='HomeTab'
          options={{
            tabBarLabel: 'Início',
            tabBarIcon: TabBarIcon('home'),
          }}>
          {() => {
            return (
              <HomeStack.Navigator
                detachInactiveScreens
                screenOptions={myScreenOptions}>
                <HomeStack.Screen name='Home' component={Home} />
                <HomeStack.Screen name='Explore' component={Home} />
                <HomeStack.Screen name='MarketList' component={MarketList} />
                <HomeStack.Screen name='Cupons' component={Cupons} />
                <HomeStack.Screen name='Favorites' component={Favorites} />
                <HomeStack.Screen name='Market' component={Market} />
                <HomeStack.Screen
                  name='MarketDetails'
                  component={MarketDetails}
                />
                <HomeStack.Screen
                  name='MarketRating'
                  component={MarketRating}
                />
              </HomeStack.Navigator>
            );
          }}
        </Tab.Screen>
        <Tab.Screen
          name='Categories'
          component={Categories}
          options={{
            tabBarLabel: 'Categorias',
            tabBarIcon: TabBarIcon('view-grid'),
          }}
        />
        <Tab.Screen
          name='ShoppingTab'
          options={{
            tabBarLabel: 'Compras',
            tabBarIcon: TabBarIcon('shopping'),
          }}>
          {() => {
            const routeName = getFocusedRouteNameFromRoute(route);
            return (
              <View style={{ flex: routeName === 'ShoppingTab' ? 1 : 0 }}>
                <ShoppingStack.Navigator screenOptions={myScreenOptions}>
                  <ShoppingStack.Screen name='Shopping' component={Shopping} />
                  <ShoppingStack.Screen name='Order' component={Order} />
                </ShoppingStack.Navigator>
              </View>
            );
          }}
        </Tab.Screen>
        <Tab.Screen
          name='ProfileTab'
          options={{
            tabBarLabel: 'Perfil',
            tabBarIcon: TabBarIcon('account'),
          }}>
          {() => {
            const routeName = getFocusedRouteNameFromRoute(route);
            return (
              <View style={{ flex: routeName === 'ProfileTab' ? 1 : 0 }}>
                <ProfileStack.Navigator screenOptions={myScreenOptions}>
                  <ProfileStack.Screen name='Profile' component={Profile} />
                  <ProfileStack.Screen
                    name='Notifications'
                    component={Notifications}
                  />
                  <ProfileStack.Screen name='Help' component={Help} />
                  <ProfileStack.Screen name='Config' component={Config} />
                  <ProfileStack.Screen
                    name='ConfigNoti'
                    component={ConfigNoti}
                  />
                  <ProfileStack.Screen name='Questions' component={Questions} />
                </ProfileStack.Navigator>
              </View>
            );
          }}
        </Tab.Screen>
      </Tab.Navigator>
      <CartBar toped />
    </>
  );
}

export default BottomTabs;
