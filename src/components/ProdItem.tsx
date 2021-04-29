import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Image } from 'react-native-elements';
import { Divider } from 'react-native-paper';
import { myColors, device, images, globalStyles } from '../constants';
import IconButton from './IconButton';
import MyButton from './MyTouchable';
import { StackNavigationProp } from '@react-navigation/stack';
import requests from '../services/requests';
import { Money } from '../functions/converter';
import MyText from './MyText';

export interface prodModel {
  prodKey: string,
  image: string,
  nome: string,
  mercKey: string,
  marca: string,
  quantidade: string,
  preco: Money,
  precoAntes?: Money,
}

function ProdItem({navigation, item, isFavorite, quantity = 0, onPressFav, onPressAdd, onPressRemove, style={}, merc}:
{navigation: StackNavigationProp<any, any>, item: prodModel, isFavorite: boolean, quantity?: number, 
  onPressFav: (item: any) => void , onPressAdd: (item: any) => void , onPressRemove: (item: any) => void,
   style?: StyleProp<ViewStyle>, merc: boolean }) {
  const off = item.precoAntes? ((1-(item.preco.value / item.precoAntes.value))*100).toFixed(0) : undefined;
  const uriImage = item.image != null ? {uri: requests+'images/'+item.image} : images.loadProdImage;

  return (
    <MyButton
      style={[styles.card, globalStyles.elevation4, globalStyles.darkBoader, style]}
      onPress={() => navigation.push('Product', device.web? {prod: item.prodKey} : {item: item})} >
      <View style={ styles.top } >
        {off? <View style={styles.offTextBox}><MyText style={styles.offText} >-{off}%</MyText></View> : null}
        <Image 
          placeholderStyle={{backgroundColor: '#FFF'}}
          source={uriImage}
          containerStyle={styles.image} />
        <View style={styles.fav} >
          <IconButton
            icon={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? myColors.primaryColor : myColors.grey2}
            type='clear'
            onPress={onPressFav} />
        </View>
      </View>
      {!merc?
      <Image 
        placeholderStyle={{backgroundColor: '#FFF'}}
        source={{uri: requests+'images/'+'mercado'/*item.key*/+'.png'}}
        containerStyle={styles.mercImage} /> : null}
      <View style={ styles.container } >
        {item.precoAntes != null ? <MyText style={ styles.oldPriceText } >R${item.precoAntes.toString()}</MyText> : null }
        <MyText style={ styles.priceText } >R${item.preco.toString()}</MyText>
        <View style={ styles.brandWeightRow } >
          <MyText style={ styles.brandText } >{item.marca}</MyText>
          <MyText style={ styles.weightText } >{item.quantidade}</MyText>
        </View>
        <MyText
          ellipsizeMode="tail"
          numberOfLines={2}
          style={ styles.prodText }>
          {item.nome}
        </MyText>
      </View>
      <Divider style={{backgroundColor: myColors.divider2, height: 1, marginBottom: 0 }}/>
      <View style={ styles.containerAdd } >
        <IconButton 
          icon='minus' 
          size={24} 
          color={myColors.primaryColor} 
          type='add' 
          onPress={onPressRemove} />
        <MyText style={ styles.centerNumText } >{quantity.toString()}</MyText>
        <IconButton 
          icon='plus' 
          size={24} 
          color={myColors.primaryColor} 
          type='add' 
          onPress={onPressAdd} />
      </View>
    </MyButton>
  );
}

const tileWidth = device.width/2-12
const styles = StyleSheet.create({
  card: {
    height: 220,
    width: tileWidth,
    marginLeft: 8,
    marginBottom: 8,
    borderRadius: 10,
    backgroundColor: '#fff'
  },
  top: {
    alignItems: 'center',
  },
  placeholderColor: {
    backgroundColor: 'transparent'
  },
  fav: {
    position: 'absolute',
    alignSelf:'flex-end',
    right: 0
  },
  mercImage: {
    position: 'absolute',
    right: 0,
    top: 90,
    marginRight: 10,
    height: 34,
    width: 34,
  },
  offTextBox: {
    zIndex: 1,
    position: 'absolute',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 3,
    margin: 7,
    backgroundColor: myColors.primaryColor,
    borderRadius: 20
  },
  offText: {
    color: '#FFF',
    fontWeight: 'bold'
  },
  image: {
    marginTop: 10,
    height: 80,
    width: 80,
  },
  container: {
    marginTop: 24,
    marginHorizontal: 8,
  },
  oldPriceText: {
    height: 20,
    position: 'absolute',
    textDecorationLine: 'line-through',
    color: myColors.grey2,
    marginTop: -38,
    fontSize: 13,
  },
  priceText: {
    height: 27,
    color: myColors.text3,
    marginTop: -22,
    fontSize: 20,
    fontFamily: 'Medium'
  },
  brandWeightRow: {
    height: 19,
    flexDirection: 'row',
  },
  brandText: {
    color: myColors.grey2,
  },
  weightText: {
    marginLeft: 4,
    color: myColors.grey2,
  },
  prodText: { 
    height: 35,
    color: myColors.grey3,
    marginBottom: 8,
    fontFamily: 'Condensed'
  },
  containerAdd: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8
  },
  centerNumText: {
    fontSize: 17,
    color: myColors.text3,
    fontFamily: 'Medium'
  }
})

export default ProdItem