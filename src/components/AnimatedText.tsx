import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleProp, TextStyle } from 'react-native';
import { device, myFonts } from '~/constants';
import { Money, money } from '~/functions/money';

const AnimatedText = ({
  children: value,
  style,
  distance = 20,
  duration = 100,
  animateZero = false,
}: {
  children: number | Money;
  style?: StyleProp<TextStyle>;
  distance?: number;
  duration?: number;
  animateZero?: boolean;
}) => {
  const [showValue, setShowValue] = useState(value);
  const valueState = useRef({
    translateY: new Animated.Value(0),
    opacity: new Animated.Value(1),
  }).current;

  useEffect(() => {
    if (money.isEqual(showValue, value)) return;
    if (value === 0 && !animateZero) return setShowValue(0); // the container will hide, so skip the value animation

    const useNativeDriver = !device.web;
    const isGoingUp = money.isGreater(value, showValue);

    Animated.parallel([
      Animated.timing(valueState.translateY, {
        toValue: isGoingUp ? -distance : distance,
        duration,
        useNativeDriver,
      }),
      Animated.timing(valueState.opacity, {
        toValue: 0,
        duration,
        useNativeDriver,
      }),
    ]).start(() => {
      setShowValue(value);
      valueState.translateY.setValue(isGoingUp ? distance : -distance);

      Animated.parallel([
        Animated.timing(valueState.translateY, {
          toValue: 0,
          duration,
          useNativeDriver,
        }),
        Animated.timing(valueState.opacity, {
          toValue: 1,
          duration,
          useNativeDriver,
        }),
      ]).start();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const isNumber = typeof showValue === 'number';
  return (
    <Animated.Text
      style={[
        {
          fontFamily: myFonts.Regular,
          opacity: valueState.opacity,
          transform: [{ translateY: valueState.translateY }],
        },
        style,
      ]}>
      {isNumber ? `${showValue}` : money.toString(showValue, 'R$')}
    </Animated.Text>
  );
};

export default AnimatedText;
