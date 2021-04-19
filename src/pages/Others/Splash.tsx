import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-elements';
import { myColors, device, globalStyles, images } from '../../constants';
import { saveActiveAddress, saveActiveAddressIndex } from '../../functions/dataStorage';
import { addressModel } from './Address';
import { useLinkTo } from '@react-navigation/native';

async function saveCity(city: {city: string, estate: string}) {
  const adress: addressModel = {
    apelido: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: city.city,
    estado: city.estate,
  };
  saveActiveAddressIndex(-1)
  saveActiveAddress(adress)
}

function Splash() {
  const linkTo = useLinkTo();
  const cites: {city: string, estate: string}[] = [
    {city: 'Jataí', estate: 'Goiás'},
  ]
  
  return (
    <View style={{backgroundColor: myColors.background, paddingTop: device.iPhoneNotch? 34 : 0}}>
      <View style={{backgroundColor: '#f8f8f8'}}>
        <Button
          type='clear'
          buttonStyle={styles.loginButton}
          title='Entrar'
          onPress={() => alert('Ainda não')} />
        <Image source={images.pineapple} style={styles.pineapple} />
        <Image source={images.tomato} style={styles.tomato} />
        <Image source={images.broccoli} style={styles.broccoli} />
        <Image source={images.logo} style={styles.logo} />
        <Text style={styles.title}>{'Faça suas compras\nsem sair de casa'}</Text>
        <Text style={styles.subtitle}>{'Veja mercados perto de você'}</Text>
        <Button
          buttonStyle={[styles.button, globalStyles.elevation4]}
          icon={<Icon name='map-marker' size={24} color={myColors.background} style={{marginRight: 3}}/>}
          title='Insira seu endereço'
          onPress={() => linkTo('/selecione-endereco')} />
      </View>
      <Text style={styles.text}>Escolha uma cidade</Text>
      {
        cites.map((item, index) => (
          <Button
            key={index}
            buttonStyle={styles.cityButton}
            type='clear'
            title={item.city}
            onPress={() => {
            saveCity(item).then(() => linkTo('/home'))
          }} />
        ))
      }
    </View>
  )
}

const styles = StyleSheet.create({
  loginButton: {
    alignSelf: 'flex-end',
    marginRight: 4,
    marginTop: 4,
  },
  pineapple: {
    position: 'absolute',
    marginLeft: 10,
    top: -40,
    width: 170,
    height: 125,
  },
  tomato: {
    alignSelf: 'flex-end',
    position: 'absolute',
    marginTop: 50,
    width: 50,
    height: 100,
  },
  broccoli: {
    position: 'absolute',
    left: -65,
    marginTop: 180,
    width: 110,
    height: 110,
  },
  logo: {
    alignSelf: 'center',
    marginTop: 38,
    width: 200,
    height: 120,
  },
  title: {
    marginTop: 28,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '500',
    color: myColors.text4_5,
    marginHorizontal: 36,
    lineHeight: 34,
  },
  subtitle: {
    marginTop: 14,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '400',
    color: myColors.text4,
    marginHorizontal: 32,
  },
  button: {
    backgroundColor: myColors.primaryColor,
    marginTop: 30,
    marginHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 18,
  },
  text: {
    marginTop: 16,
    fontSize: 18,
    marginLeft: 18,
    fontWeight: '500',
    color: myColors.text4
  },
  cityButton: {
    paddingLeft: 18,
    justifyContent: 'flex-start',
  },
})

export default Splash