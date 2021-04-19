import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Button } from 'react-native-elements';
import { Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProdItem, { prodModel } from './ProdItem';
import { myColors, device } from '../constants'
import { StackNavigationProp } from '@react-navigation/stack';
import validate from '../functions/validate';
import useMyContext from '../functions/MyContext';
import requests from '../services/requests';
import Loading from './Loading';

const baseList: prodModel[] = [
  { 
    prodKey: -1,
    nome: '',
    image: {uri: ''},
    mercKey: 0,
    marca: '',
    quantidade: '',
    preco: 0,
    precoAntes: 0,
  },
  { 
    prodKey: 0,
    nome: '',
    image: {uri: ''},
    mercKey: 0,
    marca: '',
    quantidade: '',
    preco: 0,
    precoAntes: 0,
  }
];

function ProdList({ navigation, header, title = 'Oferta', style = {}, horizontal = false }:
{navigation: StackNavigationProp<any, any>, header: any, title?: string, style?: StyleProp<ViewStyle>, horizontal?: boolean }) {
  const [isLoading, setIsLoading] = useState(true);
  const [prodList, setProdList] = useState<prodModel[]>();
  //const [prodList, setProdList] = useState<Map<number, prodModel>>(new Map());
  const { shoppingList, favorites, onPressFav, onPressAdd, onPressRemove } = useMyContext();

  useEffect(() => {
    fetch(requests+'prodList.php')
      .then((response) => response.json())
      .then((json) => setProdList(json))
      .catch((error) => console.error(error))
  }, []);

  useEffect(() => {
    if (validate([prodList, shoppingList, favorites])) {
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
  }, [prodList, shoppingList, favorites]);

  const myRenderItem = ({ item, index }: { item: prodModel, index: number }) => {
    if (title != '' && index == 0)
      return (
        <View style={{width: '100%', height: 48, elevation: 10, zIndex: 10}} >
          <Divider style={{backgroundColor: myColors.divider, height: 2}}/>
          <View style={ styles.line2 } >
            <Text style={ styles.ofertasText } >{title}</Text>
            <View style={ styles.filerButton } >
              <Button 
                onPress={() => navigation.navigate('Filter')}
                type='clear'
                title='Filtros'
                titleStyle={{ color: myColors.grey2 }}
                icon={<Icon name='tune' size={24} color={myColors.grey2}
                />} 
              />
            </View>
          </View>
        </View>
      )
    if (!horizontal && index == 1) return(null)
      return (
        <ProdItem
        style={horizontal? {width: device.width/2-20} : {marginTop: index == 2 || index == 3 ? 3 : 0}}
        navigation={navigation}
        item={item}
        isFavorite={favorites.has(item.prodKey)}
        quantity={shoppingList.get(item.prodKey)?.quantity}
        onPressFav={() => onPressFav(item)}
        onPressAdd={() => onPressAdd(item)}
        onPressRemove={() => onPressRemove(item)} />
      )
  }
  
  if (isLoading) {
    return (
      <Loading />
    )
  } else {
    const list = title != '' && prodList ? [...baseList, ...prodList] : prodList
    return(
      <FlatList
      getItemLayout={(_item, i) => {
        const itemHeight = i == 2 || i == 3 ? 229 : 226
        if (title != '' && i == 0)
          return ({length: 48, offset: 0, index: 0})
        if (!horizontal && i == 1) 
          return ({length: 0, offset: 0, index: 1})
        return (
          {length: itemHeight, offset: itemHeight * i, index: i}
        )
      }}
      contentContainerStyle={[horizontal? {} : { paddingBottom: 50}, style]}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      data={list}
      horizontal={horizontal}
      numColumns={horizontal? 1 : 2}
      keyExtractor={({ prodKey }) => prodKey.toString()}
      stickyHeaderIndices={title != '' ? [1] : []}
      ListHeaderComponent={header}
      renderItem={myRenderItem}/>
    )
  }
}

const styles = StyleSheet.create({
  line2: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: myColors.background,
    width: '100%',
    height: 44,
    paddingLeft: 16,
    paddingRight: 8
  },
  ofertasText: {
    color: myColors.primaryColor,
    fontSize: 20,
    fontWeight: 'bold'
  },
  filerButton: {
    alignItems: 'flex-end',
    flex: 1,
  }
})

export default ProdList