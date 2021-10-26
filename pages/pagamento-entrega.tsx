import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { Input } from 'react-native-elements/dist/input/Input';
import BottomModal from '~/components/BottomModal';
import { WithPaymentTabBar } from '~/components/Layout';
import MyButton from '~/components/MyButton';
import MyTouchable from '~/components/MyTouchable';
import { myColors, device, images } from '~/constants';
import Portal from '~/core/Portal';
import { isGreater, money, moneyToString } from '~/functions/converter';
import useRouting from '~/hooks/useRouting';

const payments = [
  {
    icon: images.cash,
    text: 'Dinheiro',
    payment: { title: 'Dinheiro', sub: '' },
  },

  { text: 'Crédito' },
  {
    icon: images.mastercard,
    text: 'Mastercard',
    payment: { title: 'Crédito Mastercard', sub: 'Máquininha' },
  },
  {
    icon: images.visa,
    text: 'Visa',
    payment: { title: 'Crédito Visa', sub: 'Máquininha' },
  },
  {
    icon: images.elo,
    text: 'Elo',
    payment: { title: 'Crédito Elo', sub: 'Máquininha' },
  },

  { text: 'Débito' },
  {
    icon: images.mastercard,
    text: 'Mastercard',
    payment: { title: 'Débito Mastercard', sub: 'Máquininha' },
  },
  {
    icon: images.visa,
    text: 'Visa',
    payment: { title: 'Débito Visa', sub: 'Máquininha' },
  },
  {
    icon: images.elo,
    text: 'Elo',
    payment: { title: 'Débito Elo', sub: 'Máquininha' },
  },
];

type Payment = typeof payments[number];

function PaymentOnDelivery() {
  const routing = useRouting();
  const [modalVisible, setModalVisible] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [troco, setTroco] = useState('0,00');
  const total = money(routing.params.total ?? '0');

  const trocoMask = (v: string) => {
    v = v.replace(/\D/g, '');

    if (v.length > 3) v = parseInt(v).toString();

    v = v.padStart(3, '0');
    v = v.substring(0, v.length - 2) + ',' + v.substring(v.length - 2);
    setTroco(v);
  };

  const renderItem = (item: Payment, index: number) => {
    if (!item.icon) {
      return (
        <Text key={index} style={styles.title}>
          {item.text}
        </Text>
      );
    } else {
      return (
        <View key={index}>
          <MyTouchable
            onPress={() => {
              if (index === 0) {
                setModalVisible(true);
              } else {
                routing.navigate('/carrinho', {
                  callback: 'payment',
                  value: JSON.stringify(item.payment),
                });
              }
            }}
            style={[styles.card]}>
            <Image {...item.icon} style={{ width: 38, height: 38 }} />
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Medium',
                color: myColors.text2,
                marginLeft: 16,
              }}>
              {item.text}
            </Text>
          </MyTouchable>
        </View>
      );
    }
  };

  const keyboardDidShow = () => setKeyboardVisible(true);
  const keyboardDidHide = () => setKeyboardVisible(false);

  React.useEffect(() => {
    if (!device.iPhoneNotch) return;
    Keyboard.addListener('keyboardWillShow', keyboardDidShow);
    Keyboard.addListener('keyboardWillHide', keyboardDidHide);

    return () => {
      Keyboard.removeListener('keyboardWillShow', keyboardDidShow);
      Keyboard.removeListener('keyboardWillHide', keyboardDidHide);
    };
  }, []);

  const Modal = (
    <BottomModal
      isVisible={modalVisible}
      onDismiss={() => setModalVisible(false)}
      style={{
        padding: 24,
        alignItems: 'center',
        paddingBottom: keyboardVisible ? 0 : 24,
      }}>
      <Text
        style={{
          fontSize: 20,
          color: myColors.text4_5,
          fontFamily: 'Medium',
        }}>
        Troco para quanto?
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: myColors.text4,
          fontFamily: 'Regular',
        }}>
        Valor total da compra {moneyToString(total, 'R$')}
      </Text>
      <View style={{ flexDirection: 'row', marginTop: 4 }}>
        <Text
          style={{
            fontSize: 20,
            color: myColors.text4,
            marginTop: 7,
            fontFamily: 'Regular',
          }}>
          R$
        </Text>
        <Input
          autoFocus
          selectionColor={myColors.primaryColor}
          inputStyle={{
            fontSize: 20,
            color: myColors.text4,
            fontFamily: 'Regular',
          }}
          keyboardType='numeric'
          maxLength={7}
          value={troco}
          onChangeText={trocoMask}
          textAlign='right'
          containerStyle={{ width: 82 }}
          style={{ width: 70 }}
        />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <MyButton
          type='outline'
          buttonStyle={{ borderWidth: 2, padding: 6, width: 106 }}
          onPress={() => {
            routing.navigate('/carrinho', {
              callback: 'payment',
              value: JSON.stringify({
                title: 'Dinheiro',
                sub: 'Sem troco',
              }),
            });
            setModalVisible(false);
          }}
          title='Sem troco'
        />
        <MyButton
          disabled={isGreater(total, money(troco))}
          buttonStyle={{ marginLeft: 16, width: 106 }}
          onPress={() => {
            routing.navigate('/carrinho', {
              callback: 'payment',
              value: JSON.stringify({
                title: 'Dinheiro',
                sub: 'Troco para R$' + troco,
              }),
            });
            setModalVisible(false);
          }}
          title='Confirmar'
        />
      </View>
    </BottomModal>
  );

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          {
            backgroundColor: myColors.background,
            paddingTop: 8,
            paddingBottom: 16,
          },
        ]}>
        {payments.map(renderItem)}
      </ScrollView>
      {device.web ? Modal : <Portal>{Modal}</Portal>}
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    marginLeft: 24,
    marginTop: 16,
    fontSize: 17,
    fontFamily: 'Medium',
    color: myColors.text4,
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
    borderColor: myColors.divider,
  },
});

export default WithPaymentTabBar(PaymentOnDelivery);
