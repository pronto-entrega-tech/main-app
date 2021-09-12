import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { myColors, device, globalStyles } from '../constants';
import IconButton from './IconButton';
import MyButton from './MyTouchable';
import { StackNavigationProp } from '@react-navigation/stack';
import { prodModel } from './ProdItem';
import { getImageUrl, moneyToString } from '../functions/converter';

function ProdItemHorizontal({
  navigation,
  item,
  isFavorite,
  quantity = 0,
  onPressFav,
  onPressAdd,
  onPressRemove,
  merc,
  city,
}: {
  navigation: StackNavigationProp<any, any>;
  item: prodModel;
  isFavorite: boolean;
  quantity?: number;
  onPressFav: (item: any) => void;
  onPressAdd: (item: any) => void;
  onPressRemove: (item: any) => void;
  merc: boolean;
  city: string;
}) {
  const off = item.previous_price
    ? ((1 - item.price.value / item.previous_price.value) * 100).toFixed(0)
    : undefined;

  return (
    <MyButton
      style={[styles.card, globalStyles.elevation4, globalStyles.darkBoader]}
      onPress={() =>
        navigation.push(
          'Product',
          device.web
            ? { city: city, market: item.market_id, prod: item.prod_id }
            : { item: item }
        )
      }>
      <View style={styles.container}>
        <View style={styles.containerAdd}>
          <IconButton
            icon='plus'
            size={24}
            color={myColors.primaryColor}
            type='addHorizontal'
            onPress={onPressAdd}
          />
          <Text style={styles.centerNumText}>
            {typeof quantity !== 'undefined' ? quantity : 0}
          </Text>
          <IconButton
            icon='minus'
            size={24}
            color={myColors.primaryColor}
            type='addHorizontal'
            onPress={onPressRemove}
          />
        </View>
        <View style={styles.containerImage}>
          {item.images_names ? (
            <Image
              placeholderStyle={{ backgroundColor: '#FFF' }}
              PlaceholderContent={
                <Icon name='cart-outline' color={myColors.grey2} size={80} />
              }
              source={{ uri: getImageUrl('product', item.images_names[0]) }}
              containerStyle={styles.image}
            />
          ) : (
            <Icon
              name='cart-outline'
              color={myColors.grey2}
              size={80}
              style={styles.image}
            />
          )}
          <IconButton
            style={styles.fav}
            icon={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? myColors.primaryColor : myColors.grey2}
            type='clear'
            onPress={onPressFav}
          />
        </View>
        <View style={styles.containerText}>
          <Text ellipsizeMode='tail' numberOfLines={1} style={styles.prodText}>
            {item.name} {item.brand}
          </Text>
          {off ? (
            <View style={styles.oldPriceRow}>
              <View style={styles.offTextBox}>
                <Text style={styles.offText}>-{off}%</Text>
              </View>
              <Text style={styles.oldPriceText}>
                {item.previous_price
                  ? 'R$' + moneyToString(item.previous_price)
                  : null}
              </Text>
            </View>
          ) : null}
          <Text style={styles.priceText}>R${moneyToString(item.price)}</Text>
          <Text style={styles.quantityText}>{item.quantity}</Text>
        </View>
        <View style={styles.mercContainer}>
          {!merc ? (
            <Image
              placeholderStyle={{ backgroundColor: '#FFF' }}
              source={{
                uri: getImageUrl('market', item.market_id),
              }}
              containerStyle={styles.mercImage}
            />
          ) : null}
        </View>
      </View>
    </MyButton>
  );
}

const textLinePad = device.android ? -2 : 1;
const styles = StyleSheet.create({
  card: {
    height: 104,
    marginHorizontal: 8,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  container: {
    flexDirection: 'row',
  },
  containerAdd: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
    paddingLeft: 3,
    paddingRight: 9,
    zIndex: 2,
  },
  centerNumText: {
    fontSize: 17,
    color: myColors.text3,
    fontFamily: 'Medium',
  },
  containerImage: {
    marginLeft: -6,
    alignItems: 'center',
  },
  image: {
    marginVertical: 12,
    marginHorizontal: 2,
    height: 80,
    width: 80,
  },
  fav: {
    position: 'absolute',
    alignSelf: 'flex-end',
    top: -3,
    right: -10,
  },
  containerText: {
    marginHorizontal: 8,
  },
  prodText: {
    height: 17.5,
    color: myColors.grey3,
    marginTop: 12,
    width: device.width - 160,
    fontFamily: 'Condensed',
  },
  oldPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 30,
  },
  offTextBox: {
    paddingVertical: 1,
    paddingHorizontal: 3,
    backgroundColor: myColors.primaryColor,
    borderRadius: 6,
  },
  offText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  oldPriceText: {
    textDecorationLine: 'line-through',
    color: myColors.grey2,
    fontSize: 13,
    fontFamily: 'Regular',
    marginLeft: 4,
  },
  priceText: {
    color: myColors.text3,
    marginTop: 18 + textLinePad,
    fontSize: 20,
    fontFamily: 'Medium',
  },
  quantityText: {
    marginTop: textLinePad,
    color: myColors.grey2,
    fontFamily: 'Regular',
  },
  mercContainer: {
    position: 'absolute',
    right: 12,
    top: 48,
  },
  mercImage: {
    marginRight: 0,
    height: 34,
    width: 34,
    borderRadius: 34,
  },
});

export default ProdItemHorizontal;
