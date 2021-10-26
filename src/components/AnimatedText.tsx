import React, { useEffect, useState } from 'react';
import { Animated } from 'react-native';
import { device, myFonts } from '~/constants';
import {
  isEqual,
  isGreater,
  Money,
  moneyToString,
} from '~/functions/converter';

export default function AnimatedText({
  children: value,
  style,
  distace = 20,
  duration = 100,
  animateZero = false,
}: {
  children: number | Money;
  style?: any;
  distace?: number;
  duration?: number;
  animateZero?: boolean;
}) {
  const [valueState] = useState({
    translateY: new Animated.Value(0),
    opacity: new Animated.Value(1),
  });
  const [showValue, setShowValue] = useState(value);

  useEffect(() => {
    if (isEqual(showValue, value)) return;
    if (value === 0 && !animateZero) return setShowValue(0); // the conteiner will hide, so skip the value animation

    const useNativeDriver = !device.web;
    const isGoingUp = isGreater(value, showValue);

    Animated.parallel([
      Animated.timing(valueState.translateY, {
        toValue: isGoingUp ? -distace : distace,
        duration,
        useNativeDriver,
      }),
      Animated.timing(valueState.opacity, {
        toValue: 0,
        duration,
        useNativeDriver,
      }),
    ]).start(() => {
      valueState.translateY.setValue(isGoingUp ? distace : -distace);
      setShowValue(value);

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
      {isNumber ? showValue.toString() : moneyToString(showValue, 'R$')}
    </Animated.Text>
  );
}
