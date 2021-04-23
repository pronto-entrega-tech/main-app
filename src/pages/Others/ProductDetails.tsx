import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Divider, Image } from 'react-native-elements';
import useMyContext from '../../functions/MyContext';
import IconButton from '../../components/IconButton';
import ProdListHorizontal from '../../components/ProdListHorizontal';
import { myColors, device, images } from '../../constants'; 
import { converter } from '../../functions';
import validate from '../../functions/validate';
import requests from '../../services/requests';
import { useProdContext } from '../../functions/ProdContext';

function ProductDetails({ navigation }:
  {navigation: StackNavigationProp<any, any>}) {
  const {shoppingList, onPressAdd, onPressRemove} = useMyContext();
  const {item} = useProdContext();
  const quantity = shoppingList.get(item.prodKey)?.quantity;
  const off = ((1-(item.preco / item.precoAntes))*100).toFixed(0);
  const uriImage = item.image != null ? {uri: requests+'images/'+item.image} : images.loadProdImage;
  return(
    <View style={{backgroundColor: myColors.background, flex: 1}} >
      <ProdListHorizontal navigation={navigation} header={({ key }: { key: number }) => (
        <View key={key}>
          <View style={{flexDirection: 'row', padding: 12}} >
            <View style={{flex: 1, flexDirection: 'column'}} >
              <Text
                ellipsizeMode="tail"
                numberOfLines={3}
                style={ styles.prodText }>
                {item.nome}
              </Text>
              {item.precoAntes != null ? 
              <View style={styles.oldPriceConteiner} >
                <Text style={styles.oldPriceText} >R${converter.toPrice(item.precoAntes)}</Text>
                <View style={styles.offTextBox}><Text style={styles.offText} >-{off}%</Text></View>
              </View>
              : null }
              <Text style={ styles.priceText } >R${converter.toPrice(item.preco)}</Text>
              <View style={ styles.brandWeightRow } >
                <Text style={ styles.brandText } >{item.marca}</Text>
                <Text style={ styles.weightText } >{item.quantidade}</Text>
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Image 
                placeholderStyle={{backgroundColor: '#FFF'}}
                source={uriImage}
                style={styles.image} />
              <View style={ styles.containerAdd } >
                <IconButton 
                  icon='minus' 
                  size={24} 
                  color={myColors.primaryColor} 
                  type='add' 
                  onPress={() => onPressRemove(item)} />
                <Text style={ styles.centerNumText } >{validate([quantity])? quantity : 0}</Text>
                <IconButton 
                  icon='plus' 
                  size={24} 
                  color={myColors.primaryColor} 
                  type='add' 
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
  },
  prodText: { 
    color: myColors.grey3,
    fontSize: 20,
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
    fontSize: 18,
  },
  priceText: {
    color: myColors.text3,
    marginTop: 114+textLinePad,
    fontSize: 28,
    fontFamily: 'Medium'
  },
  brandWeightRow: {
    flexDirection: 'row',
    marginTop: 4+textLinePad
  },
  brandText: {
    color: myColors.grey2,
    fontFamily: 'Regular',
    fontSize: 20,
  },
  weightText: {
    marginLeft: 4,
    color: myColors.grey2,
    fontFamily: 'Regular',
    fontSize: 20,
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