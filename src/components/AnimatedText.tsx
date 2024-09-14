import React, { useEffect, useState } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { myFonts } from '~/constants';
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

  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (money.isEqual(showValue, value)) return;
    if (value === 0 && !animateZero) return setShowValue(0); // the container will hide, so skip the value animation

    const isGoingUp = money.isGreater(value, showValue);

    translateY.value = withSequence(
      withTiming(isGoingUp ? -distance : distance, { duration }, (finished) => {
        if (finished) setShowValue(value);
      }),
      withTiming(isGoingUp ? distance : -distance, { duration: 0 }),
      withTiming(0, { duration }),
    );
    opacity.value = withSequence(
      withTiming(0, { duration }),
      withTiming(1, { duration }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const isNumber = typeof showValue === 'number';
  return (
    <Animated.Text
      style={[
        {
          fontFamily: myFonts.Regular,
          opacity,
          transform: [{ translateY }],
        },
        style,
      ]}>
      {isNumber ? `${showValue}` : money.toString(showValue, 'R$')}
    </Animated.Text>
  );
};

export default AnimatedText;
