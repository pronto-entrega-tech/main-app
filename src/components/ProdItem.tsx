import React from 'react';
import { View, Text, StyleSheet, ImageSourcePropType, ViewStyle, StyleProp, Pressable } from 'react-native';
import { Image } from 'react-native-elements';
import { Divider } from 'react-native-paper';
import { myColors, device, images, globalStyles } from '../constants';
import { converter } from '../functions';
import IconButton from './IconButton';
import MyButton from './MyButton';
import { StackNavigationProp } from '@react-navigation/stack';
import requests from '../services/requests';

export interface prodModel {
  prodKey: number,
  image: ImageSourcePropType,
  nome: string,
  mercKey: number,
  marca: string,
  quantidade: string,
  preco: number,
  precoAntes: number,
}

function ProdItem({navigation, item, isFavorite, quantity = 0, onPressFav, onPressAdd, onPressRemove, style={}}:
{navigation: StackNavigationProp<any, any>, item: prodModel, isFavorite: boolean, quantity?: number, 
  onPressFav: (item: any) => void , onPressAdd: (item: any) => void , onPressRemove: (item: any) => void, style?: StyleProp<ViewStyle> }) {
  const off = ((1-(item.preco / item.precoAntes))*100).toFixed(0)
  const uriImage = item.image != null ? {uri: requests+'images/'+item.image} : images.loadProdImage;

  return (
    <View style={[styles.card, globalStyles.elevation4, globalStyles.darkBoader, style]} >
      <MyButton onPress={() => navigation.push('Product', device.web? {prod: item.prodKey} : {item: item})} >
        <View>
          <View style={ styles.top } >
            { item.precoAntes != null ? <View style={styles.offTextBox}><Text style={styles.offText} >-{off}%</Text></View> : null }
            <Image 
              placeholderStyle={{backgroundColor: '#FFF'}}
              source={uriImage}
              style={styles.image} />
            <View style={styles.fav} >
              <IconButton
                icon={isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorite ? myColors.primaryColor : myColors.grey2}
                type='clear'
                onPress={onPressFav} />
            </View>
          </View>
          <View style={styles.mercLine} >
            <Image 
              placeholderStyle={{backgroundColor: '#FFF'}}
              source={{uri: requests+'images/mercado.png'}}
              style={styles.mercImage} />
          </View>
          <View style={ styles.container } >
            {item.precoAntes != null ? <Text style={ styles.oldPriceText } >R${converter.toPrice(item.precoAntes)}</Text> : null }
            <Text style={ styles.priceText } >R${converter.toPrice(item.preco)}</Text>
            <View style={ styles.brandWeightRow } >
              <Text style={ styles.brandText } >{item.marca}</Text>
              <Text style={ styles.weightText } >{item.quantidade}</Text>
            </View>
            <Text
              ellipsizeMode="tail"
              numberOfLines={3}
              style={ styles.prodText }>
              {item.nome}
            </Text>
          </View>
          <Divider style={{backgroundColor: myColors.divider2, height: 1, marginBottom: 0 }}/>
          <Pressable style={ styles.containerAdd } >
            <IconButton 
              icon='minus' 
              size={24} 
              color={myColors.primaryColor} 
              type='add' 
              onPress={onPressRemove} />
            <Text style={ styles.centerNumText } >{quantity}</Text>
            <IconButton 
              icon='plus' 
              size={24} 
              color={myColors.primaryColor} 
              type='add' 
              onPress={onPressAdd} />
          </Pressable>
        </View>
      </MyButton>
    </View>
  );
}

const textLinePad = device.android ? -2 : 1
const tileWidth = device.width/2-12
const styles = StyleSheet.create({
  card: {
    width: tileWidth,
    marginLeft: 8,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden'
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
  mercLine: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: -10
  },
  mercImage: {
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
    marginHorizontal: 8,
  },
  oldPriceText: {
    position: 'absolute',
    textDecorationLine: 'line-through',
    color: myColors.grey2,
    marginTop: -38,
    fontSize: 13,
    fontFamily: 'Regular'
  },
  priceText: {
    color: myColors.text3,
    marginTop: -22+textLinePad,
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
  prodText: { 
    height: 17.5*2,
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