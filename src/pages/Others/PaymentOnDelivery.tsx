import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View, Text, Image, ImageURISource, ScrollView } from 'react-native';
import { Divider, Button, Input } from 'react-native-elements';
import { Modal, Portal } from 'react-native-paper';
import MyButton from '../../components/MyButton';
import { myColors, device, images } from '../../constants';
import validate from '../../functions/validate';

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
  const [troco, setTroco] = useState('');

  const renderItem = (item: iconText, index: number) => {
    if (item.icon == null) {
      return (
        <View key={index} >
          <Text style={{marginLeft: 24, marginBottom: 14, marginTop: 18, fontSize: 17, fontFamily: 'Medium', color: myColors.text4}} >{item.text}</Text>
          <Divider style={{marginHorizontal: 14, backgroundColor: myColors.divider2, height: 1}} />
        </View>
      )
    } else {
      return (
      <View key={index} >
        <MyButton onPress={()=> {
            if (index == 0) {
              setModalVisible(true)
            } else {
              navigation.navigate('Cart', {callback: 'payment', value: item.payment})
            }
          }} style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16}} >
          <Image style={{width: 38, height: 38 }} source={item.icon}  />
          <Text style={{fontSize: 15, fontFamily: 'Medium', color: myColors.text2, marginLeft: 12}} >{item.text}</Text>
        </MyButton>
        <Divider style={{marginHorizontal: 16, backgroundColor: myColors.divider2, height: 1}} />
      </View>
    )
  }}

  return (
    <>
      <ScrollView contentContainerStyle={{backgroundColor: myColors.background, height: device.height-112}} showsVerticalScrollIndicator={false}>
        {
          payments.map(renderItem)
        }
      </ScrollView>
      <Modal visible={modalVisible} onDismiss={()=>setModalVisible(false)} style={{justifyContent: 'flex-end'}} >
        <View style={{backgroundColor: myColors.background, width: '100%', height: 210, borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 24, alignItems: 'center'}} >
          <Text style={{fontSize: 20, color: myColors.text4, fontFamily: 'Medium'}} >Troco para quanto?</Text>
          <Text style={{fontSize: 16, color: myColors.text4, fontFamily: 'Regular'}} >Valor total da compra R${route.params.t}</Text>
          <View style={{flexDirection: 'row', marginTop: 4}} >
            <Text style={{fontSize: 20, color: myColors.text4, marginTop: 7, fontFamily: 'Regular'}} >R$</Text>
            <Input selectionColor={myColors.primaryColor} inputStyle={{fontSize: 20, color: myColors.text4, fontFamily: 'Regular'}} keyboardType='numeric' value={troco} placeholder={'0,00'} onChangeText={v => setTroco(v)} containerStyle={{width: 70}} style={{width: 70}} />
          </View>
          <View style={{flexDirection: 'row'}} >
            <Button type='outline' onPress={()=> {navigation.navigate('Cart', {payment: {title: 'Dinheiro', sub: 'Sem troco'}}); setModalVisible(false)}} title='Sem troco' />
            <Button disabled={troco == ''} containerStyle={{marginLeft: 16}} onPress={()=> {navigation.navigate('Cart', {payment: {title: 'Dinheiro', sub: 'Troco para R$'+troco}}); setModalVisible(false)}} title='Confirmar' />
          </View>
        </View>
      </Modal>
    </>
  )
}

export default PaymentOnDelivery