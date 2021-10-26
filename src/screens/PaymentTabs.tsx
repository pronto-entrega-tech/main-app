import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { KeyboardAvoidingView, StatusBar, View } from 'react-native';
import Header from '~/components/Header';
import MyDivider from '~/components/MyDivider';
import { device, myColors, myTitle } from '~/constants';
import PaymentInApp from '@pages/pagamento';
import PaymentOnDelivery from '@pages/pagamento-entrega';
import Portal from '~/core/Portal';
import { RouteProp } from '@react-navigation/core';

const Tab = createMaterialTopTabNavigator();

function PaymentTabs({ route }: { route: RouteProp<any> }) {
  const paymentTabs = (
    <Portal.Host>
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
      <Header title='Pagamento' divider={false} notchless />
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={{
            title: myTitle,
            tabBarActiveTintColor: myColors.text3,
            tabBarIndicatorStyle: { backgroundColor: myColors.primaryColor },
          }}>
          <Tab.Screen
            name='PaymentInApp'
            component={PaymentInApp}
            options={{ tabBarLabel: 'Pagar pelo app' }}
          />
          <Tab.Screen
            name='PaymentOnDelivery'
            component={PaymentOnDelivery}
            options={{ tabBarLabel: 'Pagar na entreaga' }}
            initialParams={route.params?.params}
          />
        </Tab.Navigator>
        {/* <MyDivider
          style={{
            position: 'absolute',
            width: '100%',
            bottom: 0,
          }}
        /> */}
      </View>
    </Portal.Host>
  );

  if (device.iOS)
    return (
      <KeyboardAvoidingView behavior='height' style={{ flex: 1 }}>
        {paymentTabs}
      </KeyboardAvoidingView>
    );

  return paymentTabs;
}

export default PaymentTabs;
