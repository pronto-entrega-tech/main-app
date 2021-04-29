import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, StyleProp, ViewStyle, RefreshControl } from 'react-native';
import { Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProdItem, { prodModel } from './ProdItem';
import { myColors, device } from '../constants'
import { StackNavigationProp } from '@react-navigation/stack';
import validate from '../functions/validate';
import useMyContext from '../functions/MyContext';
import requests from '../services/requests';
import Loading from './Loading';
import { createProdList } from '../functions/converter';
import MyButton from './MyButton';

function ListHeader({navigation, title = 'Ofertas'}: {navigation: StackNavigationProp<any, any>, title?: string}) {
  return (
    <View style={{width: '100%', height: 48, elevation: 10, zIndex: 10}} >
      <Divider style={{backgroundColor: myColors.divider, height: 2}}/>
      <View style={ styles.line2 } >
        <Text style={ styles.ofertasText } >{title}</Text>
        <View style={ styles.filerButton } >
          <MyButton 
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
}

function ProdList({navigation, header, data, style = {}, merc = false, horizontal = false, refreshless = false }:
{navigation: StackNavigationProp<any, any>, header: any, data?: prodModel[], style?: StyleProp<ViewStyle>, merc?: boolean, horizontal?: boolean, refreshless?: boolean }) {
  const [isLoading, setIsLoading] = useState(!data);
  const [refreshing, setRefreshing] = React.useState(false);
  const [prodList, setProdList] = useState<prodModel[]>();
  //const [prodList, setProdList] = useState<Map<string, prodModel>>(new Map());
  const { shoppingList, favorites, onPressFav, onPressAdd, onPressRemove } = useMyContext();

  useEffect(() => {
    if (data != null) return;
    fetch(requests+'prodList.php')
      .then((response) => response.json())
      .then((json) => setProdList(createProdList(json)))
      .catch((error) => console.error(error))
  }, []);

  useEffect(() => {
    if (data == null) {
      if (validate([prodList, shoppingList, favorites])) {
        setIsLoading(false)
      } else {
        setIsLoading(true)
      }
    } else {
      if (validate([favorites, shoppingList])) {
        setIsLoading(false)
      } else {
        setIsLoading(true)
      }
    }
  }, [prodList, shoppingList, favorites]);

  const myRenderItem = ({ item, index }: { item: prodModel, index: number }) => {
    return (
      <ProdItem
      style={horizontal? {width: device.width/2-20} : {marginTop: index == 2 || index == 3 ? 3 : 0}}
      navigation={navigation}
      merc={merc}
      item={item}
      isFavorite={favorites.has(item.prodKey)}
      quantity={shoppingList.get(item.prodKey)?.quantity}
      onPressFav={() => onPressFav(item)}
      onPressAdd={() => onPressAdd(item)}
      onPressRemove={() => onPressRemove(item)} />
    )
  }
  
  if (isLoading)
  return <Loading />

  return (
    <FlatList
    getItemLayout={(_item, i) => {
      const itemHeight = 228
      return (
        {length: itemHeight, offset: itemHeight * i, index: i}
      )
    }}
    refreshControl={refreshless? undefined :
    <RefreshControl
      colors={[myColors.primaryColor]}
      refreshing={refreshing}
      onRefresh={() => {
        setRefreshing(true)
        setTimeout(() => {
          setRefreshing(false)
        }, 2000)
      }}
    />}
    contentContainerStyle={[horizontal? {} : { paddingBottom: 50}, style]}
    showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false}
    data={data == null ? prodList : data}
    horizontal={horizontal}
    numColumns={horizontal? 1 : 2}
    keyExtractor={({ prodKey }) => prodKey.toString()}
    ListHeaderComponent={header}
    renderItem={myRenderItem}/>
  )
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

export { ListHeader }
export default ProdList