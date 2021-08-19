import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Animated } from 'react-native';
import { Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NetInfo from "@react-native-community/netinfo";
import useMyContext from '../../functions/MyContext';
import IconButton from '../../components/IconButton';
import { mercModel } from '../../components/MercItem';
import MyTouchable from '../../components/MyTouchable';
import MyButton from '../../components/MyButton';
import { prodModel } from '../../components/ProdItem';
import ProdList from '../../components/ProdList';
import ProdListHorizontal from '../../components/ProdListHorizontal';
import { myColors, device, globalStyles } from '../../constants';
import { getLongAddress, saveShoppingList, getActiveMarket, saveActiveMarketKey, saveOrdersList, getOrdersList, getActiveMarketKey, getLastPayment, saveLastPayment, getCity } from '../../functions/dataStorage';
import validate from '../../functions/validate';
import { prodOrderModel } from '../Compras/Order';
import MyText from '../../components/MyText';
import requests from '../../services/requests';
import { PaymentsStripe as Payment } from 'expo-payments-stripe'
import Header from '../../components/Header';
import { money, Money, createMercItem, createProdList, moneyToString } from '../../functions/converter';
import Loading, { Errors } from '../../components/Loading';

export interface scheduleModel {
  dia: string,
  diaDoMes: number,
  horarios: string,
  scheduled: boolean,
}

const extraWidth = device.android?  0 : 10
function CartHeader({navigation, entregar, setEntregar, setIsLoading}:
{navigation: StackNavigationProp<any, any>, entregar: boolean,
  setEntregar: React.Dispatch<React.SetStateAction<boolean>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>}) {
  const {setShoppingList, setSubtotal, setActiveMarketKey} = useMyContext();
  const [state] = React.useState({
    indicator: new Animated.Value(0),
  })

  useEffect(() => {
    if (entregar) {
      Animated.timing(state.indicator, { toValue: 0, duration: 175, useNativeDriver: true }).start();
    } else {
      Animated.timing(state.indicator, { toValue: 80+extraWidth, duration: 175, useNativeDriver: true }).start();
    }
  }, [entregar])

  return(
    <View style={[{backgroundColor: myColors.background}, globalStyles.notch]} >
      <View style={styles.headerConteiner} >
        <IconButton
          icon='arrow-left'
          size={24}
          color={myColors.primaryColor}
          type='back'
          onPress={() => navigation.goBack()} />
        <View style={styles.headerButtonsConteiner} >
          <MyButton
            onPress={()=> setEntregar(true)} title='Entregar' type='clear'
            titleStyle={{color: entregar ? myColors.primaryColor : myColors.grey}}
            buttonStyle={styles.headerButtons1} />
          <MyButton
            onPress={()=> setEntregar(false)} title='Retirar' type='clear'
            titleStyle={{color: !entregar ? myColors.primaryColor : myColors.grey}}
            buttonStyle={styles.headerButtons2} />
        </View>
        <MyButton onPress={()=> {
            setIsLoading(true)
            setTimeout(() => {
              setShoppingList(new Map)
              saveShoppingList(new Map)
              setActiveMarketKey('')
              saveActiveMarketKey('')
              setSubtotal(money('0'))
            }, 50)
            setTimeout(() => {
              navigation.goBack()
            }, 300)
          }}
          titleStyle={{color: myColors.primaryColor}} title='Limpar carrinho' type='clear' />
      </View>
      <Divider style={{height: 1, marginTop: -1, backgroundColor: myColors.divider2}} />
      <Animated.View style={[styles.indicator, {transform: [{translateX: state.indicator}], width: entregar ? 80+extraWidth : 70+extraWidth}]} />
    </View>
  )
}

function updateCart(shoppingList: Map<string, {quantity: number, item: prodModel}>,
  setSubtotal: (subtotal: Money) => void, 
  setOff: (off: Money) => void,
  setTotal: (total: Money) => void,
  setProdOrder: React.Dispatch<React.SetStateAction<prodOrderModel[]>>,
  setProdList: React.Dispatch<React.SetStateAction<prodModel[] | undefined>>,
  setReadySubtotal: React.Dispatch<React.SetStateAction<boolean>>) {
  var subtotal = money('0')
  var totalOff = money('0')
  var prodList: prodModel[] = []
  var prodOrder: prodOrderModel[] = []
  const keys = Array.from(shoppingList.keys());
  for (var i = 0; i < keys.length ;i++) {
    const key = keys[i]
    const quantity = shoppingList.get(key)?.quantity;
    const item = shoppingList.get(key)?.item;
    if (!item || !quantity) return;
    subtotal.add(item.price.value * quantity)
    if (item.price_before)
      totalOff.add((item.price_before.value - item.price.value) * quantity)
    prodList = [...prodList, item]
    prodOrder = [...prodOrder, {
      quantity: quantity.toString(),
      description: item.name,
      price: item.price.toString(),
      brand: item.brand,
      weight: item.weight,
    }]
  }
  setSubtotal(subtotal)
  setOff(totalOff)
  setTotal(money((subtotal.value + totalOff.value).toString()))
  setProdOrder(prodOrder)
  setProdList(prodList)

  setReadySubtotal(true)
}

function updateSchedule(activeMarket: mercModel,
  setSchedules: React.Dispatch<React.SetStateAction<{isOpen: Boolean, list: scheduleModel[]}>>, 
  setActiveSchedule: React.Dispatch<React.SetStateAction<scheduleModel | null>>) {
  let scheduleList: scheduleModel[] = []
  const date = new Date();
  const min = date.getMinutes();
  const hours = date.getHours();
  const day = date.getDate();
  const weekday = date.getDay();
  let open;
  let close;
  if (weekday == 6) {
    open = activeMarket.open_sat;
    close = activeMarket.close_sat;
  } else if (weekday == 0) {
    open = activeMarket.open_sun;
    close = activeMarket.close_sun;
  } else {
    open = activeMarket.open;
    close = activeMarket.close;
  }

  let open2 = open;
  let close2 = close;

  const dayText: string = hours < close2 ? 'Hoje' : 'Amanhã';
  const dayText2: number = hours < close2 ? day : day+1;

  const deliveryHour = hours+(min+activeMarket.time_min)/60

  const isOpen = hours >= open2 && hours < close2;
  if (isOpen) {
    const schedule: scheduleModel = {
      dia: dayText,
      diaDoMes: dayText2,
      horarios: `${activeMarket.time_min} - ${activeMarket.time_max} min`,
      scheduled: false,
    }
    scheduleList = [schedule]
    setActiveSchedule(schedule)
  } else {
    setActiveSchedule(null)
  }

  for (let i = open2; i < close2 ; i=i+2) {
    if (deliveryHour < i || hours >= close2) {
      const i2 = i+2 < close2 ? i+2 : close2;
      const schedule: scheduleModel = {
        dia: dayText,
        diaDoMes: dayText2,
        horarios: `${i}:00 - ${i2}:00`,
        scheduled: true,
      }
      scheduleList = [...scheduleList, schedule]
    }
  }
  setSchedules({isOpen: isOpen, list: scheduleList})
}

function Cart({ navigation, route }:
{navigation: StackNavigationProp<any, any>, route: any}) {
  const [tryAgain, setTryAgain] = useState(false);
  const [error, setError] = useState<'server'|'connection'|'nothing'|null>(null);
  const [readySubtotal, setReadySubtotal] = useState(false);
  const [readyActiveMarket, setReadyActiveMarket] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [entregar, setEntregar] = useState<boolean>(true);
  const [longAddress, setLongAddress] = useState<{rua: string, bairro: string} | null>(null);
  const [payment, setPayment] = useState<{title: string, sub: string}>(route.params?.payment);
  const [activeMarket, setActiveMarket] = useState<mercModel>();
  const [activeSchedule, setActiveSchedule] = useState<scheduleModel | null>(route.params?.activeSchedule);
  const [schedules, setSchedules] = useState<{isOpen: Boolean, list: scheduleModel[]}>({isOpen: false, list: []});
  const [cartSubtotal, setCartSubtotal] = useState<Money>(money('0'));
  const [off, setOff] = useState<Money>();
  const [total, setTotal] = useState<Money>();
  const [prodList, setProdList] = useState<prodModel[]>();
  const [buyTooList, setBuyTooList] = useState<prodModel[]>();
  const [ready, setReady] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>('');
  const [prodOrder, setProdOrder] = useState<prodOrderModel[]>([]);
  const {isGuest, refresh, shoppingList, setShoppingList, setActiveMarketKey, setSubtotal} = useMyContext();

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(NetInfoChangeHandler => {
      if (NetInfoChangeHandler.isInternetReachable == false) {
        setError('connection')
      } else {
        setError(null)
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    setReadyActiveMarket(false)

    getLastPayment()
    .then(lastPayment => {if (lastPayment) setPayment(lastPayment)})

    const setup = (activeMarket: mercModel) => {
      fetch(requests+`prodList.php?market=${activeMarket}`)
      .then((response) => response.json())
      .then((json) => setBuyTooList(createProdList(json)))
      .catch(() => setError('server'));

      setActiveMarket(activeMarket)
      updateSchedule(activeMarket, setSchedules, setActiveSchedule)
      setReadyActiveMarket(true)
    }

    getActiveMarket().then(activeMarket => {
      if (activeMarket)
      return setup(activeMarket)

      getActiveMarketKey().then(key => {
        if (key == '') return
        getCity().then(city => {
          fetch(requests+`mercList.php?city=${city}&market=${key}`)
            .then((response) => response.json())
            .then((json: mercModel[]) => createMercItem(json[0]))
            .then((activeMarket) => setup(activeMarket))
            .catch(() => setError('server'));
        })
      })
    })
  }, []);

  useEffect(() => {
    setReadySubtotal(false)
    updateCart(shoppingList, setCartSubtotal, setOff, setTotal, setProdOrder, setProdList, setReadySubtotal)
  }, [refresh]);

  useEffect(() => {
    const callback = route.params?.callback;
    const value = route.params?.value;
    if (callback === 'refresh' || !longAddress) {
      getLongAddress().then(address => {
        setLongAddress(address)
      })
    }
    if (callback === 'activeSchedule') {
      setActiveSchedule(value)
    }
    if (callback === 'payment') {
      setPayment(value)
      saveLastPayment(value)
    }
  }, [route]);

  useEffect(() => {
    if (activeMarket) {
      if (cartSubtotal.value < activeMarket.order_min.value) {
        setReady(false)
        setButtonText('Subtotal mínimo de R$'+moneyToString(activeMarket.order_min))
      } else if (longAddress?.rua == '') {
        setReady(false)
        setButtonText('Escolha um endereço')
      } else if (!payment && !isGuest) {
        setReady(false)
        setButtonText('Escolha um meio de pagamento')
      } else if (!activeSchedule) {
        setReady(false)
        setButtonText('Escolha um horário')
      } else if (isGuest) {
        setReady(false)
        setButtonText('Entre ou cadastre-se')
      } else {
        setReady(true)
        setButtonText('Fazer pedido')
      }
    }
  }, [cartSubtotal, longAddress, payment, activeMarket, activeSchedule, isGuest]);

  useEffect(() => {
    if (readySubtotal && readyActiveMarket) {
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
  }, [readySubtotal, readyActiveMarket]);

  const makePayment = async () => {
    if (!(activeMarket && activeSchedule && off && total && longAddress)) return;
    try {
      //only on bare
      if (['ApplePay', 'GooglePay'].includes(payment.title)) {
        const token = await Payment.paymentRequestWithNativePayAsync(device.android? 
        {
          total_price: total.toString(),
          currency_code: 'BRL',
          line_items: [{
            currency_code: 'BRL',
            description: 'Poupa Preço',
            total_price: '50',
            unit_price: '10',
            quantity: '5'
          }]
        }: 
        {
          shippingMethods: [],
          currencyCode: 'BRL',
          countryCode: 'BR'
        }, [{label: 'Poupa Preço', amount: total.toString()}])

        Payment.completeNativePayRequestAsync()
      }
      
      setIsLoading(true)
      const scheduled = activeSchedule.scheduled;
      const d = new Date();
      const orderDate = `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')} - ${d.getDay().toString().padStart(2, '0')}/${d.getMonth().toString().padStart(2, '0')}/${d.getFullYear()}`;
      var previsao: string;
      if (!scheduled) {
        const date1 = new Date(d.getTime() + activeMarket.time_min * 60000);
        const date2 = new Date(d.getTime() + activeMarket.time_max * 60000);
        previsao = `${date1.getHours()}:${date1.getMinutes().toString().padStart(2, '0')} - ${date2.getHours()}:${date2.getMinutes().toString().padStart(2, '0')}`;
      } else {
        previsao = activeSchedule.horarios;
      }
      getOrdersList().then(list => {
        saveOrdersList([{
          nome: activeMarket.name,
          mercKey: activeMarket.id,
          pedido: list.length+1,
          prodList: prodOrder,
          scheduled: scheduled,
          previsao: previsao,
          date: orderDate,
          subtotal: cartSubtotal.toString(),
          off: off.toString(),
          ship: activeMarket.fee.toString(),
          total: moneyToString(cartSubtotal.value + activeMarket.fee.value),
          endereco: longAddress.rua+' - '+longAddress.bairro,
          pagamento: payment.title,
        }, ...list])
        .then(() => {
          saveShoppingList(new Map)
          setShoppingList(new Map)
          setSubtotal(money('0'))
          setCartSubtotal(money('0'))
          setActiveMarketKey('')
          saveActiveMarketKey('')

          if (payment.title == 'Dinheiro')
          saveLastPayment({title: 'Dinheiro', sub: 'Sem troco'})

          navigation.pop(1)
          navigation.navigate('ComprasTab', [{screen: 'Compras'}, `redirect`])
        })
      })
    } catch (error) {
      Payment.cancelNativePayRequestAsync()
      setIsLoading(false)
    }
  }

  if (prodList?.length == 0)
  return (
    <>
      <Header navigation={navigation} title='' />
      <View style={{backgroundColor: myColors.background, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <MyText style={{fontSize: 15, color: myColors.text2}} >Carrinho vazio</MyText>
      </View>
    </>
  )

  if (error)
  return (
    <>
      <Header navigation={navigation} title='' />
      <Errors
        error={error}
        onPress={() => {
          setError(null)
          setTryAgain(!tryAgain)
        }} />
    </>
  )

  if (isLoading)
  return <Loading/>

  const ListHeader = () => {
    return (
      <View key={'0'}>
        {!isGuest? null :
        <>
          <View style={{paddingHorizontal: 16, paddingVertical: 12}} >
            <MyText
              style={{color: myColors.text2, fontSize: 20, fontFamily: 'Medium'}} >
              Falta pouco!
            </MyText>
            <MyText
              style={{marginTop: 8, color: myColors.text, fontSize: 16}} >
              Pra concluir o pedido, precisamos que você se identifique primeiro.
            </MyText>
            <MyButton
              title='Entrar ou cadastrar-se'
              buttonStyle={{marginTop: 12}}
              onPress={()=>navigation.navigate('SignIn', 'c')} />
          </View>
          <Divider style={styles.divider2} />
        </>
        }

        <MyTouchable disabled={!entregar} onPress={() => navigation.navigate('Address', {back: 'Cart'})} style={styles.addressConteiner} >
          <Icon name={entregar? 'home-map-marker':'map-marker-radius'} size={28} color={myColors.primaryColor} style={{marginLeft: -2}} />
          <View style={{marginLeft: 8}} >
            <MyText style={styles.topText} >{entregar? 'Entregar':'Retirar'} em</MyText>
            <MyText style={styles.addressText} >{
              entregar?
              !longAddress? 'Carregando...' : 
              longAddress.rua != '' ? longAddress.rua : 'Escolha um endereço' :
              activeMarket?.address
            }</MyText>
            {entregar && longAddress?.bairro != '' && longAddress?.rua != '' ? <MyText style={styles.addressSubtext} >{longAddress?.bairro}</MyText> : null}
          </View>
          {entregar? <Icon name='chevron-right' size={36} color={myColors.grey2} style={styles.rightIcon} />:null}
        </MyTouchable>

        <Divider style={styles.divider} />

        {isGuest? null :
        <>
        <MyTouchable onPress={()=>navigation.navigate('Payment',{t: total})} style={styles.addressConteiner} >
          <Icon name='credit-card-outline' size={28} color={myColors.primaryColor} />
          <View style={{marginLeft: 8}} >
            <MyText style={styles.topText} >Meio de pagamento</MyText>
            <MyText style={styles.addressText} >{validate([payment?.title])? payment.title : 'Escolha um meio de pagamento'}</MyText>
            {validate([payment?.sub])? <MyText style={styles.addressSubtext} >{payment.sub}</MyText> : null}
          </View>
          <Icon name='chevron-right' size={36} color={myColors.grey2} style={styles.rightIcon} />
        </MyTouchable>
        <Divider style={styles.divider} />
        </>
        }

        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}} >
          <MyText style={styles.scheduleText} >{
            activeSchedule == null ? 'Escolha um horário': activeSchedule.dia+', '+activeSchedule.horarios
          }</MyText>
          {schedules.list != [] ?
          <MyButton
            title='Ver horários'
            onPress={()=> navigation.navigate('Schedule', {active: activeSchedule, list: schedules.list})}
            type='clear'
            titleStyle={{color: myColors.primaryColor}}
            buttonStyle={{minHeight: 0, marginBottom: -4, height: 36, paddingHorizontal: 16}} /> : null}
        </View>

        <ScrollView contentContainerStyle={styles.scheduleConteiner} showsHorizontalScrollIndicator={false} horizontal >
          {
            schedules.list.map((item, index) => {
              const active = item == activeSchedule;
              return (
                <View key={index} style={{borderRadius: 10}} >
                  <MyTouchable
                    onPress={() => {
                      setActiveSchedule(item)
                    }}
                    style={[styles.scheduleCardBase, active ? styles.scheduleCardActive : styles.scheduleCardInactive, active ? globalStyles.elevation4 : globalStyles.elevation1]}>
                    <>
                      <MyText style={{color: active? myColors.primaryColor : myColors.text2, fontWeight: 'bold'}} >{
                        schedules.isOpen && index == 0 ? 'Padrão' : 'Agendar'
                      }</MyText>
                      <MyText style={{color: myColors.text4, fontSize: 15}} >{item.dia}</MyText>
                      <MyText style={{color: myColors.text4}} >{item.horarios}</MyText>
                    </>
                  </MyTouchable>
                </View>
              )
            })
          }
        </ScrollView>

        <Divider style={styles.divider2} />
        <View style={{minHeight: 266, backgroundColor: '#FCFCFC'}}>
          <MyText style={styles.orderTooText} >Peça também</MyText>
          {!buyTooList? <Loading/> :
          <ProdList
            horizontal
            refreshless
            style={{paddingRight: 8, paddingTop: 8}}
            navigation={navigation}
            header={null}
            data={buyTooList} />
          }
        </View>

        <Divider style={[styles.divider2, {marginBottom: 4}]} />
        <View style={styles.priceConteiner}>
          <MyText style={styles.priceText} >Subtotal</MyText>
          <MyText style={styles.priceText} >R${cartSubtotal.toString()}</MyText>
        </View>
        <View style={styles.priceConteiner}>
          <MyText style={styles.priceText} >Economizado</MyText>
          <MyText style={[styles.priceText, {color: '#E00000'}]} >R${off?.toString()}</MyText>
        </View>
        <View style={styles.priceConteiner}>
          <MyText style={styles.priceText} >{entregar? 'Taxa de entrega' : 'Retirada'}</MyText>
          <MyText style={[styles.priceText, activeMarket?.fee.value == 0 || !entregar ? {color: '#109c00'} : null]} >{
          activeMarket?.fee.value == 0 || !entregar ? 'Grátis' : 'R$'+moneyToString(activeMarket?.fee)
          }</MyText>
        </View>
        <Divider style={{backgroundColor: '#DDD', marginHorizontal: 16}} />
        <View style={styles.priceTotalConteiner}>
          <MyText style={styles.priceTotalText} >Total</MyText>
          <MyText style={styles.priceTotalText} >R${total?.toString()}</MyText>
        </View>
        <Divider style={[styles.divider2, {marginTop: 4}]} />
          <MyTouchable onPress={()=>navigation.navigate('CartCupons')} style={styles.cupomConteiner} >
            <Icon name='ticket-percent' size={48} color={myColors.primaryColor} />
            <View style={styles.cupomTextConteiner} >
              <MyText style={{color: myColors.text5, fontSize: 16}} >Cupom</MyText>
              <MyText style={{color: myColors.text4}} >Insira um código</MyText>
            </View>
            <Icon name='chevron-right' size={36} color={myColors.grey2} style={styles.rightIcon} />
          </MyTouchable>
        <Divider style={styles.divider2} />
        <View style={styles.prodListTopbar} >
          <MyText style={{color: myColors.text5, fontSize: 16}} >Lista de compras</MyText>
          <MyText style={{color: myColors.text5, fontSize: 16}} >{activeMarket?.name}</MyText>
        </View>
      </View>
    )
  }

  return (
    <View style={[{backgroundColor: myColors.background}, device.web ? {height: device.height} : {flex: 1}]} >
      <CartHeader navigation={navigation} entregar={entregar} setEntregar={setEntregar} setIsLoading={setIsLoading} />
      <ProdListHorizontal
        style={{paddingBottom: device.iOS ? 98 : 66}}
        navigation={navigation}
        header={ListHeader}
        data={prodList} />
      <MyButton
        title={buttonText}
        disabled={!ready}
        buttonStyle={styles.buttonConteiner}
        onPress={makePayment} />
    </View>
  )
}

const styles = StyleSheet.create({
  headerConteiner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButtonsConteiner: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 52
  },
  indicator: {
    marginTop: -2,
    height: 2,
    backgroundColor: myColors.primaryColor,
    marginLeft: 52,
  },
  headerButtons1: {
    height: 56,
    width: 80+extraWidth,
    justifyContent: 'center',
  },
  headerButtons2: {
    height: 56,
    width: 70+extraWidth,
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: myColors.divider3,
    marginHorizontal: 16
  },
  divider2: {
    height: 2,
    backgroundColor: myColors.divider
  },
  addressConteiner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingLeft: 12
  },
  topText: {
    color: myColors.text4
  },
  addressText: {
    marginRight: 48,
    fontSize: 16,
    color: myColors.text5
  },
  addressSubtext: {
    marginRight: 48,
    color: myColors.text
  },
  scheduleText: {
    marginLeft: 16,
    top: device.iOS ? 6 : 2,
    color: myColors.text5,
    fontSize: 16
  },
  scheduleButton: {
    marginLeft: 16,
    top: 8.5,
    color: myColors.text5,
    fontSize: 16
  },
  scheduleConteiner: {
    paddingRight: 8
  },
  scheduleCardBase: {
    marginLeft: 8,
    marginTop: 6,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minWidth: 92,
    borderRadius: 10
  },
  scheduleCardActive: {
    borderColor: myColors.primaryColor,
    backgroundColor: '#FFF',
    borderWidth: 1.5
  },
  scheduleCardInactive: {
    borderColor: myColors.divider,
    backgroundColor: myColors.background,
    borderWidth: 1
  },
  orderTooText: {
    height: 30,
    marginLeft: 16,
    paddingTop: 8,
    color: myColors.text5,
    fontSize: 16
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
  cupomConteiner: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cupomTextConteiner: {
    marginLeft: 8,
  },
  rightIcon: {
    position: 'absolute',
    right: 0
  },
  prodListTopbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 12
  },
  buttonConteiner: {
    width: '95%',
    position: 'absolute',
    bottom: device.iOS ? 36 : 6,
    alignSelf: 'center',
    height: 58,
  }
})

export default Cart
