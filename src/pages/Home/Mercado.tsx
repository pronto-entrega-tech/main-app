import React, { useState, useEffect } from 'react';
import { Share, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Divider, Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { device, globalStyles, myColors } from '../../constants'
import { mercModel } from '../../components/MercItem'
import MyTouchable from '../../components/MyTouchable';
import ProdList, { ListHeader } from '../../components/ProdList';
import requests from '../../services/requests';
import { getActiveAddress, getCity } from '../../functions/dataStorage';
import Loading, { Errors } from '../../components/Loading';
import { useProdContext2 } from '../../functions/ProdContext';
import { computeDistance, createMercItem, isMarketOpen } from '../../functions/converter';
import MyButton from '../../components/MyButton';
import MyText from '../../components/MyText';
import Rating from '../../components/Rating';
import IconButton from '../../components/IconButton';
import MySearchbar from '../../components/MySearchBar';

function MercadoHeader({navigation, item}:
{navigation: StackNavigationProp<any, any>, item: any}) {
  return (
    <View style={[{backgroundColor: myColors.background, paddingBottom: 12}, globalStyles.notch]} >
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}} >
        <IconButton
          icon='arrow-left'
          size={24}
          color={myColors.primaryColor}
          type='back'
          onPress={() => {
            if (navigation.canGoBack()) return navigation.goBack()
            navigation.navigate('ListMercados')
          }} />
        <MyText style={{
          color: myColors.primaryColor,
          fontSize: 20,
          fontWeight: 'bold',
          alignSelf: 'center',
        }} >Mercado</MyText>
        <IconButton
          icon='share-variant'
          size={24}
          color={myColors.primaryColor}
          type='prodIcons'
          onPress={() => {
            Share.share({message: requests+'mercado?merc='+item.name})
          }} />
      </View>
      <View style={{ marginHorizontal: 16 }} >
        <Divider style={{backgroundColor: myColors.divider2, height: 1, marginBottom: 8, marginTop: -1}}/>
        <MySearchbar onSubmit={() => null} />
      </View>
    </View>
  )
}

function Mercado({navigation, route}:
{navigation: StackNavigationProp<any, any>, route: any}) {
  const [error, setError] = useState<'server'|'connection'|'nothing'|null>(null);
  const [tryAgain, setTryAgain] = useState(false);
  const [mercItem, setMercItem] = useState<mercModel>(route.params?.item);
  const [coords, setCoords] = useState<{lat: number|undefined, lon: number|undefined}>();
  const prodContext = useProdContext2();

  useEffect(() => {
    getActiveAddress()
      .then(address => setCoords({lat: address.latitude, lon: address.longitude}))
    if (mercItem) return;
    const mercName = route.params?.market? route.params.market : prodContext?.market;
    const city = route.params?.city? route.params.city : prodContext?.city;
    fetch(requests+`mercList.php?city=${city}&market=${mercName}`).then((response) => {
      response.json()
      .then((json) => {
        if (json[0] == 'nothing') return setError('nothing')
        setMercItem(createMercItem(json[0]))
      })
    }).catch(() => {
      setError('server')
    })
  }, [tryAgain]);

  if (error)
  return (
    <Errors
      error={error}
      onPress={() => {
        setError(null)
        setTryAgain(!tryAgain)
      }} />
  )
  
  if (!mercItem || !coords)
  return <Loading />

  const distance = coords.lat && coords.lon?
  computeDistance([coords.lat, coords.lon],[mercItem.latitude, mercItem.longitude]) : undefined;
  const {isOpen, openHour} = isMarketOpen(mercItem);
  
  let data: {icon: string, text: string}[] = [
    {icon: 'clock', text: `${isOpen ? 'Fecha' : 'Abre'} ás ${openHour}:00`},
    {icon: 'map-marker', text: `Á ${distance}km de você`},
    {icon: 'truck-fast', text: `${mercItem.time_min}-${mercItem.time_max}min • R$${mercItem.fee.toString()}`},
    {icon: 'currency-usd-circle', text: `Mínimo R$${mercItem.order_min.toString()}`},
  ]

  if (!distance) {
    data = data.filter(item => item.icon != 'map-marker')
  }

  return (
    <>
      {route.name != 'Mercado'? null :
      <MercadoHeader navigation={navigation} item={mercItem} />
      }
      <ProdList
        navigation={navigation}
        merc
        style={{backgroundColor: myColors.background, paddingBottom: 74}}
        header={({ key }: { key: number }) => (
        <>
          <View key={key} style={{flexDirection: 'row', paddingLeft: 16, paddingBottom: 2, marginTop: prodContext? 12 : 0}} >
            <View style={{paddingTop: 2}} >
              <Image
                containerStyle={{borderRadius: 8, height: 128, width: 128}}
                source={{uri: requests+'images/'+'mercado'/*item.id*/+'_full.webp'}}/>
                {mercItem.rating?
                  <View style={{height: 34, padding: 6, marginTop: -2, marginLeft: -2}} >
                    <Rating value={mercItem.rating} size={'medium'} />
                  </View> :
                  <MyText style={{height: 34, color: myColors.rating, fontSize: 16, fontFamily: 'Medium', padding: 6, marginTop: -2, width: 128, textAlign: 'center'}} >Novo!</MyText>
                }
              <MyTouchable
                onPress={() => navigation.navigate('MercRating', {merc: mercItem.name})} 
                style={{marginTop: -36, borderRadius: 4, width: 132, height: 36, marginLeft: -2}} >
              </MyTouchable>
            </View>
            <View>
              <View style={{flexDirection: 'row', marginLeft: 6}}>
                <MyButton
                  buttonStyle={{paddingVertical: 3}}
                  type='clear'
                  title={mercItem.name}
                  titleStyle={{color: myColors.text3, fontSize: 22}}
                  iconRight
                  icon={<Icon name='chevron-right' size={28} color={myColors.text3} style={{marginLeft: -2, marginTop: 3}} />}
                  onPress={() => navigation.navigate('MercInfo', device.web? {merc: mercItem.name} : {item: mercItem})} />
              </View>
              {
                data.map(( item, index ) => (
                <View key={index} style={{flexDirection: 'row',marginBottom: 4, marginLeft: 12, alignItems: 'center'}}>
                  <Icon name={item.icon} size={20} color={myColors.primaryColor}/>
                  <MyText style={{marginLeft: 4, color: myColors.text2}}>{item.text}</MyText>
                </View>
                ))
              }
            </View>
          </View>
          <ListHeader navigation={navigation} />
        </>
      )} />
    </>
  )
};

export default Mercado