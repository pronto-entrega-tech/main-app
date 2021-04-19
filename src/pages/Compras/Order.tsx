import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, ImageURISource } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { myColors, device, images } from '../../constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Image,  Divider } from 'react-native-elements';
import { converter } from '../../functions';
import { getOrdersList } from '../../functions/dataStorage';
import validate from '../../functions/validate';
import requests from '../../services/requests';

export interface orderModel {
  nome: string,
  mercPosition: number,
  pedido: number,
  prodList: prodOrderModel[],
  previsao: string,
  scheduled: boolean,
  date: string,
  subtotal: number,
  off: number,
  ship: number,
  total: number,
  endereco: string,
  pagamento: string,
}
export interface prodOrderModel {
  quantity: string,
  description: string,
  price: string,
  brand: string,
  weight: string,
}

function Order({route}: {route: any}) {
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<orderModel>();
  const orderIndex: number = route.params;
  
  useEffect(() => {
    getOrdersList()
      .then(list => setOrder(list[orderIndex]))
  }, []);

  useEffect(() => {
    if (validate([order])) {
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
  }, [order]);

  const space = (device.width-40)/5
  var iconPaymento: ImageURISource;
  const pay = order?.pagamento;
  if (pay?.includes('Dinheiro')) {
    iconPaymento = images.cash;
  } else {
    iconPaymento = images.creditCard;
  }
  console.log(pay, iconPaymento)

  const header = () => (
    <View key={-1} >
      <View style={{marginHorizontal: 16, marginVertical: 12}}>
        <Text style={styles.previsionText} >{order?.scheduled? 'Agendado para':'Previsão de entrega'}</Text>
        <Text style={styles.previsionTime} >{order?.previsao}</Text>
      </View>
      <View style={{flexDirection: 'row', marginHorizontal: 16}} >
        <ProgressBar color={myColors.colorAccent} indeterminate style={{width: space}} />
        <ProgressBar color={myColors.divider3} style={{marginLeft: 8, width: space*4}} />
      </View>
      <View style={{flexDirection: 'row', marginHorizontal: 16, height: 40, alignItems: 'center'}} >
        <Icon name='circle' color='green' size={8} />
        <Text style={styles.steps} >Aguardado confirmação do mercado</Text>
      </View>
      <Divider style={styles.divider} />
      <View style={styles.mercConteiner} >
        <Image
          source={{uri: requests+'images/mercado.png'}}
          placeholderStyle={{backgroundColor: '#FFF'}}
          style={{height: 65, width: 65}} />
        <Text style={styles.mercName} >{order?.nome}</Text>
      </View>
      <View style={styles.infoConteiner}>
        <Text style={styles.text} >Realizado {order?.date}</Text>
        <Text style={styles.text} >Pedido {order?.pedido.toString().padStart(3, '0')}</Text>
      </View>
      <Divider style={styles.divider} />
        <View style={{marginHorizontal: 16, marginVertical: 12}}>
          <Text style={styles.text} >Endereço de entrega</Text>
          <Text style={styles.address} >{order?.endereco}</Text>
        </View>
      <Divider style={styles.divider} />
        <View style={styles.paymentConteiner} >
          <Text style={styles.text} >Pagar na entrega</Text>
          <Text style={styles.paymentText} >{order?.pagamento}</Text>
          <Image source={iconPaymento} resizeMode='contain' containerStyle={{position: 'absolute', right: 0, width: 28, height: 28}} style={{top: 2}} />
        </View>
      <Divider style={styles.divider} />
      <View style={styles.priceConteiner}>
        <Text style={styles.priceText} >Subtotal</Text>
        <Text style={styles.priceText} >R${converter.toPrice(order.subtotal)}</Text>
      </View>
      <View style={styles.priceConteiner}>
        <Text style={styles.priceText} >Economizado</Text>
        <Text style={styles.priceText} >R${converter.toPrice(order.off)}</Text>
      </View>
      <View style={styles.priceConteiner}>
        <Text style={styles.priceText} >Taxa de entrega</Text>
        <Text style={[styles.priceText, order?.ship == 0 ? {color: '#10b500'} : null]} >{
        order?.ship == 0 ? 'Grátis' : 'R$'+converter.toPrice(order.ship)
        }</Text>
      </View>
      <Divider style={{backgroundColor: myColors.divider3, marginHorizontal: 16}} />
      <View style={styles.priceTotalConteiner}>
        <Text style={styles.priceTotalText} >Total</Text>
        <Text style={styles.priceTotalText} >R${converter.toPrice(order.total)}</Text>
      </View>
      <Divider style={styles.divider} />
    </View>
  )

  const render_item = ({item}: {item: prodOrderModel}) => (
    <>
      <View style={{flexDirection: 'row', paddingTop: 10, paddingHorizontal: 16, alignItems: 'center'}} >
        <Text style={styles.quantity} >1x</Text>
        <View style={{marginLeft: 18}} >
          <Text style={styles.description} >{item.description}</Text>
          <Text style={styles.price} >R${converter.toPrice(item.price)}</Text>
          <View style={{flexDirection: 'row'}} >
            <Text style={styles.brand} >{item.brand}</Text>
            <Text style={styles.weight} >{item.weight}</Text>
          </View>
        </View>
      </View>
      <Divider style={{marginHorizontal: 12, marginTop: 12}} />
    </>
  )

  if (isLoading) {
    return (
      <View style={{backgroundColor: myColors.background, flex: 1, justifyContent: 'center', alignItems: 'center'}} >
       <ActivityIndicator color={myColors.loading} size='large' />
      </View>
    )
  } else {
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 50}}
        data={order.prodList}
        keyExtractor={({description}) => description}
        ListHeaderComponent={header}
        renderItem={render_item} />
    )
  }
}


const styles = StyleSheet.create({
  divider: {
    height: 2,
    backgroundColor: myColors.divider2
  },
  text: {
    fontFamily: 'Regular',
    color: myColors.text4,
    fontSize: 16,
  },
  previsionText: {
    fontFamily: 'Regular',
    color: myColors.text3,
  },
  previsionTime: {
    fontFamily: 'Medium',
    color: myColors.text3,
    fontSize: 24,
  },
  steps: {
    marginLeft: 8,
    fontFamily: 'Medium',
    color: myColors.text3,
    fontSize: 14,
  },
  mercName: {
    marginLeft: 14,
    fontFamily: 'Medium',
    color: myColors.text3,
    fontSize: 24,
  },
  mercConteiner: {
    flexDirection: 'row',
    marginVertical: 12,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  infoConteiner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginHorizontal: 16,
  },
  address: {
    fontFamily: 'Condensed',
    color: myColors.text5,
    fontSize: 16,
  },
  paymentConteiner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12
  },
  paymentText: {
    fontFamily: 'Regular',
    color: myColors.text5,
    fontSize: 16,
    marginRight: 34
  },
  priceConteiner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 6
  },
  priceTotalConteiner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 8
  },
  priceText: {
    fontSize: 16,
    color: myColors.text4
  },
  priceTotalText: {
    fontSize: 20,
    color: myColors.text5
  },
  quantity: {
    fontFamily: 'Medium',
    color: myColors.text3,
    fontSize: 16,
  },
  description: {
    fontFamily: 'Condensed',
    color: myColors.text4,
    fontSize: 14,
  },
  price: {
    fontFamily: 'Medium',
    color: myColors.text3,
    fontSize: 16,
    marginTop: 4,
  },
  brand: {
    fontFamily: 'Regular',
    color: myColors.text4,
    fontSize: 14,
  },
  weight: {
    fontFamily: 'Regular',
    color: myColors.text4,
    fontSize: 14,
    marginLeft: 4,
  },
})

export default Order