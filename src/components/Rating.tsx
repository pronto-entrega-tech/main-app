import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { myColors } from '~/constants';
import { range } from '~/functions/range';
import MyIcon from './MyIcon';
import MyTouchable from './MyTouchable';

const Rating = ({
  value,
  onChange: change,
  size = 'medium',
  style,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: 'small' | 'medium' | 'big';
  style?: StyleProp<ViewStyle>;
}) => {
  const sizeV = {
    small: 16,
    medium: 24,
    big: 36,
  }[size];

  return (
    <View style={[{ flexDirection: 'row' }, style]}>
      {range(1, 5).map((i) => {
        const body = (
          <>
            {i > value && (
              <MyIcon size={sizeV} name='star' color={myColors.divider3} />
            )}
            {i - 1 < value && (
              <MyIcon
                style={{
                  overflow: 'hidden',
                  position: i <= value ? 'relative' : 'absolute',
                  width: i <= value ? sizeV : 2 + (sizeV - 4) * (value % 1),
                  padding: 0,
                }}
                size={sizeV}
                name='star'
                color={myColors.rating}
              />
            )}
          </>
        );
        return change ? (
          <MyTouchable key={i} onPress={() => change(i)}>
            {body}
          </MyTouchable>
        ) : (
          <View key={i}>{body}</View>
        );
      })}
    </View>
  );
};

export default Rating;
