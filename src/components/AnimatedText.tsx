import React, { useEffect, useRef } from 'react';
import { TextInput } from 'react-native';
import { StyleProp, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  withSequence,
  withTiming,
  useAnimatedProps,
  cancelAnimation,
} from 'react-native-reanimated';
import { myFonts } from '~/constants';
import { Money, money } from '~/functions/money';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
Animated.addWhitelistedNativeProps({ text: true });
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
  const previousValue = useRef(value);
  const sharedText = useSharedValue(format(value));

  const scaleAnimatedProps = useAnimatedProps(() => {
    return { text: sharedText.value, defaultValue: sharedText.value };
  });

  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (money.isEqual(previousValue.current, value)) return;
    if (value === 0 && !animateZero) {
      previousValue.current = 0;
      sharedText.value = format(value); // the container will hide, so skip the value animation
      return;
    }

    const isGoingUp = money.isGreater(value, previousValue.current);
    const text = format(value);

    sharedText.value = format(previousValue.current);
    previousValue.current = value;

    cancelAnimation(translateY);
    translateY.value = 0;
    translateY.value = withSequence(
      withTiming(isGoingUp ? -distance : distance, { duration }, (finished) => {
        if (finished) {
          sharedText.value = text;
        }
      }),
      withTiming(isGoingUp ? distance : -distance, { duration: 0 }),
      withTiming(0, { duration }),
    );
    cancelAnimation(opacity);
    opacity.value = 1;
    opacity.value = withSequence(
      withTiming(0, { duration }),
      withTiming(1, { duration }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <AnimatedTextInput
      underlineColorAndroid='transparent'
      editable={false}
      animatedProps={scaleAnimatedProps}
      style={[
        {
          fontFamily: myFonts.Regular,
          opacity,
          transform: [{ translateY }],
          textAlign: 'center',
        },
        style,
      ]}
    />
  );
};

function format(value: number | Money) {
  return typeof value === 'number' ? `${value}` : money.toString(value, 'R$');
}

export default AnimatedText;
