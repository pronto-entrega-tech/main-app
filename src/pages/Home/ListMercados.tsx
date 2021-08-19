import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { Divider } from 'react-native-elements';
import IconButton from '../../components/IconButton';
import { myColors, device, globalStyles } from '../../constants';
import MercItem, { mercModel } from '../../components/MercItem'
import { StackNavigationProp } from '@react-navigation/stack';
import { getActiveAddress, getCity } from '../../functions/dataStorage';
import requests from '../../services/requests';
import Loading, { Errors } from '../../components/Loading';
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
  const [error, setError] = useState<'server'|'connection'|'nothing'|null>(null);
  const [tryAgain, setTryAgain] = useState(false);
  const [city, setCity] = useState('');
  const [mercList, setMercList] = useState<mercModel[]>();
  const [coords, setCoords] = useState<{lat: number | undefined, lon: number | undefined}>();

  useEffect(() => {
    getCity().then(city => {
      setCity(city)
      fetch(requests+`mercList.php?city=${city}`).then((response) => {
        response.json()
        .then((json) => {
          if (json[0] == 'nothing') return setError('nothing')
          setMercList(createMercList(json))
          setIsLoading(false)
        })
      }).catch(() => {
        setError('server')
      })
    })
    getActiveAddress()
      .then(address => setCoords({lat: address.latitude, lon: address.longitude}))
  }, []);

  useEffect(() => {
    if (city && mercList && coords) {
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
  }, [city, mercList, coords]);

  if (error)
  return (
    <Errors
      error={error}
      onPress={() => {
        setError(null)
        setTryAgain(!tryAgain)
      }} />
  )

  if (isLoading || !coords)
  return <Loading/>
  
  return (
    <FlatList
    style={{backgroundColor: myColors.background}}
    contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 16}}
    showsVerticalScrollIndicator={false}
    data={mercList}
    keyExtractor={({ id: key }) => key.toString()}
    renderItem={({item}: {item: mercModel}) => (
      <MercItem
      coords={coords}
      item={item}
      onPress={() => navigation.navigate('Mercado', device.web? {city: city, market: item.name} : {item: item} )} />
    )}/>
  )
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