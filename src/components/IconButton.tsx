import React from 'react';
import { Insets, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { myColors, globalStyles } from '~/constants';
import colors from '~/constants/myColors';
import MyTouchable, { ButtonOrLink } from './MyTouchable';
import MyIcon, { IconNames } from './MyIcon';

type ButtonTypes =
  | 'blank'
  | 'clear'
  | 'add'
  | 'add2'
  | 'addHorizontal'
  | 'addLarge'
  | 'fill'
  | 'back'
  | 'profile'
  | 'address'
  | 'prodIcons'
  | 'profile2'
  | 'cancel';

interface IconButtonBase {
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
  disabled?: boolean;
  type?: ButtonTypes;
  hitSlop?: Insets;
}

type IconButtonProps = ButtonOrLink<IconButtonBase>;

function IconButton({
  onPress,
  path,
  params,
  icon,
  size = 24,
  color = myColors.primaryColor,
  style,
  disabled,
  type,
  hitSlop,
}: IconButtonProps) {
  let innerHitSlop;
  let iconStyle: StyleProp<ViewStyle> = {
    alignItems: 'center',
    justifyContent: 'center',
  };
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
    case 'profile2':
      iconStyle = [styles.buttonProfile2, globalStyles.elevation4];
      break;
    case 'address':
      iconStyle = styles.buttonAddress;
      break;
    default:
      iconStyle = [
        styles.button,
        globalStyles.elevation4,
        globalStyles.darkBorder,
      ];
  }

  return (
    <MyTouchable
      hitSlop={hitSlop ?? innerHitSlop}
      style={[iconStyle, style]}
      disabled={disabled}
      {...({
        onPress,
        path,
        params,
      } as ButtonOrLink)}>
      <MyIcon name={icon} size={size} color={color} />
    </MyTouchable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 54,
    height: 54,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
    margin: 5,
  },
  buttonClear: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 48,
    padding: 10,
  },
  buttonAdd: {
    width: 32,
    height: 28,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
    margin: 2,
  },
  buttonAdd2: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
  },
  buttonAddHorizontal: {
    width: 26,
    height: 26,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
    margin: 2,
  },
  buttonAddLarge: {
    width: 34,
    height: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
    margin: 2,
  },
  buttonBack: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 56,
  },
  buttonProdIcons: {
    marginLeft: -8,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 56,
  },
  buttonProfile: {
    width: 50,
    height: 50,
    marginTop: -45,
    right: -40,
    marginBottom: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
    margin: 5,
  },
  buttonProfile2: {
    width: 50,
    height: 50,
    backgroundColor: colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
    margin: 5,
  },
  buttonAddress: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
    marginTop: -2,
  },
  cancel: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 48,
  },
});

export default IconButton;
