import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { myColors } from '../constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function Rating({value, size = 'small', style}: {value: number, size?: 'small'|'medium', style?: StyleProp<ViewStyle>}) {
  const sizeV = size == 'small'? 16 : 24;
  return (
    <View style={[{flexDirection: 'row'}, style]} >
      {
        [0,1,2,3,4].map((i) => (
          <View key={i} >
            {i+1 <= value? null :
              <Icon size={sizeV} name='star' color={myColors.divider3} />
            }
            {i >= value? null :
              <Icon
                style={{
                  position: i+1 <= value? 'relative' : 'absolute',
                  width: i+1 <= value? sizeV : 2+((sizeV-4)*(value-i)),
                }}
                size={sizeV}
                name='star'
                color={myColors.rating} />
            }
          </View>
        ))
      }
    </View>
  )
}

export default Rating