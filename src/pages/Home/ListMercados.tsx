import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { Divider } from 'react-native-elements';
import IconButton from '../../components/IconButton';
import { myColors, device, globalStyles } from '../../constants';
import MercItem, { mercModel } from '../../components/MercItem'
import { StackNavigationProp } from '@react-navigation/stack';
import { getActiveAddress } from '../../functions/dataStorage';
import requests from '../../services/requests';
import Loading from '../../components/Loading';
import { createMercList } from '../../functions/converter';

export function ListMercadosHeader({navigation, title}:
  {navigation: StackNavigationProp<any, any>, title: string}) {
  return (
    <View style={[styles.header, globalStyles.notch]}>
      <IconButton
      icon='arrow-left'
      size={24}
      color={myColors.primaryColor}
      type='back'
      onPress={() => {
        if (navigation.dangerouslyGetState().routeNames[1] == 'ListMercados')
        return navigation.navigate('Home')

        navigation.goBack()
        }} />
      <Text style={styles.textHeader}>{title}</Text>
      <Divider style={{backgroundColor: myColors.divider3, height: 1 ,marginHorizontal: 16, marginTop: -1}}/>
    </View>
  )
}

function ListMercados({navigation}: {navigation: StackNavigationProp<any, any>}) {
  const [isLoading, setIsLoading] = useState(true);
  const [mercList, setMercList] = useState<mercModel[]>();
  const [coords, setCoords] = useState<{lat: number | undefined, lon: number | undefined}>();

  useEffect(() => {
    fetch(requests+'mercList.php')
      .then((response) => response.json())
      .then((json) => setMercList(createMercList(json)))
      .catch((error) => console.error(error));
    getActiveAddress()
      .then(address => setCoords({lat: address.latitude, lon: address.longitude}))
  }, []);

  useEffect(() => {
    if (mercList && coords) {
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
  }, [mercList, coords]);

  if (isLoading || !coords) {
    return (
      <Loading/>
    )
  } else {
    return (
      <FlatList
      style={{backgroundColor: myColors.background}}
      contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 16}}
      showsVerticalScrollIndicator={false}
      data={mercList}
      keyExtractor={({ key }) => key.toString()}
      renderItem={({item}: {item: mercModel}) => (
        <MercItem
        coords={coords}
        item={item}
        onPress={() => navigation.navigate('Mercado', device.web? {merc: item.nome} : {item: item} )} />
      )}/>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: myColors.background,
    justifyContent: 'center',
  },
  textHeader: {
    color: myColors.primaryColor,
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    position: 'absolute',
  },
})

export default ListMercados