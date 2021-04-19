import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import * as Location from 'expo-location'
import { myColors, device, globalStyles } from '../../constants';
import { LocationGeocodedLocation } from 'expo-location';
import { addressModel } from './Address';
import { saveActiveAddress, saveReturning } from '../../functions/dataStorage';
import { StatusBar } from 'expo-status-bar';

async function getLocation(setLoading: (b: boolean) => void) {
  setLoading(true)
  let { status } = await Location.requestPermissionsAsync();
  if (status !== 'granted') return false;

  Location.enableNetworkProviderAsync()
  .catch(() => {
    Alert.alert('Serviço de localização está desativado!');
    return false;
  });

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
    const adress: addressModel = {
      apelido: '',
      rua: 'Rua Rio Verde',
      numero: '2166',
      bairro: 'Samuel Grahan',
      cidade: 'Jataí',
      estado: 'GO',
      latitude: coords.latitude,
      longitude: coords.longitude
    };
  
    saveActiveAddress(adress)
    return true
  }
};

function NewUser({ navigation }:
  {navigation: StackNavigationProp<any, any>, route: any}) {
  const [loading, setLoading] = useState<boolean>(false);
  
  return (
    <View style={[styles.conteiner, globalStyles.notch]}>
      <StatusBar backgroundColor={myColors.background} translucent={false} />
      <Text style={{fontSize: 18, color: myColors.text2}} >Bem-Vindo</Text>
      <View style={{alignItems: 'center'}} >
        <Text style={{fontSize: 20, color: myColors.text5}} >Permitir Localização</Text>
        <Text style={{fontSize: 15, color: myColors.text}} >Para achar as oferts mais próximas de você</Text>
      </View>
      <View style={styles.bottom} >
        <Button
          title='Pular'
          type='outline'
          theme={{colors: { primary: myColors.primaryColor}}}
          titleStyle={styles.buttonText} containerStyle={styles.buttonConteiner}
          buttonStyle={styles.button}
          onPress={() => {
            if (loading) return null;
            saveReturning()
            navigation.replace('SelectAddress')
          }} />
        <Button
          loading={loading}
          title='Permitir'
          theme={{colors: { primary: myColors.primaryColor}}}
          titleStyle={styles.buttonText} containerStyle={styles.buttonConteiner}
          buttonStyle={styles.button}
          onPress={() => {
            getLocation(setLoading).then(got => {
              saveReturning()
              if (got) {
                navigation.replace('BottomTabs')
              } else {
                navigation.replace('SelectAddress')
              }
            })
          }} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  conteiner: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    paddingTop: device.iPhoneNotch ? 42 : 8
  },
  bottom: {
    marginBottom: device.iPhoneNotch ? 40 : 8,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%'
  },
  buttonConteiner: {
    width: '45%',
  },
  buttonText: {
    fontSize: 18
  },
  button: {
    paddingVertical: 12
  }
})

export default NewUser