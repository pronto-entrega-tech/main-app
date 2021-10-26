import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'react-native-elements/dist/image/Image';
import { StackNavigationProp } from '@react-navigation/stack';
import { myColors, device, globalStyles } from '~/constants';
import { calcOff, getImageUrl, moneyToString } from '~/functions/converter';
import IconButton from './IconButton';
import { Product } from './ProdItem';
import MyIcon from './MyIcon';
import useRouting from '~/hooks/useRouting';
import MyTouchable from './MyTouchable';
import AnimatedText from './AnimatedText';

function ProdItemHorizontal(props: {
  navigation?: StackNavigationProp<any, any>;
  item: Product;
  city: string;
  showsMarketLogo: boolean;
  isFavorite?: boolean;
  quantity?: number;
  onPressFav?: () => void;
  onPressAdd: () => void;
  onPressRemove: () => void;
}) {
  const {
    item,
    city,
    showsMarketLogo,
    quantity = 0,
    onPressAdd,
    onPressRemove,
  } = props;
  const { params, push } = useRouting();
  const atualCity = city || params.city;
  const off = calcOff(item);

  const nav = device.web
    ? { path: `/produto/${atualCity}/${item.market_id}/${item.prod_id}` }
    : {
        onPress: () =>
          push(
            { screen: 'ProductTabs', path: '' },
            {
              city: atualCity,
              marketId: item.market_id,
              prodId: item.prod_id,
              path: `/produto/${atualCity}/${item.market_id}/${item.prod_id}`, // pathname inside tabs are undefined
            }
          ),
      };

  return (
    <View
      style={[globalStyles.elevation4, globalStyles.darkBorder, styles.card]}>
      <MyTouchable style={{ flex: 1 }} {...nav}>
        <View style={styles.container}>
          <View style={styles.containerImage}>
            {item.images_names ? (
              <Image
                placeholderStyle={{ backgroundColor: '#FFF' }}
                PlaceholderContent={
                  <MyIcon
                    name='cart-outline'
                    color={myColors.grey2}
                    size={80}
                  />
                }
                source={{ uri: getImageUrl('product', item.images_names[0]) }}
                containerStyle={styles.image}
              />
            ) : (
              <MyIcon
                name='cart-outline'
                color={myColors.grey2}
                size={80}
                style={styles.image}
              />
            )}
            {/* <IconButton
            style={styles.fav}
            icon={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? myColors.primaryColor : myColors.grey2}
            type='clear'
            onPress={onPressFav}
          /> */}
          </View>
          <View style={styles.containerText}>
            <Text
              ellipsizeMode='tail'
              numberOfLines={1}
              style={styles.prodText}>
              {item.name} {item.brand}
            </Text>
            {off && (
              <View style={styles.oldPriceRow}>
                <View style={styles.offTextBox}>
                  <Text style={styles.offText}>-{off}%</Text>
                </View>
                <Text style={styles.oldPriceText}>
                  {moneyToString(item.previous_price, 'R$')}
                </Text>
              </View>
            )}
            <Text style={styles.priceText}>
              {moneyToString(item.price, 'R$')}
            </Text>
            <Text style={styles.quantityText}>{item.quantity}</Text>
          </View>
          <View style={styles.mercContainer}>
            {showsMarketLogo && (
              <Image
                placeholderStyle={{ backgroundColor: '#FFF' }}
                source={{
                  uri: getImageUrl('market', item.market_id),
                }}
                containerStyle={styles.mercImage}
              />
            )}
          </View>
        </View>
      </MyTouchable>
      <View style={styles.containerAdd}>
        <IconButton icon='plus' type='addHorizontal' onPress={onPressAdd} />
        <AnimatedText style={styles.centerNumText} distace={10} animateZero>
          {quantity}
        </AnimatedText>
        <IconButton icon='minus' type='addHorizontal' onPress={onPressRemove} />
      </View>
    </View>
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
    paddingLeft: 36,
  },
  containerAdd: {
    position: 'absolute',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 104,
    paddingVertical: 6,
    paddingLeft: 3,
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
    height: 20,
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
    fontSize: 12,
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
