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
};

type IconButtonTextProps = ButtonOrLink<IconButtonTextBase>;

const IconButtonText = ({ icon, text, ...props }: IconButtonTextProps) => {
  return (
    <View>
      <IconButton icon={icon} size={32} color={myColors.grey2} {...props} />
      <MyText style={styles.text}>{text}</MyText>
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
