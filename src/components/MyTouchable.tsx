import React from 'react';
import Link from 'next/link';
import {
  View,
  TouchableNativeFeedback,
  StyleProp,
  ViewStyle,
  Insets,
  GestureResponderEvent,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import device from '~/constants/device';
import innerUseHover, { UseHover } from '~/hooks/useHover';
/* import { useRouting } from 'expo-next-react-navigation'; */
import useRouting from '~/hooks/useRouting';

interface OnlyButton {
  /**
   * To navegate use the `path` instead, so this button become a link.
   */
  onPress?: (event: GestureResponderEvent) => void;

  path?: undefined;
  params?: undefined;
}

interface OnlyLink {
  /**
   * When defined, this button become a link.
   */
  path: string;
  /**
   * Params to pass to the route, use with `path`.
   */
  params?: any;

  onPress?: undefined;
}

export type ButtonOrLink<T = null> = (OnlyButton | OnlyLink) & T;

interface MyTouchableBase {
  children?: React.ReactNode;
  disabled?: boolean;
  hitSlop?: Insets;
  style?: StyleProp<ViewStyle>;
  /**
   *  @platform web.
   */
  hoverStyle?: ViewStyle;
  useHover?: UseHover;
  solid?: boolean;
}

type MyTouchableProps = ButtonOrLink<MyTouchableBase>;

function MyTouchable({
  onPress,
  path,
  params,
  children,
  disabled,
  hitSlop,
  style,
  hoverStyle,
  useHover,
  solid,
}: MyTouchableProps) {
  const { navigate } = useRouting();

  if (device.web) {
    const [isHovered, hoverBind] = useHover ?? innerUseHover();

    const baseStyle = {
      transitionDuration: '200ms',
    } as ViewStyle;
    const baseHoverStyle = {
      opacity: 0.5,
    };
    const hovered = !!(isHovered && (path || !disabled)); // should be a link or a button not disabled

    const Touchable = (
      <View
        accessibilityRole={path ? 'link' : 'button'}
        {...hoverBind}
        {...{ onClick: !path && !disabled ? onPress : undefined }}
        style={[style, baseStyle, hovered && (hoverStyle ?? baseHoverStyle)]}>
        <>{children}</>
      </View>
    );

    if (path) {
      return (
        <Link href={{ pathname: path, query: params }} passHref>
          {Touchable}
        </Link>
      );
    }

    return Touchable;
  }

  const onPressOrNav = !path ? onPress : () => navigate(path, params);

  if (device.iOS) {
    const TouchableHybrid = solid ? TouchableHighlight : TouchableOpacity;
    return (
      <TouchableHybrid
        underlayColor='#68b5f2'
        disabled={disabled}
        onPress={onPressOrNav}
        style={style}>
        <>{children}</>
      </TouchableHybrid>
    );
  }

  // if android
  return (
    <TouchableNativeFeedback
      useForeground
      background={
        solid
          ? TouchableNativeFeedback.Ripple('rgba(255, 255, 255, .32)', false)
          : undefined
      }
      hitSlop={hitSlop}
      disabled={disabled}
      onPress={onPressOrNav}>
      <View style={[{ overflow: 'hidden' }, style]}>{children}</View>
    </TouchableNativeFeedback>
  );

  /* return (
    <TouchableRipple
      rippleColor={solid ? 'rgba(255, 255, 255, .32)' : undefined}
      underlayColor={solid ? '#68b5f2' : undefined}
      hitSlop={hitSlop}
      disabled={disabled}
      onPress={onPress}
      style={style}>
      <>{children}</>
    </TouchableRipple>
  ); */
}

export default MyTouchable;
