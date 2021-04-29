import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import { myColors, device, images } from '../../constants';
import { getActiveAddressIndex, getUserStatus, saveActiveAddress } from '../../functions/dataStorage';
import * as Location from 'expo-location'
import { getAddress } from './Address';

async function getLocation() {
  let { status } = await Location.getForegroundPermissionsAsync();
  if (status !== 'granted') return false;

  let enabled = await Location.hasServicesEnabledAsync();
  if (!enabled) return false;

  const address = await getAddress();

  if (address === false) return false;
  
  saveActiveAddress(address)
  return true
};

function Splash({ navigation }:
{navigation: StackNavigationProp<any, any>, route: any}) {
  
  useEffect(() => {
    getUserStatus().then(status => {
      if (!status)
      return navigation.replace('NewUser')

      if (status == 'returning')
      return navigation.replace('SignIn')
      
      getActiveAddressIndex().then(index => {
        if (index != -1) return navigation.replace('BottomTabs')
        getLocation().then(got => {
          if (got)
          return navigation.replace('BottomTabs')

          navigation.replace('SelectAddress')
        })
      })
    })
  },[])

  return (
    <View style={{
      justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: myColors.primaryColor}}>
      <Image fadeDuration={0} source={images.splash} style={{
        width: Math.round((device.height * 1284) / 2778), height: device.height}} />
    </View>
  )
}

export { getLocation }
export default Splash