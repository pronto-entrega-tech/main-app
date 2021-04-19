import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Button, Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useMyContext from '../../functions/MyContext';
import IconButton from '../../components/IconButton';
import { mercModel } from '../../components/MercItem';
import MyButton from '../../components/MyButton';
import { prodModel } from '../../components/ProdItem';
import ProdList from '../../components/ProdList';
import ProdListHorizontal from '../../components/ProdListHorizontal';
import { myColors, device, globalStyles } from '../../constants'; 
import { converter } from '../../functions';
import { getLongAddress, saveShoppingList, getActiveMarket, saveActiveMarketKey, saveOrdersList, getOrdersList, getActiveMarketKey } from '../../functions/dataStorage';
import validate from '../../functions/validate';
import { prodOrderModel } from '../Compras/Order';
import MyText from '../../components/MyText';
import requests from '../../services/requests';

export interface scheduleModel {
  dia: string,
  diaDoMes: number,
  horarios: string,
  scheduled: boolean,
}

const extraWidth = device.android?  0 : 10
function CartHeader({ navigation, entregar, setEntregar }:
  {navigation: StackNavigationProp<any, any>, entregar: boolean, setEntregar: React.Dispatch<React.SetStateAction<boolean>>}) {
  const {setShoppingList, setSubtotal, setActiveMarketKey} = useMyContext();
  return(
    <View style={{backgroundColor: myColors.background, marginTop: device.iPhoneNotch ? 34 : 0}} >
      <View style={styles.headerConteiner} >
        <IconButton
          icon='arrow-left'
          size={24}
          color={myColors.primaryColor}
          type='back'
          onPress={() => navigation.goBack()} />
        <View style={styles.headerButtonsConteiner} >
          <Button
            onPress={()=> setEntregar(true)} title='Entregar' type='clear'
            titleStyle={{color: entregar ? myColors.primaryColor : myColors.grey,}}
            buttonStyle={styles.headerButtons1} />
          <Button
            onPress={()=> setEntregar(false)} title='Retirar' type='clear'
            titleStyle={{color: !entregar ? myColors.primaryColor : myColors.grey}}
            buttonStyle={styles.headerButtons2} />
        </View>
        <Button onPress={()=> {
            navigation.goBack()
            setShoppingList(new Map)
            saveShoppingList(new Map)
            setSubtotal(0)
            setActiveMarketKey(0)
            saveActiveMarketKey(0)
          }}
          titleStyle={{color: myColors.primaryColor}} title='Limpar carrinho' type='clear' />
      </View>
      <Divider style={{height: 1, marginTop: -1, backgroundColor: myColors.divider2}} />
      <Divider style={[styles.indicator, {marginLeft: entregar ? 52 : 132+extraWidth, width: entregar ? 80+extraWidth : 70+extraWidth}]} />
    </View>
  )
}

function updateCart(shoppingList: Map<number, {quantity: number, item: prodModel}>,
  setSubtotal: (final: number)=>void, 
  setOff: (subtotal: number)=>void,
  setProdOrder: React.Dispatch<React.SetStateAction<prodOrderModel[]>>,
  setProdList: React.Dispatch<React.SetStateAction<prodModel[]>>) {
  var subtotal: number = 0
  var totalOff: number = 0
  var prodList: prodModel[] = []
  var prodOrder: prodOrderModel[] = []
  const keys = Array.from(shoppingList.keys());
  for (var i = 0; i < keys.length ;i++) {
    const key = keys[i]
    const quantity = shoppingList.get(key)?.quantity;
    const item = shoppingList.get(key)?.item;
    if (typeof item == 'undefined' || typeof quantity == 'undefined') return;
    subtotal = subtotal + (item.preco * quantity)
    if (item.precoAntes != null)
      totalOff = totalOff + ((item.precoAntes - item.preco) * quantity)
    prodList = [...prodList, item]
    prodOrder = [...prodOrder, {
      quantity: quantity.toString(),
      description: item.nome,
      price: item.preco.toString(),
      brand: item.marca,
      weight: item.quantidade,
    }]
  }
  setSubtotal(subtotal)
  setOff(totalOff)
  setProdOrder(prodOrder)
  setProdList(prodList)
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
    open = activeMarket.openSab;
    close = activeMarket.closeSab;
  } else if (weekday == 0) {
    open = activeMarket.openDom;
    close = activeMarket.closeDom;
  } else {
    open = activeMarket.open;
    close = activeMarket.close;
  }

  let open2 = Number.parseInt(open);
  let close2 = Number.parseInt(close);

  const dayText: string = hours < close2 ? 'Hoje' : 'Amanhã';
  const dayText2: number = hours < close2 ? day : day+1;

  const deliveryHour = hours+((min+Number.parseInt(activeMarket.minPrazo))/60)

  const isOpen = hours >= open2 && hours < close2;
  if (isOpen) {
    let schedule: scheduleModel = {
      dia: dayText,
      diaDoMes: dayText2,
      horarios: `${activeMarket.minPrazo} - ${activeMarket.maxPrazo} min`,
      scheduled: false,
    }
    scheduleList = [schedule]
    setActiveSchedule(schedule)
  } else {
    setActiveSchedule(null)
  }

  for (let i = open2; i < close2 ; i=i+2) {
    if (deliveryHour < i || hours >= close2) {
      let i2 = i+2 < close2 ? i+2 : close2;
      let schedule: scheduleModel = {
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
  const [readySubtotal, setReadySubtotal] = useState(false);
  const [readyActiveSchedule, setReadyActiveSchedule] = useState(false);
  const [readyAddress, setReadyAddress] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [entregar, setEntregar] = useState<boolean>(true);
  const [longAddress, setLongAddress] = useState<{rua: string, bairro: string} | null>(null);
  const [payment, setPayment] = useState<{title: string, sub: string}>(route.params?.payment);
  const [activeMarket, setActiveMarket] = useState<mercModel>();
  const [activeSchedule, setActiveSchedule] = useState<scheduleModel | null>(route.params?.activeSchedule);
  const [schedules, setSchedules] = useState<{isOpen: Boolean, list: scheduleModel[]}>({isOpen: false, list: []});
  const [off, setOff] = useState<number>(0);
  const [prodList, setProdList] = useState<prodModel[]>([]);
  const [ready, setReady] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>('');
  const [prodOrder, setProdOrder] = useState<prodOrderModel[]>([]);
  const {refresh, subtotal, setSubtotal, shoppingList, setShoppingList, setActiveMarketKey} = useMyContext();

  useEffect(() => {
    setIsLoading(true)
    setReadyActiveSchedule(false)
    getActiveMarket().then(activeMarket => {
      if (!activeMarket) {
        getActiveMarketKey().then(key => {
          if (key !== 0) {
            fetch(requests+'mercList.php')
              .then((response) => response.json())
              .then((json: mercModel[]) => setActiveMarket(json[0]))
              .catch((error) => console.error(error));
          }
        })
        setReadyActiveSchedule(true)
        return
      }
      setActiveMarket(activeMarket)
      updateSchedule(activeMarket, setSchedules, setActiveSchedule)
      setReadyActiveSchedule(true)
    })
  }, []);

  useEffect(() => {
    setReadySubtotal(false)
    updateCart(shoppingList, setSubtotal, setOff, setProdOrder, setProdList)
    setReadySubtotal(true)
  }, [refresh]);

  useEffect(() => {
    const callback = route.params?.callback;
    const value = route.params?.value;
    if (callback === 'refresh' || !longAddress) {
      getLongAddress().then(address => {
        setLongAddress(address)
        setReadyAddress(true)
      })
    }
    if (callback === 'activeSchedule') {
      setActiveSchedule(value)
    }
    if (callback === 'payment') {
      setPayment(value)
    }
  }, [route]);

  useEffect(() => {
    if (activeMarket) {
      if (subtotal < activeMarket.minPedido) {
        setReady(false)
        setButtonText('Subtotal mínimo de R$'+converter.toPrice(activeMarket.minPedido))
      } else if (longAddress?.rua == '') {
        setReady(false)
        setButtonText('Escolha um endereço')
      } else if (!validate([payment])) {
        setReady(false)
        setButtonText('Escolha um meio de pagamento')
      } else if (!validate([activeSchedule])) {
        setReady(false)
        setButtonText('Escolha um horário')
      } else {
        setReady(true)
        setButtonText('Fazer pedido')
      }
    }
  }, [subtotal, longAddress, payment, activeMarket, activeSchedule]);

  useEffect(() => {
    if (readySubtotal && readyActiveSchedule && readyAddress) {
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
  }, [readySubtotal, readyActiveSchedule, readyAddress]);

  if (prodList.length == 0) {
    return (
      <View style={{backgroundColor: myColors.background, flex: 1, justifyContent: 'center', alignItems: 'center',}}>
        <Text style={{fontSize: 15, color: myColors.text2}} >Carrinho vazio</Text>
      </View>
    )
  }

  if (isLoading) {
    return (
      <View style={{backgroundColor: myColors.background, flex: 1, justifyContent: 'center', alignItems: 'center'}} >
       <ActivityIndicator color={myColors.loading} size='large' />
      </View>
    )
  } else {
  return(
    <View style={[{backgroundColor: myColors.background, flex: 1}, device.web ? {height: device.height-56} : {}]} >
      <CartHeader navigation={navigation} entregar={entregar} setEntregar={setEntregar} />
      <ProdListHorizontal
        data={prodList}
        style={{paddingBottom: device.iOS ? 98 : 66}}
        navigation={navigation}
        header={() => (
        <View key={'0'}>
          <MyButton onPress={() => navigation.navigate('Address', {back: 'Cart'})} style={styles.addressConteiner} >
            <Icon name={entregar? 'home-map-marker':'map-marker-radius'} size={28} color={myColors.primaryColor} style={{marginLeft: -2}} />
            <View style={{marginLeft: 8}} >
              <Text style={styles.topText} >{entregar? 'Entregar':'Retirar'} em</Text>
              <Text style={styles.addressText} >{
                entregar? 
                longAddress?.rua != '' ? longAddress?.rua : 'Escolha um endereço' :
                activeMarket?.endereco
              }</Text>
              {entregar && longAddress?.bairro != '' && longAddress?.rua != '' ? <Text style={styles.addressSubtext} >{longAddress?.bairro}</Text> : null}
            </View>
            <Icon name='chevron-right' size={36} color={myColors.grey2} style={styles.rightIcon} />
          </MyButton>

          <Divider style={{height: 1, backgroundColor: myColors.divider3, marginHorizontal: 16}} />

          <MyButton onPress={()=>navigation.navigate('Payment',{t: converter.toPrice(subtotal+parseFloat(activeMarket.taxa))})} style={styles.addressConteiner} >
            <Icon name='credit-card-outline' size={28} color={myColors.primaryColor} />
            <View style={{marginLeft: 8}} >
              <Text style={styles.topText} >Meio de pagamento</Text>
              <Text style={styles.addressText} >{validate([payment?.title])? payment.title : 'Escolha um meio de pagamento'}</Text>
              {validate([payment?.sub])? <Text style={styles.addressSubtext} >{payment.sub}</Text> : null}
            </View>
            <Icon name='chevron-right' size={38} color={myColors.grey2} style={styles.rightIcon} />
          </MyButton>

          <Divider style={{height: 1, backgroundColor: myColors.divider3, marginHorizontal: 16}} />
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}} >
            <Text style={styles.scheduleText} >{
              activeSchedule == null ? 'Escolha um horário': activeSchedule.dia+', '+activeSchedule.horarios
            }</Text>
            {schedules.list != [] ?
            <Button
              title='Ver horários'
              onPress={()=> navigation.navigate('Schedule', {active: activeSchedule, list: schedules.list})}
              type='clear'
              containerStyle={{marginBottom: -4}}
              titleStyle={{color: myColors.primaryColor}}
              buttonStyle={{height: 36, paddingHorizontal: 16}} /> : null}
          </View>

          <ScrollView contentContainerStyle={styles.scheduleConteiner} showsHorizontalScrollIndicator={false} horizontal >
            {
              schedules.list.map((item, index) => {
                const active = item == activeSchedule;
                return (
                  <View key={index} >
                  <MyButton
                    onPress={() => {
                      setActiveSchedule(item)
                    }}
                    style={[styles.scheduleCardBase, active ? styles.scheduleCardActive : styles.scheduleCardInactive, active ? globalStyles.elevation4 : globalStyles.elevation1]}>
                    <>
                      <Text style={{color: active? myColors.primaryColor : myColors.text2, fontWeight: 'bold'}} >{
                        schedules.isOpen && index == 0 ? 'Padrão' : 'Agendar'
                      }</Text>
                      <Text style={{color: myColors.text4, fontSize: 15}} >{item.dia}</Text>
                      <Text style={{color: myColors.text4}} >{item.horarios}</Text>
                    </>
                  </MyButton>
                  </View>
                )
              })
            }
          </ScrollView>

          <Divider style={{height: 2, backgroundColor: myColors.divider2}} />
          <View style={{minHeight: 260, backgroundColor: '#FCFCFC'}}>
            <Text style={styles.orderTooText} >Peça também</Text>
            <ProdList
              horizontal
              style={{paddingRight: 8, paddingTop: 8}}
              navigation={navigation}
              title=''
              header={null} />
          </View>

          <Divider style={{height: 2, backgroundColor: myColors.divider2, marginBottom: 4}} />
          <View style={styles.priceConteiner}>
            <MyText style={styles.priceText} >Subtotal</MyText>
            <Text style={styles.priceText} >R${converter.toPrice(subtotal)}</Text>
          </View>
          <View style={styles.priceConteiner}>
            <Text style={styles.priceText} >Economizado</Text>
            <Text style={[styles.priceText, {color: '#E00000'}]} >R${converter.toPrice(off)}</Text>
          </View>
          <View style={styles.priceConteiner}>
            <Text style={styles.priceText} >{entregar? 'Taxa de entrega' : 'Retirada'}</Text>
            <Text style={[styles.priceText, activeMarket?.taxa == '0.00' || !entregar ? {color: '#109c00'} : null]} >{
            activeMarket?.taxa == '0.00' || !entregar ? 'Grátis' : 'R$'+converter.toPrice(activeMarket.taxa)
            }</Text>
          </View>
          <Divider style={{backgroundColor: myColors.divider3, marginHorizontal: 16}} />
          <View style={styles.priceTotalConteiner}>
            <Text style={styles.priceTotalText} >Total</Text>
            <Text style={styles.priceTotalText} >R${converter.toPrice(subtotal+Number.parseFloat(activeMarket.taxa))}</Text>
          </View>
          <Divider style={{height: 2, backgroundColor: myColors.divider2, marginTop: 4}} />
            <MyButton onPress={()=>navigation.navigate('CartCupons')} style={styles.cupomConteiner} >
              <Icon name='ticket-percent' size={48} color={myColors.primaryColor} />
              <View style={styles.cupomTextConteiner} >
                <Text style={{color: myColors.text5, fontSize: 16}} >Cupom</Text>
                <Text style={{color: myColors.text4}} >Insira um código</Text>
              </View>
              <Icon name='chevron-right' size={36} color={myColors.grey2} style={styles.rightIcon} />
            </MyButton>
          <Divider style={{height: 2, backgroundColor: myColors.divider2}} />
          <View style={styles.prodListTopbar} >
            <Text style={{color: myColors.text5, fontSize: 16}} >Lista de compras</Text>
            <Text style={{color: myColors.text5, fontSize: 16}} >{activeMarket.nome}</Text>
          </View>
        </View>
      )} />
      <Button
        title={buttonText}
        disabled={!ready}
        containerStyle={[styles.buttonConteiner]}
        buttonStyle={{backgroundColor: myColors.primaryColor, height: 58}}
        onPress={() => {
          setIsLoading(true)
          const scheduled = activeSchedule?.scheduled;
          const d = new Date();
          const orderDate = `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')} - ${d.getDay().toString().padStart(2, '0')}/${d.getMonth().toString().padStart(2, '0')}/${d.getFullYear()}`;
          var previsao: string;
          if (!scheduled) {
            const date1 = new Date(d.getTime() + (parseInt(activeMarket.minPrazo)*60000));
            const date2 = new Date(d.getTime() + (parseInt(activeMarket.maxPrazo)*60000));
            previsao = `${date1.getHours()}:${date1.getMinutes().toString().padStart(2, '0')} - ${date2.getHours()}:${date2.getMinutes().toString().padStart(2, '0')}`;
          } else {
            previsao = activeSchedule.horarios;
          }
          getOrdersList().then(list => {
            saveOrdersList([{
              nome: activeMarket.nome,
              mercPosition: activeMarket.position,
              pedido: list.length+1,
              prodList: prodOrder,
              scheduled: scheduled,
              previsao: previsao,
              date: orderDate,
              subtotal: subtotal,
              off: off,
              ship: parseInt(activeMarket.taxa),
              total: subtotal+parseInt(activeMarket.taxa),
              endereco: longAddress.rua+' - '+longAddress.bairro,
              pagamento: payment.title,
            }, ...list])
          saveShoppingList(new Map)
          setShoppingList(new Map)
          setSubtotal(0)
          setActiveMarketKey(0)
          saveActiveMarketKey(0)
          navigation.pop(1)
          navigation.navigate('ComprasTab',['Hi', {screen: 'Compras'}])
          })
        }} />
    </View>
  )}
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
    backgroundColor: myColors.primaryColor
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
    backgroundColor: '#FFF',
    position: 'absolute',
    bottom: device.iOS ? 36 : 6,
    alignSelf: 'center',
  }
})

export default Cart
