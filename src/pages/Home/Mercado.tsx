import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Image, AirbnbRating } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { device, myColors } from '../../constants'
import { mercModel } from '../../components/MercItem'
import MyTouchable from '../../components/MyTouchable';
import ProdList, { ListHeader } from '../../components/ProdList';
import requests from '../../services/requests';
import { getActiveAddress } from '../../functions/dataStorage';
import Loading from '../../components/Loading';
import { useProdContext2 } from '../../functions/ProdContext';
import { computeDistance, createMercItem, isMarketOpen } from '../../functions/converter';
import MyButton from '../../components/MyButton';

function Mercado({navigation, route}:
{navigation: StackNavigationProp<any, any>, route: any}) {
  const [mercItem, setMercItem] = useState<mercModel>(route.params?.item);
  const [coords, setCoords] = useState<{lat: number | undefined, lon: number| undefined}>();
  const prodContext = useProdContext2();

  useEffect(() => {
    getActiveAddress()
      .then(address => setCoords({lat: address.latitude, lon:  address.longitude}))
    if (mercItem) return;
    const mercName = route.params?.merc? route.params.merc : prodContext?.merc;
    fetch(requests+'mercList.php')
      .then((response) => response.json())
      .then((json) => setMercItem(createMercItem(json[0])))
      .catch((error) => console.error(error));
  }, []);
  
  if (!mercItem || !coords)
  return <Loading />
  
  return (
    <ProdList
      navigation={navigation}
      merc
      style={{backgroundColor: myColors.background, paddingBottom: 74}}
      header={({ key }: { key: number }) => {
      const distance = coords.lat && coords.lon?
      computeDistance([coords.lat, coords.lon],[mercItem.latitude, mercItem.longitude]) : undefined;
      const {isOpen, openHour} = isMarketOpen(mercItem);
      
      let data: {icon: string, text: string}[] = [
        {icon: 'clock', text: `${isOpen ? 'Fecha' : 'Abre'} ás ${openHour}:00`},
        {icon: 'map-marker', text: `Á ${distance}km de você`},
        {icon: 'truck-fast', text: `${mercItem.minPrazo}-${mercItem.maxPrazo}min • R$${mercItem.taxa.toString()}`},
        {icon: 'currency-usd-circle', text: `Mínimo R$${mercItem.minPedido.toString()}`},
      ]

      if (!distance) {
        data = data.filter(item => item.icon != 'map-marker')
      }

      return (
        <>
        <View key={key} style={{flexDirection: 'row', paddingLeft: 16, paddingBottom: 2, marginTop: prodContext? 12 : 0}} >
          <View style={{paddingTop: 2}} >
            <Image
              containerStyle={{borderRadius: 8, height: 128, width: 128}}
              source={{uri: requests+'images/'+'mercado'/*item.key*/+'.jpeg'}}/>
            <View style={{padding: 6, marginTop: -6, marginLeft: -2}} >
              <AirbnbRating defaultRating={0} isDisabled={true} size={18} showRating={false} />
            </View>
            <MyTouchable
              onPress={() => navigation.navigate('MercRating', {key: mercItem.key})} 
              style={{marginTop: -36, borderRadius: 4, width: 132, height: 36, marginLeft: -2}} >
            </MyTouchable>
          </View>
          <View>
            <View style={{flexDirection: 'row', marginLeft: 6}}>
              <MyButton
                buttonStyle={{paddingVertical: 3}}
                type='clear'
                title={mercItem.nome}
                titleStyle={{color: myColors.text3, fontSize: 22}}
                iconRight
                icon={<Icon name='chevron-right' size={28} color={myColors.text3} style={{marginLeft: -2}} />}
                onPress={() => navigation.navigate('MercInfo', device.web? {key: mercItem.key} : {item: mercItem})} />
            </View>
            {
              data.map(( item, index ) => (
              <View key={index} style={{flexDirection: 'row',marginBottom: 4, marginLeft: 12, alignItems: 'center'}}>
                <Icon name={item.icon} size={20} color={myColors.primaryColor}/>
                <Text style={{marginLeft: 4, color: myColors.text4}}>{item.text}</Text>
              </View>
              ))
            }
          </View>
        </View>
        <ListHeader navigation={navigation} />
        </>
    )}} />
  )
};

export default Mercado