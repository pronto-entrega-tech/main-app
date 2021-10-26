import React from 'react';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { Text, View, StyleSheet } from 'react-native';
import myFonts from '~/constants/myFonts';
import { myColors } from '~/constants';
import IconButton from './IconButton';
import { ButtonOrLink } from './MyTouchable';
import { IconNames } from './MyIcon';

interface IconButtonTextBase {
  icon: IconNames;
  text: string;
  type?: 'fill' | 'profile2';
}

type IconButtonTextProps = ButtonOrLink<IconButtonTextBase>;

function IconButtonText({
  onPress,
  path,
  params,
  icon,
  text,
  type = 'fill',
}: IconButtonTextProps) {
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
          path,
          params,
        } as ButtonOrLink)}
      />
      <Text style={[styles.text, props.style]}>{text}</Text>
    </View>
  );
}

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
