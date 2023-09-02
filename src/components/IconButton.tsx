import React from 'react';
import { Insets, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { myColors, globalStyles } from '~/constants';
import MyTouchable, { ButtonOrLink } from './MyTouchable';
import MyIcon, { IconNames } from './MyIcon';

type ButtonTypes =
  | 'blank'
  | 'clear'
  | 'add'
  | 'add2'
  | 'addHorizontal'
  | 'addLarge'
  | 'back'
  | 'profile'
  | 'prodIcons'
  | 'cancel';

type IconButtonBase = {
  icon: IconNames;
  /**
   * @default 24
   */
  size?: number;
  /**
   * @default primaryColor
   */
  color?: string;
  style?: StyleProp<ViewStyle>;
  disabledStyle?: StyleProp<ViewStyle>;
  /**
   *  @platform web.
   */
  hoverStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  type?: ButtonTypes;
  hitSlop?: Insets;
};

type IconButtonProps = ButtonOrLink<IconButtonBase>;

const IconButton = ({
  icon,
  size = 24,
  color = myColors.primaryColor,
  style,
  disabledStyle,
  hoverStyle,
  disabled,
  type,
  hitSlop,
  ...props
}: IconButtonProps) => {
  let innerHitSlop;
  let iconStyle: StyleProp<ViewStyle> = {};
  switch (type) {
    case 'blank':
      break;
    case 'clear':
      iconStyle = styles.buttonClear;
      break;
    case 'add':
      iconStyle = [
        styles.buttonAdd,
        globalStyles.elevation4,
        globalStyles.darkBorder,
      ];
      innerHitSlop = { top: 9, bottom: 9, left: 12, right: 12 };
      break;
    case 'add2':
      iconStyle = styles.buttonAdd2;
      innerHitSlop = { top: 9, bottom: 9, left: 9, right: 9 };
      break;
    case 'addHorizontal':
      iconStyle = [
        styles.buttonAddHorizontal,
        globalStyles.elevation4,
        globalStyles.darkBorder,
      ];
      innerHitSlop = { top: 10, bottom: 10, left: 10, right: 12 };
      break;
    case 'addLarge':
      iconStyle = [
        styles.buttonAddLarge,
        globalStyles.elevation4,
        globalStyles.darkBorder,
      ];
      innerHitSlop = { top: 9, bottom: 9, left: 12, right: 12 };
      break;
    case 'back':
      iconStyle = styles.buttonBack;
      break;
    case 'cancel':
      iconStyle = styles.cancel;
      break;
    case 'prodIcons':
      iconStyle = styles.buttonProdIcons;
      break;
    case 'profile':
      iconStyle = [
        styles.buttonProfile,
        globalStyles.elevation4,
        globalStyles.darkBorder,
      ];
      break;
    default:
      iconStyle = [
        styles.buttonDefault,
        globalStyles.elevation4,
        globalStyles.darkBorder,
      ];
  }

  return (
    <MyTouchable
      hitSlop={hitSlop ?? innerHitSlop}
      style={[
        styles.base,
        iconStyle,
        disabled ? disabledStyle ?? { opacity: 0.4 } : {},
        style,
      ]}
      hoverStyle={hoverStyle}
      disabled={disabled}
      {...props}>
      <MyIcon name={icon} size={size} color={color} />
    </MyTouchable>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
  },
  buttonDefault: {
    width: 54,
    height: 54,
    backgroundColor: '#fff',
    margin: 5,
  },
  buttonClear: {
    width: 44,
    height: 44,
    borderRadius: 48,
    padding: 10,
  },
  buttonAdd: {
    width: 32,
    height: 28,
    backgroundColor: '#fff',
    margin: 2,
  },
  buttonAdd2: {
    width: 32,
    height: 32,
  },
  buttonAddHorizontal: {
    width: 26,
    height: 26,
    backgroundColor: '#fff',
    margin: 2,
  },
  buttonAddLarge: {
    width: 34,
    height: 30,
    backgroundColor: '#fff',
    margin: 2,
  },
  buttonBack: {
    width: 56,
    height: 56,
    borderRadius: 56,
  },
  buttonProdIcons: {
    marginLeft: -8,
    width: 56,
    height: 56,
    borderRadius: 56,
  },
  buttonProfile: {
    width: 50,
    height: 50,
    marginTop: -45,
    right: -40,
    marginBottom: 8,
    backgroundColor: '#fff',
    margin: 5,
  },
  cancel: {
    width: 48,
    height: 48,
    borderRadius: 48,
  },
});

export default IconButton;
