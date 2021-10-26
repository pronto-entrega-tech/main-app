import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import useMyContext from '~/core/MyContext';
import { device, myColors, myFonts } from '~/constants';
import MyTouchable from '~/components/MyTouchable';
import MyText from '~/components/MyText';
import AnimatedText from '~/components/AnimatedText';
import MyIcon from './MyIcon';
import useRouting from '~/hooks/useRouting';

function CartBar({ toped = false }: { toped?: boolean }) {
  const { subtotal } = useMyContext();
  const routing = useRouting();
  const [barState] = useState({
    translateY: new Animated.Value(
      subtotal.dangerousInnerValue === 0 ? 50 + 24 : 0
    ),
  });

  useEffect(() => {
    const useNativeDriver = !device.web;

    if (subtotal.dangerousInnerValue === 0) {
      Animated.timing(barState.translateY, {
        toValue: 50 + 24,
        duration: 200,
        useNativeDriver,
      }).start();
    } else {
      Animated.timing(barState.translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal]);

  return (
    <View
      style={[
        styles.cartBarConteiner,
        toped ? { marginBottom: device.iPhoneNotch ? 54 + 34 : 54 } : {},
      ]}>
      <Animated.View
        style={{ transform: [{ translateY: barState.translateY }] }}>
        <MyTouchable
          solid
          style={[
            styles.cartBarTouchable,
            !toped && device.iPhoneNotch
              ? { height: 50 + 24, marginBottom: 24 }
              : { height: 50 },
          ]}
          onPress={() => routing.navigate('/carrinho')}>
          <MyIcon
            name={'cart'}
            size={28}
            color={'#FFF'}
            style={styles.iconCart}
          />
          <MyText style={styles.textCart}>Ver carrinho</MyText>
          <AnimatedText style={styles.priceCart}>{subtotal}</AnimatedText>
        </MyTouchable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  cartBarConteiner: {
    position: !device.web ? 'absolute' : ('fixed' as any),
    overflow: 'hidden',
    bottom: 0,
    width: '100%',
  },
  cartBarTouchable: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: myColors.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
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
