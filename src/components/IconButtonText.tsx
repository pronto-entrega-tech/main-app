import React from 'react';
import { View, StyleSheet } from 'react-native';
import myFonts from '~/constants/myFonts';
import { myColors } from '~/constants';
import IconButton from './IconButton';
import { ButtonOrLink } from './MyTouchable';
import { IconNames } from './MyIcon';
import MyText from './MyText';

type IconButtonTextBase = {
  icon: IconNames;
  text: string;
  type?: 'fill' | 'profile2';
};

type IconButtonTextProps = ButtonOrLink<IconButtonTextBase>;

const IconButtonText = ({
  onPress,
  screen,
  params,
  icon,
  text,
  type = 'fill',
}: IconButtonTextProps) => {
  const props =
    type === 'fill'
      ? {
          size: 32,
          color: myColors.grey2,
          style: {},
        }
      : {
          size: 28,
          color: '#fff',
          style: { fontFamily: myFonts.Medium, paddingTop: 4 },
        };

  return (
    <View>
      <IconButton
        icon={icon}
        size={props.size}
        color={props.color}
        type={type}
        {...({
          onPress,
          screen,
          params,
        } as ButtonOrLink)}
      />
      <MyText style={[styles.text, props.style]}>{text}</MyText>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    marginTop: -4,
    alignSelf: 'center',
    color: myColors.text,
    fontSize: 13,
    textAlign: 'center',
  },
});

export default IconButtonText;
