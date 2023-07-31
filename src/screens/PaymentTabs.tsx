import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import MyHeader from '~/components/MyHeader';
import { device, myColors, myTitle } from '~/constants';
import { PaymentOnApp } from '@pages/pagamento';
import Portal from '~/core/Portal';
import { RouteProp } from '@react-navigation/core';
import PaymentOnDelivery from './PaymentOnDelivery';
import { appOrSite, notchHeight } from '~/constants/device';

const Tab = createMaterialTopTabNavigator();

const PaymentTabs = ({ route }: { route: RouteProp<any> }) => {
  const paymentTabs = (
    <Portal.Host>
      <View
        style={{
          height: notchHeight,
          backgroundColor: myColors.background,
        }}
      />
      <MyHeader title='Pagamento' dividerLess notchLess />
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={{
            title: myTitle,
            tabBarActiveTintColor: myColors.text3,
            tabBarIndicatorStyle: { backgroundColor: myColors.primaryColor },
          }}>
          <Tab.Screen
            name='PaymentInApp'
            options={{ tabBarLabel: `Pagar pelo ${appOrSite}` }}
            component={PaymentOnApp}
            initialParams={route.params?.params}
          />
          <Tab.Screen
            name='PaymentOnDelivery'
            options={{ tabBarLabel: 'Pagar na entrega' }}
            component={PaymentOnDelivery}
            initialParams={route.params?.params}
          />
        </Tab.Navigator>
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
};

export default PaymentTabs;
