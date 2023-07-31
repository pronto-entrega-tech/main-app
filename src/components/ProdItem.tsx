import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, Platform } from 'react-native';
import { Image } from 'react-native-elements/dist/image/Image'; // react-native-elements don't tree shake
import { StackNavigationProp } from '@react-navigation/stack';
import { myColors, device, globalStyles, myFonts } from '~/constants';
import { getImageUrl } from '~/functions/converter';
import { calcPrices, money } from '~/functions/money';
import IconButton from './IconButton';
import MyTouchable from './MyTouchable';
import MyText from './MyText';
import AnimatedText from './AnimatedText';
import MyIcon from './MyIcon';
import { Product } from '~/core/models';

const ProdItem = (props: {
  navigation?: StackNavigationProp<any, any>;
  item: Product;
  isFavorite?: boolean;
  quantity?: number;
  style?: StyleProp<ViewStyle>;
  showsMarketLogo: boolean;
  onPressFav?: () => void;
  onPressAdd: () => void;
  onPressRemove: () => void;
}) => {
  const {
    item,
    quantity = 0,
    style = {},
    showsMarketLogo,
    onPressAdd,
    onPressRemove,
  } = props;
  const { price, previous_price, discountText } = calcPrices(item);

  return (
    <View
      style={[
        styles.card,
        globalStyles.elevation4,
        globalStyles.darkBorder,
        style,
      ]}>
      <MyTouchable
        style={{ flex: 1 }}
        screen='Product'
        params={{ city: item.city_slug, itemId: item.item_id }}>
        <View style={styles.top}>
          {item.images_names ? (
            <Image
              placeholderStyle={{ backgroundColor: 'white' }}
              PlaceholderContent={
                <MyIcon name='cart-outline' color={myColors.grey2} size={70} />
              }
              source={{
                uri: getImageUrl('product', item.images_names[0]),
              }}
              containerStyle={styles.image}
            />
          ) : (
            <MyIcon
              name='cart-outline'
              color={myColors.grey2}
              size={70}
              style={styles.image}
            />
          )}
          {showsMarketLogo && (
            <Image
              placeholderStyle={{ backgroundColor: 'white' }}
              source={{ uri: getImageUrl('market', item.market_id) }}
              resizeMode='contain'
              containerStyle={styles.marketLogo}
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
        <View style={styles.container}>
          <MyText style={styles.priceText}>
            {money.toString(price, 'R$')}
          </MyText>
          {discountText && (
            <View style={styles.oldPriceRow}>
              <View style={styles.offTextBox}>
                <MyText style={styles.offText}>{discountText}</MyText>
              </View>
              <MyText style={styles.oldPriceText}>
                {money.toString(previous_price, 'R$')}
              </MyText>
            </View>
          )}
          <MyText numberOfLines={2} style={styles.nameText}>
            {item.name} {item.brand}
          </MyText>
          <MyText numberOfLines={1} style={styles.quantityText}>
            {item.quantity}
          </MyText>
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
      <View
        style={[
          globalStyles.elevation4,
          globalStyles.darkBorder,
          styles.addBar,
          {
            height: 32,
            width: quantity === 0 ? 32 : 32 * 2 + 16,
          },
        ]}>
        <IconButton
          style={{ left: device.web ? 1 : 0 }}
          icon={'plus'}
          type='add2'
          onPress={onPressAdd}
        />
        {quantity !== 0 && (
          <>
            <AnimatedText style={styles.centerNumText} distance={10}>
              {quantity}
            </AnimatedText>
            <IconButton
              style={styles.remove}
              icon='minus'
              type='add2'
              onPress={onPressRemove}
            />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 185,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  top: {
    alignItems: 'center',
  },
  placeholderColor: {
    backgroundColor: 'transparent',
  },
  marketLogo: {
    top: 8,
    left: 6,
    position: 'absolute',
    alignSelf: 'flex-end',
    height: 28,
    width: 28,
    borderRadius: 40,
  },
  addBar: {
    backgroundColor: 'white',
    borderRadius: 30,
    position: 'absolute',
    top: 6,
    right: 6,
    alignItems: 'center',
    flexDirection: 'row-reverse',
    ...Platform.select({
      web: {
        overflow: 'hidden',
        transitionDuration: '200ms',
      },
    }),
  },
  centerNumText: {
    fontSize: 15,
    color: myColors.text3,
    fontFamily: myFonts.Medium,
    left: 36,
    position: 'absolute',
  },
  remove: { position: 'absolute', [device.web ? 'right' : 'left']: 46 },
  marketImage: {
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
  priceText: {
    color: myColors.text3,
    marginTop: -22,
    marginBottom: 1,
    fontSize: 18,
    fontFamily: myFonts.Medium,
  },
  oldPriceRow: {
    marginTop: -1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  offTextBox: {
    paddingVertical: device.web ? 2 : 1,
    paddingHorizontal: 3,
    backgroundColor: myColors.primaryColor,
    borderRadius: 6,
  },
  offText: {
    fontSize: 11,
    color: 'white',
    fontFamily: myFonts.Bold,
  },
  oldPriceText: {
    textDecorationLine: 'line-through',
    color: myColors.grey2,
    fontSize: 13,
    marginLeft: 4,
  },
  nameText: {
    maxHeight: 40,
    includeFontPadding: false,
    color: myColors.grey3,
    marginTop: 2,
    fontFamily: myFonts.Condensed,
  },
  quantityText: {
    includeFontPadding: false,
    color: myColors.grey2,
  },
});

export default ProdItem;
