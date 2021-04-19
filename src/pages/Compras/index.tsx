import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import Header from '../../components/Header';
import Header3 from '../../components/Header3';

const TransitionScreenOptions = {
  ...TransitionPresets.SlideFromRightIOS,
};
const Stack = createStackNavigator();

function ComprasPage() {
  return (
    <Stack.Navigator
    screenOptions={TransitionScreenOptions}
    headerMode='screen'
    detachInactiveScreens={true} >
      <Stack.Screen
        name='Compras'
        component={Compras}
        options={{header: props => <Header3 title={'Compras'} />}}/>
      <Stack.Screen
        name='Order'
        component={Order}
        options={{header: props => <Header {...props} title={'Detalhes do pedido'} />}}/>
    </Stack.Navigator>
  )
};

import Compras from './Compras';
import Order from './Order';

export default { 
  Compras,
  Order,
};