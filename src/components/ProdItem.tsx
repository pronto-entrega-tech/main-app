import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { myColors, device, globalStyles } from '../constants';
import IconButton from './IconButton';
import MyTouchable from './MyTouchable';
import { StackNavigationProp } from '@react-navigation/stack';
import { getImageUrl, Money } from '../functions/converter';
import MyText from './MyText';

export interface prodModel {
  prod_id: string;
  market_id: string;
  prod_name_id: string;
  market_name_id: string;
  name: string;
  brand: string;
  quantity: string;
  price: Money;
  previous_price?: Money;
  unit_weight?: number;
  discount?: {
    type: 'OFF' | 'ONE_FREE';
    value_1: number;
    value_2?: number;
    max_per_client: number;
  };
  images_names: string[];
}

function ProdItem({
  navigation,
  item,
  isFavorite,
  quantity = 0,
  style = {},
  merc,
  city,
  onPressFav,
  onPressAdd,
  onPressRemove,
}: {
  navigation: StackNavigationProp<any, any>;
  item: prodModel;
  isFavorite: boolean;
  quantity?: number;
  style?: StyleProp<ViewStyle>;
  merc: boolean;
  city: string;
  onPressFav: (item: any) => void;
  onPressAdd: (item: any) => void;
  onPressRemove: (item: any) => void;
}) {
  const off = item.previous_price
    ? ((1 - item.price.value / item.previous_price.value) * 100).toFixed(0)
    : undefined;

  return (
    <MyTouchable
      style={[
        styles.card,
        globalStyles.elevation4,
        globalStyles.darkBoader,
        style,
      ]}
      onPress={() =>
        navigation.push(
          'Product',
          device.web
            ? { city, marketId: item.market_id, prodId: item.prod_id }
            : { city, marketId: item.market_id, item: item }
        )
      }>
      <View style={styles.top}>
        {item.images_names ? (
          <Image
            placeholderStyle={{ backgroundColor: '#FFF' }}
            PlaceholderContent={
              <Icon name='cart-outline' color={myColors.grey2} size={70} />
            }
            source={{
              uri: getImageUrl('product', item.images_names[0]),
            }}
            containerStyle={styles.image}
          />
        ) : (
          <Icon
            name='cart-outline'
            color={myColors.grey2}
            size={70}
            style={styles.image}
          />
        )}
        {!merc ? (
          <Image
            placeholderStyle={{ backgroundColor: '#FFF' }}
            source={{
              uri: getImageUrl('market', item.market_id),
            }}
            containerStyle={styles.fav}
          />
        ) : null}
        {/* <IconButton
          style={styles.fav}
          icon={isFavorite ? 'heart' : 'heart-outline'}
          size={24}
          color={isFavorite ? myColors.primaryColor : myColors.grey2}
          type='clear'
          onPress={onPressFav}
        /> */}
        <View
          style={[
            globalStyles.elevation4,
            globalStyles.darkBoader,
            styles.addBar,
            {
              height: 32,
              width: quantity === 0 ? 32 : 32 * 2 + 16,
            },
          ]}>
          <IconButton
            style={{ left: device.web ? 1 : 0 }}
            icon={'plus'}
            size={24}
            color={myColors.primaryColor}
            type='add2'
            onPress={onPressAdd}
          />
          {quantity !== 0 ? (
            <>
              <MyText style={styles.centerNumText}>
                {quantity.toString()}
              </MyText>
              <IconButton
                style={styles.remove}
                icon='minus'
                size={24}
                color={myColors.primaryColor}
                type='add2'
                onPress={onPressRemove}
              />
            </>
          ) : null}
        </View>
      </View>
      <View style={styles.container}>
        <MyText style={styles.priceText}>R${item.price.toString()}</MyText>
        {item.previous_price ? (
          <View style={styles.oldPriceRow}>
            <View style={styles.offTextBox}>
              <MyText style={styles.offText}>-{off}%</MyText>
            </View>
            <MyText style={styles.oldPriceText}>
              R${item.previous_price.toString()}
            </MyText>
          </View>
        ) : null}
        <MyText ellipsizeMode='tail' numberOfLines={2} style={styles.nameText}>
          {item.name} {item.brand}
        </MyText>
        <MyText style={styles.quantityText}>{item.quantity}</MyText>
      </View>
      {/* <Divider
        style={{
          backgroundColor: myColors.divider2,
          height: 1,
          marginBottom: 0,
        }}
      />
      <View style={styles.containerAdd}>
        <IconButton
          icon='minus'
          size={24}
          color={myColors.primaryColor}
          type='add'
          onPress={onPressRemove}
        />
        <MyText style={styles.centerNumText}>{quantity.toString()}</MyText>
        <IconButton
          icon='plus'
          size={24}
          color={myColors.primaryColor}
          type='add'
          onPress={onPressAdd}
        />
      </View> */}
    </MyTouchable>
  );
}

const margin = 5;
const tileWidth = (device.width - margin * 4) / 3;
const styles = StyleSheet.create({
  card: {
    height: 185,
    width: tileWidth,
    marginLeft: margin,
    marginBottom: margin,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  top: {
    alignItems: 'center',
  },
  placeholderColor: {
    backgroundColor: 'transparent',
  },
  fav: {
    top: 8,
    left: 6,
    position: 'absolute',
    alignSelf: 'flex-end',
    height: 28,
    width: 28,
    borderRadius: 40,
  },
  addBar: {
    backgroundColor: '#fff',
    borderRadius: 30,
    position: 'absolute',
    top: 6,
    right: 6,
    alignItems: 'center',
    flexDirection: 'row-reverse',
  },
  centerNumText: {
    fontSize: 15,
    color: myColors.text3,
    fontFamily: 'Medium',
    left: 36,
    position: 'absolute',
  },
  remove: { position: 'absolute', left: 0 },
  mercImage: {
    position: 'absolute',
    right: 0,
    top: 80,
    marginRight: 6,
    height: 26,
    width: 26,
    borderRadius: 40,
  },
  image: {
    marginTop: 10,
    marginBottom: 8,
    height: 70,
    width: 70,
  },
  container: {
    marginTop: 20,
    marginHorizontal: 8,
  },
  oldPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offTextBox: {
    paddingVertical: 2,
    paddingHorizontal: 3,
    backgroundColor: myColors.primaryColor,
    borderRadius: 6,
  },
  offText: {
    fontSize: 11,
    color: '#FFF',
    fontWeight: 'bold',
  },
  oldPriceText: {
    textDecorationLine: 'line-through',
    color: myColors.grey2,
    fontSize: 13,
    marginLeft: 4,
  },
  priceText: {
    color: myColors.text3,
    marginTop: -22,
    marginBottom: 1,
    fontSize: 18,
    fontFamily: 'Medium',
  },
  nameText: {
    color: myColors.grey3,
    marginTop: 2,
    fontFamily: 'Condensed',
  },
  quantityText: {
    marginLeft: 0,
    color: myColors.grey2,
  },
});

export default ProdItem;
