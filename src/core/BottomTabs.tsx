import React from "react";
import { View } from "react-native";
import {
  getFocusedRouteNameFromRoute,
  useRoute,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import { MD2LightTheme } from "react-native-paper";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import myColors from "~/constants/myColors";
import { myScreenOptions } from "~/constants/screenOptions";
import Home from "@pages/inicio";
import Cupons from "@pages/inicio/cupons";
import Favorites from "@pages/inicio/favoritos";
import MarketList from "@pages/inicio/mercados";
import Market from "@pages/inicio/mercado/[city]/[marketId]";
import MarketRating from "@pages/inicio/mercado/[city]/[marketId]/avaliacao";
import MarketDetails from "@pages/inicio/mercado/[city]/[marketId]/detalhes";
import Categories from "@pages/categorias";
import Orders from "@pages/compras";
import OrderDetails from "@pages/compras/[marketId]/[orderId]";
import Profile from "@pages/perfil";
import Config from "@pages/perfil/configuracoes";
import NotifConfig from "@pages/perfil/configuracoes/notificacoes";
import Help from "@pages/perfil/ajuda";
import Questions from "@pages/perfil/perguntas/[question]";
import Notifications from "@pages/perfil/notificacoes";
import CartBar from "~/components/CartBar";
import Chat from "@pages/compras/[marketId]/[orderId]/chat";

const Tab = createMaterialBottomTabNavigator();
const HomeStack = createStackNavigator();
const ShoppingStack = createStackNavigator();
const ProfileStack = createStackNavigator();
type IconNames = keyof typeof Icon.glyphMap;
const createTabBarIcon = (name: IconNames) => {
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
};

const BottomTabs = () => {
  const route = useRoute();
  return (
    <>
      <Tab.Navigator
        theme={{
          ...MD2LightTheme,
          colors: {
            ...MD2LightTheme.colors,
            background: myColors.background,
          },
        }}
        shifting={false}
        barStyle={{ backgroundColor: "white" }}
        activeColor={myColors.primaryColor}
        inactiveColor="rgba(0, 0, 0, 0.5)"
      >
        <Tab.Screen
          name="HomeTab"
          options={{
            tabBarLabel: "Início",
            tabBarIcon: createTabBarIcon("home"),
          }}
        >
          {() => {
            return (
              <HomeStack.Navigator
                detachInactiveScreens
                screenOptions={myScreenOptions}
              >
                <HomeStack.Screen name="Home" component={Home} />
                <HomeStack.Screen name="Explore" component={Home} />
                <HomeStack.Screen name="MarketList" component={MarketList} />
                <HomeStack.Screen name="Cupons" component={Cupons} />
                <HomeStack.Screen name="Favorites" component={Favorites} />
                <HomeStack.Screen name="Market" component={Market} />
                <HomeStack.Screen
                  name="MarketDetails"
                  component={MarketDetails}
                />
                <HomeStack.Screen
                  name="MarketRating"
                  component={MarketRating}
                />
              </HomeStack.Navigator>
            );
          }}
        </Tab.Screen>
        <Tab.Screen
          name="Categories"
          component={Categories}
          options={{
            tabBarLabel: "Categorias",
            tabBarIcon: createTabBarIcon("view-grid"),
          }}
        />
        <Tab.Screen
          name="OrdersTab"
          options={{
            tabBarLabel: "Compras",
            tabBarIcon: createTabBarIcon("shopping"),
          }}
        >
          {() => {
            const routeName = getFocusedRouteNameFromRoute(route);
            return (
              <View style={{ flex: routeName === "OrdersTab" ? 1 : 0 }}>
                <ShoppingStack.Navigator screenOptions={myScreenOptions}>
                  <ShoppingStack.Screen name="Orders" component={Orders} />
                  <ShoppingStack.Screen
                    name="OrderDetails"
                    component={OrderDetails}
                  />
                  <ShoppingStack.Screen name="Chat" component={Chat} />
                </ShoppingStack.Navigator>
              </View>
            );
          }}
        </Tab.Screen>
        <Tab.Screen
          name="ProfileTab"
          options={{
            tabBarLabel: "Perfil",
            tabBarIcon: createTabBarIcon("account"),
          }}
        >
          {() => {
            const routeName = getFocusedRouteNameFromRoute(route);
            return (
              <View style={{ flex: routeName === "ProfileTab" ? 1 : 0 }}>
                <ProfileStack.Navigator screenOptions={myScreenOptions}>
                  <ProfileStack.Screen name="Profile" component={Profile} />
                  <ProfileStack.Screen
                    name="Notifications"
                    component={Notifications}
                  />
                  <ProfileStack.Screen name="Help" component={Help} />
                  <ProfileStack.Screen name="Questions" component={Questions} />
                  <ProfileStack.Screen name="Config" component={Config} />
                  <ProfileStack.Screen
                    name="NotifConfig"
                    component={NotifConfig}
                  />
                </ProfileStack.Navigator>
              </View>
            );
          }}
        </Tab.Screen>
      </Tab.Navigator>
      <CartBar toped />
    </>
  );
};

export default BottomTabs;
