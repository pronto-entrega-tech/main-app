import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Divider, Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useMyContext from '../../functions/MyContext';
import IconButton from '../../components/IconButton';
import ProdListHorizontal from '../../components/ProdListHorizontal';
import { myColors, device } from '../../constants'; 
import validate from '../../functions/validate';
import requests from '../../services/requests';
import { useProdContext } from '../../functions/ProdContext';

function ProductDetails({ navigation }:
  {navigation: StackNavigationProp<any, any>}) {
  const {favorites, onPressFav, shoppingList, onPressAdd, onPressRemove} = useMyContext();
  const {item} = useProdContext();
  const quantity = shoppingList.get(item.prod_id)?.quantity;
  const off = item.price_before? ((1-(item.price.value / item.price_before.value))*100).toFixed(0) : undefined;

  return(
    <View style={{backgroundColor: myColors.background, flex: 1}} >
      <ProdListHorizontal navigation={navigation} header={({ key }: { key: number }) => (
        <View key={key}>
          <View style={{flexDirection: 'row', paddingHorizontal: 13,paddingTop: 6, paddingBottom: 10}} >
            <View style={{flex: 1, flexDirection: 'column'}} >
              <Text
                ellipsizeMode="tail"
                numberOfLines={3}
                style={ styles.prodText }>
                {item.name}
              </Text>
              {off? 
              <View style={styles.oldPriceConteiner} >
                <Text style={styles.oldPriceText} >R${item.price_before?.toString()}</Text>
                <View style={styles.offTextBox}>
                  <Text style={styles.offText} >-{off}%</Text>
                </View>
              </View>
              : null }
              <Text style={ styles.priceText } >R${item.price.toString()}</Text>
              <View style={ styles.brandWeightRow } >
                <Text style={ styles.brandText } >{item.brand}</Text>
                <Text style={ styles.weightText } >{item.weight}</Text>
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Image
                placeholderStyle={{backgroundColor: 'white'}}
                PlaceholderContent={
                  <Icon name='cart-outline' color={myColors.grey2} size={140} />
                }
                source={{uri: requests+'images/'+item.prod_id+'.webp'}}
                containerStyle={styles.image} />
              <IconButton
                style={{position: 'absolute', right: -12, top: -4}}
                icon={favorites.has(item.prod_id)? 'heart' : 'heart-outline'}
                size={25}
                color={favorites.has(item.prod_id)? myColors.primaryColor : myColors.grey2}
                type='prodIcons'
                onPress={() => onPressFav(item)} />
              <View style={ styles.containerAdd } >
                <IconButton 
                  icon='minus' 
                  size={24} 
                  color={myColors.primaryColor} 
                  type='addLarge' 
                  onPress={() => onPressRemove(item)} />
                <Text style={ styles.centerNumText } >{validate([quantity])? quantity : 0}</Text>
                <IconButton 
                  icon='plus' 
                  size={24} 
                  color={myColors.primaryColor} 
                  type='addLarge' 
                  onPress={() => onPressAdd(item)} />
              </View>
            </View>
          </View>

          <Divider style={{backgroundColor: myColors.divider, height: 2}}/>
          <Text style={styles.ofertasText} >Compare ofertas</Text>
        </View>
      )} />
    </View>
  )
}

const textLinePad = device.android ? -2 : 1
const styles = StyleSheet.create({
  placeholderColor: {
    backgroundColor: 'transparent'
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
    fontFamily: 'Regular'
  },
  offTextBox: {
    paddingVertical: 5,
    paddingHorizontal: 4,
    marginLeft: 8,
    backgroundColor: myColors.primaryColor,
    borderRadius: 20
  },
  offText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  priceText: {
    color: myColors.text3,
    marginTop: 112+textLinePad,
    fontSize: 27,
    fontFamily: 'Medium'
  },
  brandWeightRow: {
    flexDirection: 'row',
    marginTop: 4+textLinePad
  },
  brandText: {
    color: myColors.grey2,
    fontFamily: 'Regular',
    fontSize: 19,
  },
  weightText: {
    marginLeft: 4,
    color: myColors.grey2,
    fontFamily: 'Regular',
    fontSize: 19,
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
  },
  ofertasText: {
    marginLeft: 16,
    marginVertical: 12,
    color: myColors.text3,
    fontSize: 16,
    fontFamily: 'Regular'
  }
})

export default ProductDetails