import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Divider, Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useMyContext from '~/functions/MyContext';
import IconButton from '~/components/IconButton';
import ProdListHorizontal from '~/components/ProdListHorizontal';
import { myColors, device } from '~/constants';
import validate from '~/functions/validate';
import requests from '~/services/requests';
import { useProdContext } from '~/functions/ProdContext';
import { getImageUrl } from '~/functions/converter';

function ProductDetails({
  navigation,
}: {
  navigation: StackNavigationProp<any, any>;
}) {
  const { favorites, onPressFav, shoppingList, onPressAdd, onPressRemove } =
    useMyContext();
  const { product: item } = useProdContext();
  const quantity = shoppingList.get(item.prod_id)?.quantity;
  const off = item.previous_price
    ? ((1 - item.price.value / item.previous_price.value) * 100).toFixed(0)
    : undefined;

  return (
    <View style={{ backgroundColor: myColors.background, flex: 1 }}>
      <ProdListHorizontal
        navigation={navigation}
        header={({ key }: { key: number }) => (
          <View key={key}>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 13,
                paddingTop: 6,
                paddingBottom: 10,
              }}>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <Text
                  ellipsizeMode='tail'
                  numberOfLines={3}
                  style={styles.prodText}>
                  {item.name} {item.brand}
                </Text>
                {off ? (
                  <View style={styles.oldPriceConteiner}>
                    <View style={styles.offTextBox}>
                      <Text style={styles.offText}>-{off}%</Text>
                    </View>
                    <Text style={styles.oldPriceText}>
                      R${item.previous_price?.toString()}
                    </Text>
                  </View>
                ) : null}
                <Text style={styles.priceText}>R${item.price.toString()}</Text>
                <Text style={styles.quantityText}>{item.quantity}</Text>
              </View>

              <View style={{ flexDirection: 'column' }}>
                {item.images_names ? (
                  <Image
                    placeholderStyle={{ backgroundColor: 'white' }}
                    PlaceholderContent={
                      <Icon
                        name='cart-outline'
                        color={myColors.grey2}
                        size={140}
                      />
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
                    size={140}
                    style={styles.image}
                  />
                )}
                {/* <IconButton
                  style={{ position: 'absolute', left: 0, top: -4 }}
                  icon={favorites.has(item.prod_id) ? 'heart' : 'heart-outline'}
                  size={28}
                  color={
                    favorites.has(item.prod_id)
                      ? myColors.primaryColor
                      : myColors.grey2
                  }
                  type='prodIcons'
                  onPress={() => onPressFav(item)}
                /> */}
                <View style={styles.containerAdd}>
                  <IconButton
                    icon='minus'
                    size={24}
                    color={myColors.primaryColor}
                    type='addLarge'
                    onPress={() => onPressRemove(item)}
                  />
                  <Text style={styles.centerNumText}>
                    {validate([quantity]) ? quantity : 0}
                  </Text>
                  <IconButton
                    icon='plus'
                    size={24}
                    color={myColors.primaryColor}
                    type='addLarge'
                    onPress={() => onPressAdd(item)}
                  />
                </View>
              </View>
            </View>

            <Divider style={{ backgroundColor: myColors.divider, height: 2 }} />
            <Text style={styles.ofertasText}>Compare ofertas</Text>
          </View>
        )}
      />
    </View>
  );
}

const textLinePad = device.android ? -2 : 1;
const styles = StyleSheet.create({
  placeholderColor: {
    backgroundColor: 'transparent',
  },
  image: {
    marginTop: 10,
    height: 140,
    width: 140,
    marginHorizontal: 4,
  },
  prodText: {
    color: myColors.grey3,
    fontSize: 20,
    marginTop: 8,
    marginBottom: 8,
    fontFamily: 'Condensed',
    position: 'absolute',
  },
  oldPriceConteiner: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    marginTop: 80,
  },
  oldPriceText: {
    textDecorationLine: 'line-through',
    color: myColors.grey2,
    fontSize: 18,
    fontFamily: 'Regular',
    marginLeft: 8,
  },
  offTextBox: {
    paddingVertical: 5,
    paddingHorizontal: 4,
    backgroundColor: myColors.primaryColor,
    borderRadius: 8,
  },
  offText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  priceText: {
    color: myColors.text3,
    marginTop: 112 + textLinePad,
    fontSize: 27,
    fontFamily: 'Medium',
  },
  brandText: {
    color: myColors.grey2,
    fontFamily: 'Regular',
    fontSize: 19,
  },
  quantityText: {
    marginTop: 4 + textLinePad,
    color: myColors.grey2,
    fontFamily: 'Regular',
    fontSize: 19,
  },
  containerAdd: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  centerNumText: {
    fontSize: 17,
    color: myColors.text3,
    fontFamily: 'Medium',
  },
  ofertasText: {
    marginLeft: 16,
    marginVertical: 12,
    color: myColors.text3,
    fontSize: 16,
    fontFamily: 'Regular',
  },
});

export default ProductDetails;
