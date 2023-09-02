import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView, StyleSheet } from 'react-native';
import { ModalState, useModalState } from '~/hooks/useModalState';
import MyButton from '~/components/MyButton';
import MyInput from '~/components/MyInput';
import MyText from '~/components/MyText';
import MyTouchable from '~/components/MyTouchable';
import { myColors, device, myFonts } from '~/constants';
import { useCartContext } from '~/contexts/CartContext';
import Portal from '~/core/Portal';
import { arrayConditional, objectConditional } from '~/functions/conditionals';
import { Money, money } from '~/functions/money';
import useRouting from '~/hooks/useRouting';
import CenterModal from '~/components/CenterModal';
import { ImageSource, paymentImages } from '~/constants/images';

const PaymentOnDelivery = () => {
  const { replace, pop, goBack } = useRouting();
  const { activeMarket, total, setPayment } = useCartContext();
  const [modalState, openModal] = useModalState();

  useEffect(() => {
    if (!total || !activeMarket) replace('Cart');
  }, [replace, total, activeMarket]);

  if (!activeMarket) return null;

  const getPaymentTitle = (title: string) => title.replace(/.* /, '');

  const getPaymentIcon = (title: string) =>
    paymentImages[getPaymentTitle(title)];

  const getPaymentMethod = (v: string) =>
    ({ Dinheiro: 'CASH', Pix: 'PIX' })[v] ?? 'CARD';

  const _payments = activeMarket.payments_accepted.reduce(
    (o, name) => {
      const [group = ''] = name.match(/Crédito|Débito/) ?? [];

      return { ...o, [group]: [...(o[group] ?? []), getPaymentTitle(name)] };
    },
    {} as Record<string, string[]>,
  );

  const payments = Object.entries(_payments).reduce(
    (payments, [group, titles]) => {
      const newItems = titles.map((title) => ({
        icon: getPaymentIcon(title),
        text: title,
        ...objectConditional(title === 'Dinheiro')({
          onPress: openModal,
        }),
        payment: {
          description: `${group ? `${group} ` : ''}${title}`,
          payment_method: getPaymentMethod(title),
        },
      }));

      return [...payments, ...arrayConditional(group)({ group }), ...newItems];
    },
    [] as (
      | { group: string }
      | {
          payment: { description: string; payment_method: string };
          onPress?: () => void;
          icon: ImageSource | undefined;
          text: string;
        }
    )[],
  );

  const paymentItems = payments.map((item, index) => {
    if ('group' in item)
      return (
        <MyText key={index} style={styles.title}>
          {item.group}
        </MyText>
      );

    const saveInCard = () => {
      setPayment({
        ...item.payment,
        method: 'CARD',
        inApp: false,
      });
      pop();
      goBack('Cart');
    };

    return (
      <View key={index}>
        <MyTouchable onPress={item.onPress ?? saveInCard} style={styles.card}>
          {item.icon && (
            <Image {...item.icon} style={{ width: 38, height: 38 }} />
          )}
          <MyText style={styles.cardTitle}>{item.text}</MyText>
        </MyTouchable>
      </View>
    );
  });

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: myColors.background,
          paddingTop: 8,
          paddingBottom: 16,
        }}>
        {paymentItems}
      </ScrollView>
      <Portal>
        <ChangeModal
          valuePrefix='Valor total da compra'
          state={modalState}
          goBack
        />
      </Portal>
    </>
  );
};

export const ChangeModal = ({
  valuePrefix,
  state: modalState,
  goBack,
}: {
  valuePrefix: string;
  state: Partial<ModalState>;
  goBack?: boolean;
}) => {
  const routing = useRouting();
  const { total, setPayment } = useCartContext();
  const [change, setChange] = useState('0,00');

  const setChangeWithMask = (raw: string) => {
    const v = `${+raw.replace(/\D/g, '')}`.padStart(3, '0');

    setChange(`${v.slice(0, -2)},${v.slice(-2)}`);
  };

  const saveInCash = (change?: Money) => {
    setPayment({
      description: 'Dinheiro',
      method: 'CASH',
      inApp: false,
      change,
    });
    const back = () => {
      routing.pop();
      routing.goBack('Cart');
    };

    goBack ? back() : setChange('0,00');
    if (!device.web) modalState.onDismiss?.();
  };

  const saveChange = () => saveInCash(money(change));
  const saveWithoutChange = () => saveInCash();

  return (
    <CenterModal
      state={modalState}
      style={{ padding: 24, alignItems: 'center' }}>
      <MyText style={styles.changeTitle}>Troco para quanto?</MyText>
      <MyText style={styles.orderTotal}>
        {valuePrefix} {money.toString(total, 'R$')}
      </MyText>
      <View style={{ flexDirection: 'row', marginTop: 4 }}>
        <MyText style={styles.currencySign}>R$</MyText>
        <MyInput
          value={change}
          autoFocus
          maxLength={7}
          textAlign='right'
          keyboardType='numeric'
          containerStyle={{ width: 82 }}
          inputStyle={styles.changeInput}
          onChangeText={setChangeWithMask}
          onSubmitEditing={saveChange}
        />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <MyButton
          title='Sem troco'
          type='outline'
          buttonStyle={{ borderWidth: 2, padding: 6, width: 106 }}
          onPress={saveWithoutChange}
        />
        <MyButton
          title='Confirmar'
          disabled={money.isGreater(total ?? 0, money(change))}
          buttonStyle={{ marginLeft: 16, width: 106 }}
          onPress={saveChange}
        />
      </View>
    </CenterModal>
  );
};

const styles = StyleSheet.create({
  title: {
    marginLeft: 24,
    marginTop: 16,
    fontSize: 17,
    fontFamily: myFonts.Medium,
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
  cardTitle: {
    fontSize: 15,
    fontFamily: myFonts.Medium,
    color: myColors.text2,
    marginLeft: 16,
  },
  changeTitle: {
    fontSize: 20,
    color: myColors.text4_5,
    fontFamily: myFonts.Medium,
  },
  orderTotal: {
    fontSize: 16,
    color: myColors.text4,
    fontFamily: myFonts.Regular,
  },
  currencySign: {
    fontSize: 20,
    color: myColors.text4,
    marginTop: 7,
    fontFamily: myFonts.Regular,
  },
  changeInput: {
    fontSize: 20,
    color: myColors.text4,
    fontFamily: myFonts.Regular,
  },
});

export default PaymentOnDelivery;
