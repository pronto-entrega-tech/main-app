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
import useRouting from '~/hooks/useRouting';
import { urlFrom } from '~/functions/converter';

type OnlyButton = {
  /**
   * To navigate use the `screen` instead, so this button become a link.
   */
  onPress?: (event: GestureResponderEvent) => void;

  screen?: undefined;
  params?: undefined;
};

type OnlyLink = {
  /**
   * When defined, this button become a link.
   */
  screen: string;
  /**
   * Params to pass to the route, use with `screen`.
   */
  params?: any;

  onPress?: undefined;
};

export type ButtonOrLink<T = any> = (OnlyButton | OnlyLink) & T;

type MyTouchableBase = {
  children?: React.ReactNode;
  disabled?: boolean;
  hitSlop?: Insets;
  style?: StyleProp<ViewStyle>;
  /**
   *  @platform web.
   */
  hoverStyle?: StyleProp<ViewStyle>;
  useHover?: UseHover;
  solid?: boolean;
};

type MyTouchableProps = ButtonOrLink<MyTouchableBase>;

const useTryRouting = () => {
  try {
    return useRouting().navigate;
  } catch {
    return () => undefined;
  }
};

const MyTouchable = ({
  onPress,
  screen,
  params,
  children,
  disabled = !onPress && !screen,
  hitSlop,
  style,
  hoverStyle,
  useHover,
  solid,
}: MyTouchableProps) => {
  const navigate = useTryRouting();

  if (device.web) {
    const [isHovered, hoverBind] = useHover ?? innerUseHover();

    const baseStyle: React.CSSProperties = {
      transitionDuration: '200ms',
      cursor: disabled ? 'default' : 'pointer',
    };
    const baseHoverStyle = { opacity: 0.5 };
    const hovered = !!(isHovered && (screen || !disabled)); // should be a link or a button not disabled

    const Touchable = (
      <View
        role={screen ? 'link' : 'button'}
        {...hoverBind}
        {...{ onClick: !screen && !disabled ? onPress : undefined }}
        style={[
          baseStyle as ViewStyle,
          style,
          hovered && (hoverStyle ?? baseHoverStyle),
        ]}>
        <>{children}</>
      </View>
    );

    if (screen)
      return (
        <Link href={urlFrom(screen, params)} passHref>
          {Touchable}
        </Link>
      );

    return Touchable;
  }

  const onPressOrNav = !screen ? onPress : () => navigate(screen, params);

  if (device.iOS) {
    const TouchableHybrid: any = solid ? TouchableHighlight : TouchableOpacity;
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
};

export default MyTouchable;
