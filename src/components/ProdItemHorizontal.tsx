import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { myColors, device, globalStyles } from '../constants';
import IconButton from './IconButton';
import MyButton from './MyTouchable';
import { StackNavigationProp } from '@react-navigation/stack';
import { prodModel } from './ProdItem';
import requests from '../services/requests';
import { moneyToString } from '../functions/converter';

function ProdItemHorizontal({navigation, item, isFavorite, quantity = 0, onPressFav, onPressAdd, onPressRemove, merc, city}:
{navigation: StackNavigationProp<any, any>, item: prodModel, isFavorite: boolean, quantity?: number,
  onPressFav: (item: any) => void , onPressAdd: (item: any) => void , onPressRemove: (item: any) => void, merc: boolean, city: string }) {
  const off = item.price_before? ((1-(item.price.value / item.price_before.value))*100).toFixed(0) : undefined

  return (
    <MyButton
      style={[styles.card, globalStyles.elevation4, globalStyles.darkBoader]}
      onPress={() => navigation.push('Product', device.web? {city: city, market: item.market_id, prod: item.prod_id} : {item: item})} >
      <View style={ styles.container }> 
        <View style={ styles.containerAdd } >
          <IconButton 
            icon='plus' 
            size={24} 
            color={myColors.primaryColor} 
            type='addHorizontal' 
            onPress={onPressAdd} />
          <Text style={ styles.centerNumText } >{typeof quantity !== 'undefined' ? quantity : 0}</Text>
          <IconButton 
            icon='minus' 
            size={24} 
            color={myColors.primaryColor} 
            type='addHorizontal' 
            onPress={onPressRemove} />
        </View>
        <View style={ styles.containerImage } >
          <Image 
            placeholderStyle={{backgroundColor: '#FFF'}}
            PlaceholderContent={
              <Icon name='cart-outline' color={myColors.grey2} size={80} />
            }
            source={{uri: requests+'images/'+item.prod_id+'.webp'}}
            containerStyle={styles.image} />
          {off? <View style={styles.offTextBox}><Text style={styles.offText} >-{off}%</Text></View> : null}
          <IconButton
            style={styles.fav}
            icon={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? myColors.primaryColor : myColors.grey2}
            type='clear'
            onPress={onPressFav} />
        </View>
        <View style={ styles.containerText } >
          <Text
            ellipsizeMode="tail"
            numberOfLines={1} 
            style={ styles.prodText }>
            {item.name}
          </Text>
          <Text style={ styles.oldPriceText } >{item.price_before? 'R$'+moneyToString(item.price_before) : null}</Text>
          <Text style={ styles.priceText } >R${moneyToString(item.price)}</Text>
          <View style={ styles.brandWeightRow } >
            <Text style={ styles.brandText } >{item.brand}</Text>
            <Text style={ styles.weightText } >{item.weight}</Text>
          </View>
        </View>
        <View style={styles.mercContainer} >
          {!merc?
          <Image 
            placeholderStyle={{backgroundColor: '#FFF'}}
            source={{uri: requests+'images/'+'mercado'/*item.id*/+'.webp'}}
            containerStyle={styles.mercImage} /> : null}
        </View>
      </View>
    </MyButton>
  );
}

const textLinePad = device.android ? -2 : 1
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
    fontFamily: 'Medium'
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
  offTextBox: {
    position: 'absolute',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 2,
    marginTop: 6,
    backgroundColor: myColors.primaryColor,
    borderRadius: 20
  },
  fav: {
    position: 'absolute',
    alignSelf:'flex-end',
    top: -3,
    right: -10
  },
  offText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  containerText: {
    marginHorizontal: 8,
  },
  prodText: { 
    height: 17.5,
    color: myColors.grey3,
    marginTop: 12,
    width: device.width-160,
    fontFamily: 'Condensed'
  },
  oldPriceText: {
    position: 'absolute',
    textDecorationLine: 'line-through',
    color: myColors.grey2,
    marginTop: 32,
    fontSize: 13,
    fontFamily: 'Regular'
  },
  priceText: {
    color: myColors.text3,
    marginTop: 18+textLinePad,
    fontSize: 20,
    fontFamily: 'Medium'
  },
  brandWeightRow: {
    flexDirection: 'row',
    marginTop: textLinePad
  },
  brandText: {
    color: myColors.grey2,
    fontFamily: 'Regular'
  },
  weightText: {
    marginLeft: 4,
    color: myColors.grey2,
    fontFamily: 'Regular'
  },
  mercContainer: {
    position: 'absolute',
    right: 12,
    top: 48
  },
  mercImage: {
    marginRight: 0,
    height: 34,
    width: 34,
  }
})

export default ProdItemHorizontal