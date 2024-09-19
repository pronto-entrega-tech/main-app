import React, { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import {
  View,
  StyleProp,
  ViewStyle,
  Insets,
  GestureResponderEvent,
  TouchableHighlight,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import device from '~/constants/device';
import innerUseHover, { UseHover } from '~/hooks/useHover';
import useRouting, { Params } from '~/hooks/useRouting';
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
  params?: Params;

  onPress?: undefined;
};

export type ButtonOrLink<T> = (OnlyButton | OnlyLink) & T;

type MyTouchableBase = {
  children?: ReactNode;
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

    const baseStyle: ViewStyle = {
      transitionDuration: '200ms',
    };
    const baseHoverStyle = { opacity: 0.5 };
    const hovered = !!(isHovered && (screen || !disabled)); // should be a link or a button not disabled

    const fullStyle: StyleProp<ViewStyle> = [
      baseStyle,
      style,
      hovered && [baseHoverStyle, hoverStyle],
    ];

    return screen ? (
      <Link href={urlFrom(screen, params)} passHref legacyBehavior>
        <View {...hoverBind} style={fullStyle}>
          <>{children}</>
        </View>
      </Link>
    ) : (
      <Pressable
        {...hoverBind}
        onPress={onPress}
        disabled={disabled}
        style={fullStyle}>
        <>{children}</>
      </Pressable>
    );
  }

  const onPressOrNav = !screen ? onPress : () => navigate(screen, params);

  if (device.iOS) {
    return solid ? (
      <TouchableHighlight
        underlayColor='#68b5f2'
        onPress={onPressOrNav}
        disabled={disabled}
        hitSlop={hitSlop}
        style={style}>
        <>{children}</>
      </TouchableHighlight>
    ) : (
      <TouchableOpacity
        onPress={onPressOrNav}
        disabled={disabled}
        hitSlop={hitSlop}
        style={style}>
        <>{children}</>
      </TouchableOpacity>
    );
  }

  // if android
  return (
    <Pressable
      onPress={onPressOrNav}
      disabled={disabled}
      hitSlop={hitSlop}
      android_ripple={{
        foreground: true,
        color: 'rgba(0 0 0 / .32)',
      }}
      style={style}>
      <>{children}</>
    </Pressable>
  );
};

export default MyTouchable;
