import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import MySearchbar from '../../components/MySearchBar';
import { prodModel } from '../../components/ProdItem';
import ProdListHorizontal from '../../components/ProdListHorizontal';
import { myColors } from '../../constants';
import { getFavorites } from '../../functions/dataStorage';
import useMyContext from '../../functions/MyContext';
import { ListMercadosHeader } from './ListMercados';

export function FavoritosHeader({ navigation }:
  {navigation: StackNavigationProp<any, any>}) {
  return (
    <View style={{backgroundColor: myColors.background}} >
      <ListMercadosHeader navigation={navigation} title='Favoritos'/>
      <View style={{marginTop: 12, marginBottom: 8, paddingHorizontal: 16}} >
      <MySearchbar/>
      </View>
    </View>
  )
}

function Favoritos({ navigation }:
  {navigation: StackNavigationProp<any, any>}) {
  const {favorites} = useMyContext();

  return (
    <View style={{backgroundColor: myColors.background, flex: 1, justifyContent: 'center'}}>
      {favorites.size == 0 ?
        <Text style={{fontSize: 15, color: myColors.text2, alignSelf: 'center', position: 'absolute'}}>Nenhum produto salvo</Text>
       : null}
      <ProdListHorizontal
        style={{paddingTop: 12}}
        data={Array.from(favorites.values()).reverse()}
        navigation={navigation}
        header={null} />
    </View>
  )
}

export default Favoritos