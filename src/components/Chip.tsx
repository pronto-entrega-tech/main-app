import React, { ReactNode } from 'react';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import IconButton from './IconButton';
import MyText from './MyText';
import MyTouchable from './MyTouchable';

const Chip = (props: {
  title?: string;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  onClose?: () => void;
}) => {
  const { title, icon, style, titleStyle, onPress, onClose } = props;
  return (
    <MyTouchable
      onPress={onPress}
      style={[
        {
          backgroundColor: '#ECECEC',
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: 32,
          borderRadius: 16,
          paddingHorizontal: 8,
          paddingVertical: 4,
        },
        style,
      ]}>
      {icon}
      <MyText
        style={[
          {
            paddingLeft: 8,
            paddingRight: 8,
            color: 'rgba(0, 0, 0, 0.87)',
          },
          titleStyle,
        ]}>
        {title}
      </MyText>
      {onClose && (
        <IconButton
          icon='close-circle'
          color='rgba(0, 0, 0, 0.54)'
          size={16}
          style={{ height: 24, width: 24 }}
          onPress={onClose}
        />
      )}
    </MyTouchable>
  );
};

export default Chip;
