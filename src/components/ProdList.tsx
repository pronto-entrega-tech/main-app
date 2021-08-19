import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, StyleProp, ViewStyle, RefreshControl } from 'react-native';
import { Divider } from 'react-native-paper';
import NetInfo from "@react-native-community/netinfo";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProdItem, { prodModel } from './ProdItem';
import { myColors, device } from '../constants'
import { StackNavigationProp } from '@react-navigation/stack';
import validate from '../functions/validate';
import useMyContext from '../functions/MyContext';
import requests from '../services/requests';
import Loading, { Errors } from './Loading';
import { createProdList } from '../functions/converter';
import MyButton from './MyButton';
import { getCity } from '../functions/dataStorage';
import ProdItemHorizontal from './ProdItemHorizontal';

function ListHeader({navigation, title = 'Ofertas', barless = false}: {navigation: StackNavigationProp<any, any>, title?: string, barless?: boolean}) {
  return (
    <View style={{width: '100%', height: 48, elevation: 10, zIndex: 10}} >
      {barless? null :
      <Divider style={{backgroundColor: myColors.divider, height: 2}}/>
      }
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

function ProdList({navigation, header, data, style = {}, merc = false, horizontalItems = false, horizontal = false, refreshless = false, tryAgain }:
{navigation: StackNavigationProp<any, any>, header: any, data?: prodModel[], style?: StyleProp<ViewStyle>, merc?: boolean, horizontalItems?: boolean, horizontal?: boolean, refreshless?: boolean, tryAgain?: boolean }) {
  const [isLoading, setIsLoading] = useState(!data);
  const [tryAgain1, setTryAgain1] = useState(false);
  const [error, setError] = useState<'server'|'connection'|'nothing'|null>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [prodList, setProdList] = useState<prodModel[]>();
  const [city, setCity] = React.useState('');
  const { shoppingList, favorites, onPressFav, onPressAdd, onPressRemove } = useMyContext();

  useEffect(() => {
    if (data != null) return;
    setIsLoading(true)
    setError(null)

    NetInfo.fetch().then(state => {
      if (state.isInternetReachable == false)
      setError('connection')
    });

    getCity().then(city => {
      setCity(city)
      fetch(requests+`prodList.php?city=${city}`).then((response) => {
        response.json()
        .then((json) => {
          if (json[0] == 'nothing') return setError('nothing')
          setProdList(createProdList(json))
          setIsLoading(false)
        })
      }).catch(() => {
        setError('server')
      })
    })
  }, [tryAgain1, tryAgain]);

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

  if (error)
  return (
    <Errors
      error={error}
      onPress={() => {
        setError(null)
        setTryAgain1(!tryAgain1)
      }} />
  )
  
  if (isLoading)
  return <Loading />

  if (!horizontalItems) {
    const myRenderItem = ({ item, index }: { item: prodModel, index: number }) => (
      <ProdItem
        style={horizontal? {width: device.width/2-20} : {/*marginTop: index == 0 || index == 1 ? 3 : 0*/}}
        navigation={navigation}
        city={city}
        merc={merc}
        item={item}
        isFavorite={favorites.has(item.prod_id)}
        quantity={shoppingList.get(item.prod_id)?.quantity}
        onPressFav={() => onPressFav(item)}
        onPressAdd={() => onPressAdd(item)}
        onPressRemove={() => onPressRemove(item)} />
    )

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
      keyExtractor={({prod_id: id, market_id}) => id + market_id}
      ListHeaderComponent={header}
      renderItem={myRenderItem}/>
    )
  }

  const myRenderItem = ({ item, index }: { item: prodModel, index: number }) => (
    <ProdItemHorizontal
      navigation={navigation}
      city={city}
      item={item}
      merc={merc}
      isFavorite={favorites.has(item.prod_id)}
      quantity={shoppingList.get(item.prod_id)?.quantity}
      onPressFav={() => onPressFav(item)}
      onPressAdd={() => onPressAdd(item)}
      onPressRemove={() => onPressRemove(item)} />
  )

  return (
    <FlatList
    getItemLayout={(_item, i) => (
      {length: 112, offset: 112 * i, index: i}
    )}
    contentContainerStyle={[{paddingBottom: 50}, style]}
    showsVerticalScrollIndicator={false}
    data={data == null ? prodList : data}
    keyExtractor={({prod_id: id, market_id}) => id + market_id}
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