// @ts-nocheck
import * as React from 'react';
import {
  Animated,
  View,
  StyleSheet,
  TouchableNativeFeedback,
} from 'react-native';

type Props = $RemoveChildren<typeof TouchableRipple> & {
  /**
   * Value of the radio button
   */
  value: string;
  /**
   * Status of radio button.
   */
  status?: 'checked' | 'unchecked';
  /**
   * Whether radio is disabled.
   */
  disabled?: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: (param?: any) => void;
  /**
   * Custom color for unchecked radio.
   */
  uncheckedColor?: string;
  /**
   * Custom color for radio.
   */
  color?: string;
  /**
   * testID to be used on tests.
   */
  testID?: string;
};

const BORDER_WIDTH = 2;

/**
 * Radio buttons allow the selection a single option from a set.
 * This component follows platform guidelines for Android, but can be used
 * on any platform.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/radio-enabled.android.png" />
 *     <figcaption>Enabled</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/radio-disabled.android.png" />
 *     <figcaption>Disabled</figcaption>
 *   </figure>
 * </div>
 */
const RadioButtonAndroid = ({
  disabled,
  onPress,
  theme,
  value,
  status,
  testID,
  ...rest
}: Props) => {
  const { current: borderAnim } = React.useRef<Animated.Value>(
    new Animated.Value(BORDER_WIDTH)
  );

  const { current: radioAnim } = React.useRef<Animated.Value>(
    new Animated.Value(1)
  );

  const isFirstRendering = React.useRef<boolean>(true);

  const { scale } = theme.animation;

  React.useEffect(() => {
    // Do not run animation on very first rendering
    if (isFirstRendering.current) {
      isFirstRendering.current = false;
      return;
    }

    if (status === 'checked') {
      radioAnim.setValue(1.2);

      Animated.timing(radioAnim, {
        toValue: 1,
        duration: 150 * scale,
        useNativeDriver: true,
      }).start();
    } else {
      borderAnim.setValue(10);

      Animated.timing(borderAnim, {
        toValue: BORDER_WIDTH,
        duration: 150 * scale,
        useNativeDriver: false,
      }).start();
    }
  }, [status, borderAnim, radioAnim, scale]);

  const checkedColor = rest.color || theme.colors.accent;
  const uncheckedColor =
    rest.uncheckedColor ||
    color(theme.colors.text)
      .alpha(theme.dark ? 0.7 : 0.54)
      .rgb()
      .string();

  let rippleColor: string, radioColor: string;

  return (
    <TouchableNativeFeedback
      {...rest}
      borderless
      /* rippleColor={rippleColor} */
      onPress={disabled ? undefined : onPress}
      accessibilityTraits={disabled ? ['button', 'disabled'] : 'button'}
      accessibilityRole='radio'
      accessibilityLiveRegion='polite'
      style={styles.container}
      testID={testID}>
      <Animated.View
        style={[
          styles.radio,
          {
            borderColor: radioColor,
            borderWidth: borderAnim,
          },
        ]}>
        {checked && (
          <View style={[StyleSheet.absoluteFill, styles.radioContainer]}>
            <Animated.View
              style={[
                styles.dot,
                {
                  backgroundColor: radioColor,
                  transform: [{ scale: radioAnim }],
                },
              ]}
            />
          </View>
        )}
      </Animated.View>
    </TouchableNativeFeedback>
  );
};

RadioButtonAndroid.displayName = 'RadioButton.Android';

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
  },
  radioContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    margin: 8,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
  },
});

export default RadioButtonAndroid;