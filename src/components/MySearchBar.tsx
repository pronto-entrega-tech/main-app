import React from 'react';
import { View, StyleProp, TextInput, ViewStyle } from 'react-native';
import { device, myColors, myFonts } from '~/constants';
import IconButton from './IconButton';

function MySearchbar({
  style,
  search = '',
  onSubmit,
}: {
  style?: StyleProp<ViewStyle>;
  search?: string;
  onSubmit: (search: string) => void;
}) {
  const [searchQuery, setSearchQuery] = React.useState(search);
  const _onSubmit = () => {
    if (searchQuery) onSubmit(searchQuery);
  };

  return (
    <View
      style={[
        {
          flexGrow: 1,
          flexDirection: 'row',
          borderRadius: 50,
          borderWidth: 2,
          borderColor: myColors.primaryColor,
          height: 38,
          elevation: 2,
        },
        style,
      ]}>
      <IconButton
        icon='magnify'
        color='rgba(0, 0, 0, 0.54)'
        type='clear'
        style={{
          alignSelf: 'center',
          width: 48,
          padding: 12,
          aspectRatio: 1,
        }}
        disabled={!searchQuery}
        onPress={_onSubmit}
      />
      <TextInput
        style={{
          flex: 1,
          paddingLeft: 8,
          fontSize: 18,
          fontFamily: myFonts.Regular,
        }}
        placeholder='O que você procura?'
        accessibilityRole='search'
        onChangeText={setSearchQuery}
        value={searchQuery}
        {...(device.web
          ? {
              onKeyPress: (e) => e.nativeEvent.key === 'Enter' && _onSubmit(),
            }
          : { onSubmitEditing: _onSubmit })}
      />
      {!!searchQuery && (
        <IconButton
          icon='close'
          color='rgba(0, 0, 0, 0.54)'
          type='clear'
          style={{
            alignSelf: 'center',
            width: 48,
            aspectRatio: 1,
            padding: 12,
          }}
          onPress={() => setSearchQuery('')}
        />
      )}
    </View>
  );
}

export default MySearchbar;
