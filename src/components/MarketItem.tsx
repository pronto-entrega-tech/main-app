import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'react-native-elements';
import { businessHours, dateHours } from '~/core/models';
import { myColors, device, globalStyles } from '~/constants';
import {
  computeDistance,
  getImageUrl,
  isMarketOpen,
  Money,
} from '~/functions/converter';
import MyText from './MyText';
import MyTouchable from './MyTouchable';
import Rating from './Rating';

export interface marketModel {
  market_id: string;
  market_name_id: string;
  name: string;
  city: string;
  type: string;
  address: {
    street: string;
    number: string;
    district: string;
    city: string;
    state: string;
    complement?: string;
    coords: string;
  };
  business_hours: businessHours;
  special_hours: dateHours;
  min_time: number;
  max_time: number;
  fee: Money;
  order_min: Money;
  rating?: number;
  reviews_count_lately?: number;
  reviews_count_total?: number;
  info: string;
  document: string;
  payments_accepted: string[];
}

function MercItem({
  item,
  coords,
  onPress,
}: {
  item: marketModel;
  coords: { lat: number | undefined; lon: number | undefined };
  onPress: (item: any) => void;
}) {
  const distance =
    coords.lat && coords.lon
      ? computeDistance(
          [coords.lat, coords.lon],
          item.address.coords.split(',')
        )
      : undefined;
  const { isOpen, nextHour, tomorrow } = isMarketOpen(item.business_hours);

  return (
    <MyTouchable
      style={[styles.card, globalStyles.elevation4, globalStyles.darkBoader]}
      onPress={onPress}>
      <Image
        source={{
          uri: getImageUrl('market', item.market_id),
        }}
        containerStyle={styles.image}
      />
      <View style={{ marginLeft: 10, marginTop: -5, justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row' }}>
          <MyText style={styles.title}>{item.name}</MyText>
          {item.rating ? (
            <Rating value={item.rating} style={{ alignSelf: 'center' }} />
          ) : (
            <MyText style={styles.new}>Novo!</MyText>
          )}
        </View>
        <MyText style={styles.text1}>
          <MyText style={styles.openText}>
            {isOpen ? 'Aberto' : 'Fechado'}
          </MyText>
          {nextHour
            ? ` • ${isOpen ? 'Fecha' : 'Abre'} às ${nextHour}${
                tomorrow ? ' de amanhã' : ''
              }`
            : ''}
        </MyText>
        <MyText style={styles.text2}>
          {distance ? `Á ${distance}km • ` : ''}
          {item.min_time}-{item.max_time}min • R${item.fee.toString()}
        </MyText>
      </View>
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
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    margin: device.web ? -1 : 0,
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
  },
});

export default MercItem;
