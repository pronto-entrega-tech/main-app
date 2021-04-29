import React, { useEffect, useState } from 'react';
import { FlatList, StyleProp, ViewStyle } from 'react-native';
import { prodModel } from './ProdItem';
import ProdItemHorizontal from './ProdItemHorizontal';
import { StackNavigationProp } from '@react-navigation/stack';
import validate from '../functions/validate';
import useMyContext from '../functions/MyContext';
import requests from '../services/requests';
import Loading from './Loading';
import { createProdList } from '../functions/converter';

function ProdListHorizontal({navigation, header, data, style, merc = false}:
{navigation: StackNavigationProp<any, any>, header: any, data?: prodModel[], style?: StyleProp<ViewStyle>, merc?: boolean}) {
  const [isLoading, setIsLoading] = useState(true);
  const [prodList, setProdList] = useState<prodModel[]>();
  //const [prodList, setProdList] = useState<Map<string, prodModel>>(new Map());
  const { shoppingList, favorites, onPressFav, onPressAdd, onPressRemove } = useMyContext();

  useEffect(() => {
    if (data != null) return;
    fetch(requests+'prodList.php')
      .then((response) => response.json())
      .then((json) => setProdList(createProdList(json)))
      .catch((error) => console.error(error));
  }, []);
  
  useEffect(() => {
    if (data == null) {
      if (validate([prodList, favorites, shoppingList])) {
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
  }, [prodList, favorites, shoppingList]);
  
  if (isLoading)
  return <Loading />

  return (
    <FlatList
    getItemLayout={(_item, i) => (
      {length: 112, offset: 112 * i, index: i}
    )}
    contentContainerStyle={[{paddingBottom: 50}, style]}
    showsVerticalScrollIndicator={false}
    data={data == null ? prodList : data}
    keyExtractor={({ prodKey }) => prodKey.toString()}
    ListHeaderComponent={header}
    renderItem={({ item }: { item: prodModel}) => {
      return(
        <ProdItemHorizontal
          navigation={navigation}
          item={item}
          merc={merc}
          isFavorite={favorites.has(item.prodKey)}
          quantity={shoppingList.get(item.prodKey)?.quantity}
          onPressFav={() => onPressFav(item)}
          onPressAdd={() => onPressAdd(item)}
          onPressRemove={() => onPressRemove(item)} />
      )
    }}/>
  )
}

export default ProdListHorizontal