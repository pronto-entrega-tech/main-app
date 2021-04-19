import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { Divider } from 'react-native-elements';
import { myColors } from '../../constants';
import PaymentInApp from './PaymentInApp';
import PaymentOnDelivery from './PaymentOnDelivery';

const Tab = createMaterialTopTabNavigator();

function Payment({route}) {
  return (
    <>
      <Tab.Navigator tabBarOptions={{activeTintColor: myColors.text3, indicatorStyle: {backgroundColor: myColors.primaryColor}}} >
        <Tab.Screen name='Pagar pelo app' component={PaymentInApp} />
        <Tab.Screen name='Pagar na entreaga' component={PaymentOnDelivery} initialParams={route.params} />
      </Tab.Navigator>
      <Divider style={{width: '100%', height: 1, marginTop: 48, backgroundColor: myColors.divider, position: 'absolute'}} />
    </>
  )
}

export default Payment