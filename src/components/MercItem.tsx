import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AirbnbRating, Image } from 'react-native-elements';
import { myColors, device, globalStyles } from '../constants';
import { computeDistance, isMarketOpen, Money } from '../functions/converter';
import requests from '../services/requests';
import MyButton from './MyTouchable';

export interface mercModel {
  key: string,
  nome: string,
  endereco: string,
  latitude: number,
  longitude: number,
  open: number,
  close: number,
  openSab: number,
  closeSab: number,
  openDom: number,
  closeDom: number,
  minPrazo: number,
  maxPrazo: number,
  taxa: Money,
  minPedido: Money,
  info: string
}

function MercItem({ item, coords, onPress } :
{ item: mercModel, coords: {lat: number | undefined, lon: number | undefined}, onPress: (item: any) => void }) {
  const distance = coords.lat && coords.lon? computeDistance([coords.lat, coords.lon], [item.latitude, item.longitude]) : undefined;
  const {isOpen, openHour} = isMarketOpen(item);

  return (
    <MyButton
      style={[styles.card, globalStyles.elevation4, globalStyles.darkBoader]}
      onPress={onPress} >
      <>
        <Image
          source={{uri: requests+'images/'+'mercado'/*item.key*/+'.jpeg'}}
          containerStyle={styles.image} />
        <View style={{marginLeft: 10, marginTop:-5, justifyContent: 'center'}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.title}>{item.nome}</Text>
            <AirbnbRating defaultRating={0} isDisabled={true} size={12} showRating={false} starStyle={{margin: 1}} />
          </View>
          <Text style={styles.text1}><Text style={styles.openText}>{isOpen ? 'Aberto' : 'Fechado'}</Text> • {isOpen ? 'Fecha' : 'Abre'} ás {openHour}:00</Text>
          <Text style={styles.text2}>{distance? `Á ${distance}km • ` : ''}{item.minPrazo}-{item.maxPrazo}min • R${item.taxa.toString()}</Text>
        </View>
      </>
    </MyButton>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    height: 90,
    borderRadius: 8,
    marginTop: 16,
  },
  image: {
    height: 90,
    width: 90,
    borderTopLeftRadius:8,
    borderBottomLeftRadius:8,
    margin: device.web? -1 : 0,
  },
  title: {
    fontSize: 16,
    marginRight: 4,
    color: myColors. text6,
  },
  openText: {
    color: myColors. text5,
  },
  text1: {
    marginTop: 4,
    marginBottom: 2,
    color: myColors. text4,
  },
  text2: {
    color: myColors. text3,
  }
})

export default MercItem