import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { Divider, Image } from 'react-native-elements';
import MyButton from '../../components/MyButton';
import MySearchbar from '../../components/MySearchBar';
import { myColors, globalStyles } from '../../constants';
import { getOrdersList } from '../../functions/dataStorage';
import validate from '../../functions/validate';
import requests from '../../services/requests';
import { orderModel } from './Order';

export function ComprasHeader() {
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.textHeader}>Compras</Text>
        <Divider style={styles.headerDivider}/>
      </View>
      <View style={{marginTop: 12, marginBottom: 8, paddingHorizontal: 16}} >
        <MySearchbar/>
      </View>
    </>
  )
}

function Compras({ navigation, route }:
  {navigation: StackNavigationProp<any, any>}) {
  const [isLoading, setIsLoading] = useState(true);
  const [ordersList, setOrdersList] = useState<orderModel[]>();

  useEffect(() => {
    console.log(route.params)
    getOrdersList()
      .then(list => setOrdersList(list))
  }, [route]);

  useEffect(() => {
    if (validate([ordersList])) {
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
  }, [ordersList]);

  const render_item = ({item}: {item: orderModel}) => {
    return (
    <MyButton
      onPress={()=> navigation.navigate('Order', ordersList.indexOf(item))}
      style={[styles.card, globalStyles.elevation3, globalStyles.darkBoader]} >
      <View style={{flexDirection: 'row'}} >
        <Image
          source={{uri: requests+'images/mercado.png'}}
          placeholderStyle={{backgroundColor: '#FFF'}}
          style={{height: 50, width: 50}} />
        <View style={{marginLeft: 16}} >
          <Text style={styles.mercName} >{item.nome}</Text>
          <Text style={styles.orderText} >Pedido em Andamento • {item.pedido.toString().padStart(3, '0')}</Text>
        </View>
      </View>
      <Divider style={{marginHorizontal: -4, marginTop: 10, marginBottom: 6}} />
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}} >
        <Text style={styles.previsionText} >{item.scheduled? 'Agendado para':'Previsão de entrega'}</Text>
        <Text style={styles.previsionTime} >{item.previsao}</Text>
      </View>
    </MyButton>
  )}

  if (isLoading) {
    return (
      <View style={{backgroundColor: myColors.background, flex: 1, justifyContent: 'center', alignItems: 'center'}} >
       <ActivityIndicator color={myColors.loading} size='large' />
      </View>
    )
  } else {
    if (ordersList?.length == 0) {
      return (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text style={{fontSize: 15, color: myColors.text2}} >Nenhum pedido realizado ainda</Text>
        </View>
      )
    } else {
      return (
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 50}}
          data={ordersList}
          keyExtractor={({pedido}) =>  pedido.toString()}
          renderItem={render_item} />
      )
    }
  }
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    height: 48,
  },
  textHeader: {
    color: myColors.primaryColor,
    fontSize: 18,
    alignSelf: 'center',
    position: 'absolute',
    fontFamily: 'Regular',
  },
  headerDivider: {
    marginTop: 47,
    backgroundColor: myColors.divider3,
    height: 1,
    marginHorizontal: 16,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  mercName: {
    marginTop: 2,
    fontSize: 16,
    color: myColors.text5,
    fontFamily: 'Regular',
  },
  orderText: {
    marginTop: 2,
    fontSize: 15,
    color: myColors.text3,
    fontFamily: 'Regular',
  },
  previsionText: {
    fontSize: 15,
    color: myColors.text4,
    fontFamily: 'Regular',
  },
  previsionTime: {
    fontSize: 18,
    color: myColors.text3,
    fontFamily: 'Medium',
  },
})

export default Compras