import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { View, Text, Image, ImageURISource, ScrollView, StyleSheet, Keyboard } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Portal } from 'react-native-paper';
import BottomModal from '../../components/BottomModal';
import MyButton from '../../components/MyButton';
import MyTouchable from '../../components/MyTouchable';
import { myColors, device, images } from '../../constants';
import { money, Money, moneyToString } from '../../functions/converter';

interface iconText {
  icon?: ImageURISource,
  text: string,
  payment?: {title: string, sub: string},
}

const payments: iconText[] = [
  {icon: images.cash, text: 'Dinheiro', payment: {title: 'Dinheiro', sub: ''}},

  {text: 'Crédito'},
  {icon: images.mastercard, text: 'Mastercard', payment: {title: 'Crédito Mastercard', sub: 'máquininha'}},
  {icon: images.visa, text: 'Visa', payment: {title: 'Crédito Visa', sub: 'máquininha'}},
  {icon: images.elo, text: 'Elo', payment: {title: 'Crédito Elo', sub: 'máquininha'}},

  {text: 'Débito',},
  {icon: images.mastercard, text: 'Mastercard', payment: {title: 'Débito Mastercard', sub: 'máquininha'}},
  {icon: images.visa, text: 'Visa', payment: {title: 'Débito Visa', sub: 'máquininha'}},
  {icon: images.elo, text: 'Elo', payment: {title: 'Débito Elo', sub: 'máquininha'}},
]

function PaymentOnDelivery({navigation, route}: 
{navigation: StackNavigationProp<any, any>, route: any}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [troco, setTroco] = useState('0,00');
  const total: Money = route.params.t

  const trocoMask = (v: string) => {
    v = v.replace(/\D/g, '')

    if (v.length > 3)
    v = parseInt(v).toString();

    v = v.padStart(3, '0')
    v = v.substring(0,v.length-2)+','+v.substring(v.length-2)
    setTroco(v)
  }

  const renderItem = (item: iconText, index: number) => {
    if (item.icon == null) {
      return (
        <Text key={index} style={styles.title} >{item.text}</Text>
      )
    } else {
      return (
      <View key={index} >
        <MyTouchable
          onPress={()=> {
              if (index == 0) {
                setModalVisible(true)
              } else {
                navigation.navigate('Cart', {callback: 'payment', value: item.payment})
              }
            }}
          style={[styles.card]} >
          <Image style={{width: 38, height: 38 }} source={item.icon}  />
          <Text style={{fontSize: 15, fontFamily: 'Medium', color: myColors.text2, marginLeft: 16}} >{item.text}</Text>
        </MyTouchable>
      </View>
    )
  }}

  const _keyboardDidShow = () => setKeyboardVisible(true);
  const _keyboardDidHide = () => setKeyboardVisible(false);

  React.useEffect(() => {
    if (!device.iPhoneNotch) return
    Keyboard.addListener('keyboardWillShow', _keyboardDidShow)
    Keyboard.addListener('keyboardWillHide', _keyboardDidHide)

    return () => {
      Keyboard.removeListener('keyboardWillShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardWillHide', _keyboardDidHide);
    }
  }, [])

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={device.web? {height: device.height-56} : {}}
        contentContainerStyle={[{backgroundColor: myColors.background, paddingTop: 8, paddingBottom: 16},
        ]}>
        {
          payments.map(renderItem)
        }
      </ScrollView>
      <Portal>
        <BottomModal
          isVisible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          style={{padding: 24, alignItems: 'center', paddingBottom: keyboardVisible? 0 : 24}} >
          <Text style={{fontSize: 20, color: myColors.text4_5, fontFamily: 'Medium'}} >Troco para quanto?</Text>
          <Text style={{fontSize: 16, color: myColors.text4, fontFamily: 'Regular'}} >Valor total da compra R${moneyToString(total)}</Text>
          <View style={{flexDirection: 'row', marginTop: 4}} >
            <Text style={{fontSize: 20, color: myColors.text4, marginTop: 7, fontFamily: 'Regular'}} >R$</Text>
            <Input
              autoFocus
              selectionColor={myColors.primaryColor}
              inputStyle={{fontSize: 20, color: myColors.text4, fontFamily: 'Regular'}}
              keyboardType='numeric'
              maxLength={7}
              value={troco.toString()}
              onChangeText={v => trocoMask(v)}
              textAlign='right'
              containerStyle={{width: 82}}
              style={{width: 70}} />
          </View>
          <View style={{flexDirection: 'row'}} >
            <MyButton
              type='outline'
              buttonStyle={{borderWidth: 2, padding: 6, width: 106}}
              onPress={()=> {navigation.navigate('Cart', {callback: 'payment', value: {title: 'Dinheiro', sub: 'Sem troco'}})
              setModalVisible(false)}}
              title='Sem troco' />
            <MyButton
              disabled={money(troco).value < total.value}
              buttonStyle={{marginLeft: 16, width: 106}}
              onPress={()=> {navigation.navigate('Cart', {callback: 'payment', value: {title: 'Dinheiro', sub: 'Troco para R$'+troco}})
              setModalVisible(false)}}
              title='Confirmar' />
          </View>
        </BottomModal>
      </Portal>
    </>
  )
}

const styles = StyleSheet.create({
  title: {
    marginLeft: 24,
    marginTop: 16,
    fontSize: 17,
    fontFamily: 'Medium',
    color: myColors.text4
  },
  card: {
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: myColors.divider
  }
})

export default PaymentOnDelivery