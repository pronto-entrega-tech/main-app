import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import { myColors, device, images } from '../../constants';
import { getActiveAddressIndex, isReturning, saveActiveAddress } from '../../functions/dataStorage';
import * as Location from 'expo-location'
import { LocationGeocodedLocation } from 'expo-location';
import { addressModel } from './Address';
import { useFonts } from 'expo-font';
import myFonts from '../../assets/fonts'

async function getLocation() {
  let { status } = await Location.getPermissionsAsync();
  if (status !== 'granted') return false;

  let enabled = await Location.hasServicesEnabledAsync();
  if (!enabled) return false;

  let { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.LocationAccuracy.Highest });

  if (!device.web) {
    const loc: LocationGeocodedLocation = {
      latitude: coords.latitude, 
      longitude: coords.longitude
    }
    let address = (await Location.reverseGeocodeAsync(loc))[0];
    const adress: addressModel = {
      apelido: '',
      rua: (device.iOS ? address.name : address.street)?.replace('Avenida', 'Av.')+'',
      numero: (device.iOS ? '' : address.name)+'',
      bairro: address.district != null ? address.district : '',
      cidade: (device.iOS ? address.city : address.subregion)+'',
      estado: address.region+'',
      latitude: coords.latitude,
      longitude: coords.longitude
    };
    
    saveActiveAddress(adress)
    return true
  } else {
    return true
  }
};

function Splash({ navigation }:
{navigation: StackNavigationProp<any, any>, route: any}) {
  let [fontsLoaded] = useFonts(myFonts);

  useEffect(() => {
    if (!fontsLoaded) return
    isReturning().then(returning => {
      if (!returning) return navigation.replace('NewUser')
      getActiveAddressIndex().then(index => {
        if (index != -1) return navigation.replace('BottomTabs')
        getLocation().then(enable => {
          if (enable)
          return navigation.replace('BottomTabs')
          navigation.replace('SelectAddress')
        })
      })
    })
  },[fontsLoaded])

  return (
    <View style={{
      justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: myColors.primaryColor}}>
      <Image fadeDuration={0} source={images.splash} style={{
        width: Math.round((device.height * 1284) / 2778), height: device.height}} />
    </View>
  )
}

export default Splash