import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { KeyboardAvoidingView, StatusBar, View } from 'react-native';
import { Divider } from 'react-native-elements';
import { Portal } from 'react-native-paper';
import Header from '../../components/Header';
import { device, myColors } from '../../constants';
import PaymentInApp from './PaymentInApp';
import PaymentOnDelivery from './PaymentOnDelivery';

const Tab = createMaterialTopTabNavigator();

function Payment({navigation, route}: {navigation: any, route: any}) {

  const payment = (
    <Portal.Host>
      <View style={{height: device.android? StatusBar.currentHeight : device.iPhoneNotch ? 34 : 0, backgroundColor: myColors.background}} />
        <Header navigation={navigation} title='Pagamento' divider={false} notchless />
        <View style={device.web ? {height: device.height-56} : {flex: 1}} >
          <Tab.Navigator tabBarOptions={{activeTintColor: myColors.text3, indicatorStyle: {backgroundColor: myColors.primaryColor}}} >
            <Tab.Screen
              name='PaymentInApp'
              component={PaymentInApp}
              options={{tabBarLabel: 'Pagar pelo app'}} />
            <Tab.Screen
              name='PaymentOnDelivery'
              component={PaymentOnDelivery}
              options={{tabBarLabel: 'Pagar na entreaga'}}
              initialParams={route.params} />
          </Tab.Navigator>
          <Divider style={{width: '100%', height: 1, marginTop: 48, backgroundColor: myColors.divider, position: 'absolute'}} />
        </View>
    </Portal.Host>
  )

  if (device.iOS)
  return (
    <KeyboardAvoidingView behavior='height' style={{flex: 1}} enabled={device.iOS} >
      {payment}
    </KeyboardAvoidingView>
  )

  return payment
}

export default Payment