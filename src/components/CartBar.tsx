import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { device, myColors, myFonts } from '~/constants';
import MyTouchable from '~/components/MyTouchable';
import MyText from '~/components/MyText';
import AnimatedText from '~/components/AnimatedText';
import MyIcon from './MyIcon';
import useRouting from '~/hooks/useRouting';
import { Money, money } from '~/functions/money';
import { useCartContext } from '~/contexts/CartContext';

const screensWOCartBar = ['OrderDetails', 'Chat'];

const hiddenY = 50 + 24;

const getTranslateValue = (subtotal: Money, screen: string) =>
  screensWOCartBar.includes(screen) || money.isEqual(subtotal, 0) ? hiddenY : 0;

const CartBar = ({ toped = false }: { toped?: boolean }) => {
  const { subtotal } = useCartContext();
  const { screen, navigate } = useRouting();

  const translateValue = getTranslateValue(subtotal, screen);
  const barState = useRef({
    translateY: new Animated.Value(translateValue),
  }).current;

  useEffect(() => {
    Animated.timing(barState.translateY, {
      toValue: translateValue,
      duration: 200,
      useNativeDriver: !device.web,
    }).start();
  }, [translateValue, barState.translateY]);

  return (
    <View
      style={[
        styles.cartBarContainer,
        toped ? { marginBottom: device.iPhoneNotch ? 54 + 34 : 54 } : {},
      ]}>
      <Animated.View
        style={{ transform: [{ translateY: barState.translateY }] }}>
        <MyTouchable
          solid
          style={[
            styles.cartBarTouchable,
            !toped && device.iPhoneNotch ? { height: 50 + 24 } : { height: 50 },
          ]}
          onPress={() => navigate('Cart')}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: !toped && device.iPhoneNotch ? 24 : 0,
            }}>
            <MyIcon
              name={'cart'}
              size={28}
              color={'#FFF'}
              style={styles.iconCart}
            />
            <MyText style={styles.textCart}>Ver carrinho</MyText>
            <AnimatedText style={styles.priceCart}>{subtotal}</AnimatedText>
          </View>
        </MyTouchable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartBarContainer: {
    position: device.web ? ('fixed' as any) : 'absolute',
    overflow: 'hidden',
    bottom: 0,
    width: '100%',
  },
  cartBarTouchable: {
    width: '100%',
    backgroundColor: myColors.primaryColor,
  },
  iconCart: {
    position: 'absolute',
    left: 24,
  },
  textCart: {
    color: '#FFF',
    fontSize: 14,
  },
  priceCart: {
    position: 'absolute',
    right: 18,
    alignContent: 'flex-end',
    color: '#FFF',
    fontSize: 16,
    fontFamily: myFonts.Medium,
  },
});

export default CartBar;
