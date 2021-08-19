import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'react-native-elements';
import { myColors, device, globalStyles } from '../constants';
import { computeDistance, isMarketOpen, Money } from '../functions/converter';
import requests from '../services/requests';
import MyText from './MyText';
import MyTouchable from './MyTouchable';
import Rating from './Rating';

export interface mercModel {
  id: string,
  name: string,
  rating: number,
  address: string,
  latitude: number,
  longitude: number,
  open: number,
  close: number,
  open_sat: number,
  close_sat: number,
  open_sun: number,
  close_sun: number,
  time_min: number,
  time_max: number,
  fee: Money,
  order_min: Money,
  info: string
}

function MercItem({ item, coords, onPress } :
{ item: mercModel, coords: {lat: number | undefined, lon: number | undefined}, onPress: (item: any) => void }) {
  const distance = coords.lat && coords.lon? computeDistance([coords.lat, coords.lon], [item.latitude, item.longitude]) : undefined;
  const {isOpen, openHour} = isMarketOpen(item);

  return (
    <MyTouchable
      style={[styles.card, globalStyles.elevation4, globalStyles.darkBoader]}
      onPress={onPress} >
      <>
        <Image
          source={{uri: requests+'images/'+'mercado'/*item.id*/+'_full.webp'}}
          containerStyle={styles.image} />
        <View style={{marginLeft: 10, marginTop:-5, justifyContent: 'center'}}>
          <View style={{flexDirection: 'row'}}>
            <MyText style={styles.title}>{item.name}</MyText>
            {item.rating?
            <Rating value={item.rating} style={{alignSelf: 'center'}} /> :
            <MyText style={styles.new}>Novo!</MyText>
            }
          </View>
          <MyText style={styles.text1}><MyText style={styles.openText}>{isOpen ? 'Aberto' : 'Fechado'}</MyText> • {isOpen ? 'Fecha' : 'Abre'} ás {openHour}:00</MyText>
          <MyText style={styles.text2}>{distance? `Á ${distance}km • ` : ''}{item.time_min}-{item.time_max}min • R${item.fee.toString()}</MyText>
        </View>
      </>
    </MyTouchable>
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
    color: myColors.text6,
  },
  new: {
    alignSelf: 'flex-end',
    fontSize: 13,
    marginBottom: 1,
    marginLeft: 4,
    color: myColors.rating,
    fontFamily: 'Medium',
  },
  openText: {
    color: myColors.text5,
  },
  text1: {
    marginTop: 4,
    marginBottom: 2,
    color: myColors.text4,
  },
  text2: {
    color: myColors.text3,
  }
})

export default MercItem