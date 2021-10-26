import React from 'react';
import { StyleProp, ViewStyle, TextStyle, PixelRatio } from 'react-native';
import myColors from '~/constants/myColors';
import myFonts from '~/constants/myFonts';
import device from '~/constants/device';
import MyText from './MyText';
import MyTouchable, { ButtonOrLink } from './MyTouchable';
import useHover from '~/hooks/useHover';
import MyIcon, { IconNames, MyIconProps } from './MyIcon';

interface MyButtonBase {
  title: string;
  icon?: IconNames | MyIconProps;
  image?: JSX.Element;
  iconRight?: boolean;
  disabled?: boolean;
  type?: 'solid' | 'outline' | 'clear';
  buttonStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
}

type MyButtonProps = ButtonOrLink<MyButtonBase>;

/**
 * Use `onPress` if want a button, or `path` if want a link.
 */
function MyButton({
  onPress = () => {},
  path,
  params,
  title,
  image,
  icon,
  iconRight = false,
  disabled = false,
  type = 'solid',
  buttonStyle,
  titleStyle,
}: MyButtonProps) {
  const baseStyle: ViewStyle = {
    borderRadius: 4,
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: iconRight ? 'row-reverse' : 'row',
    // `padding` overwrite other paddings
    paddingTop: 8,
    paddingRight: 8,
    paddingBottom: 8,
    paddingLeft: 8,
    ...{ transitionDuration: '200ms' },
  };

  const _useHover = useHover();
  const [hovered] = _useHover;

  const isHovered = hovered && (path || !disabled); // should be a link or a button not disabled

  const hoverColor = !isHovered ? myColors.primaryColor : '#48a2eb';
  const textColor = !disabled ? hoverColor : '#9CA3AA';
  const backgroundColor = !disabled ? hoverColor : '#E3E6E8';

  const typeStyle: ViewStyle = (() => {
    switch (type) {
      case 'solid':
        return {
          backgroundColor,
        };
      case 'outline':
        return {
          borderColor: textColor,
          borderWidth: 1,
        };
      default:
        return {};
    }
  })();

  const ButtonText = () => (
    <>
      {image}
      {icon && (
        <MyIcon {...(typeof icon === 'string' ? { name: icon } : icon)} />
      )}
      <MyText
        style={[
          {
            color: type === 'solid' ? 'white' : textColor,
            fontFamily: device.android ? myFonts.Medium : myFonts.Regular,
            fontSize: 12 + PixelRatio.get() * 2,
          },
          titleStyle,
        ]}>
        {title}
      </MyText>
    </>
  );

  return (
    <MyTouchable
      solid={type === 'solid'}
      disabled={disabled}
      style={[baseStyle, typeStyle, buttonStyle]}
      useHover={_useHover}
      {...({
        onPress,
        path,
        params,
      } as ButtonOrLink)}>
      <ButtonText />
    </MyTouchable>
  );
}

export default MyButton;
