import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'react-native-elements';
import { myColors, device, images, globalStyles } from '../constants';
import { converter } from '../functions';
import IconButton from './IconButton';
import MyButton from './MyButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { prodModel } from './ProdItem';
import requests from '../services/requests';

function ProdItemHorizontal({navigation, item, isFavorite, quantity = 0, onPressFav, onPressAdd, onPressRemove}:
{navigation: StackNavigationProp<any, any>, item: prodModel, isFavorite: boolean, quantity?: number, onPressFav: (item: any) => void , onPressAdd: (item: any) => void , onPressRemove: (item: any) => void }) {
  const off = ((1-(item.preco / item.precoAntes))*100).toFixed(0)
  const uriImage = item.image != null ? {uri: requests+'images/'+item.image} : images.loadProdImage;

  return (
    <View style={[styles.card, globalStyles.elevation4, globalStyles.darkBoader]} >
      <MyButton style={{borderRadius: 8}} onPress={() => navigation.push('Product', item)} >
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
              source={uriImage}
              style={styles.image} />
            { item.precoAntes != null ? <View style={styles.offTextBox}><Text style={styles.offText} >-{off}%</Text></View> : null }
            <View style={styles.fav} >
              <IconButton
                icon={isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorite ? myColors.primaryColor : myColors.grey2}
                type='clear'
                onPress={onPressFav} />
            </View>
          </View>
          <View style={ styles.containerText } >
            <Text
              ellipsizeMode="tail"
              numberOfLines={1} 
              style={ styles.prodText }>
              {item.nome}
            </Text>
            <Text style={ styles.oldPriceText } >{item.precoAntes != null ? 'R$'+converter.toPrice(item.precoAntes) : null }</Text>
            <Text style={ styles.priceText } >R${converter.toPrice(item.preco)}</Text>
            <View style={ styles.brandWeightRow } >
              <Text style={ styles.brandText } >{item.marca}</Text>
              <Text style={ styles.weightText } >{item.quantidade}</Text>
            </View>
          </View>
          <View style={styles.mercContainer} >
            <Image 
              placeholderStyle={{backgroundColor: '#FFF'}}
              source={{uri: requests+'images/mercado.png'}}
              style={styles.mercImage} />
          </View>
        </View>
      </MyButton>
    </View>
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
    paddingHorizontal: 3
  },
  centerNumText: {
    fontSize: 17,
    color: myColors.text3,
    fontFamily: 'Medium'
  },
  containerImage: {
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