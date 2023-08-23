import React, { useState } from 'react';
import { View, StyleProp, TextInput, ViewStyle } from 'react-native';
import { globalStyles, myColors, myFonts } from '~/constants';
import IconButton from './IconButton';

const MySearchBar = ({
  style,
  defaultValue = '',
  onSubmit,
}: {
  style?: StyleProp<ViewStyle>;
  defaultValue?: string;
  onSubmit: (query: string) => void;
}) => {
  const [query, setSearchQuery] = useState(defaultValue);

  const submit = () => {
    if (query) onSubmit(query);
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
          backgroundColor: 'white',
        },
        globalStyles.elevation3,
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
        disabled={!query}
        onPress={submit}
      />
      <TextInput
        style={{
          flex: 1,
          paddingLeft: 8,
          fontSize: 18,
          fontFamily: myFonts.Regular,
        }}
        placeholder='O que você procura?'
        role='searchbox'
        enterKeyHint='search'
        value={query}
        onChangeText={setSearchQuery}
        onSubmitEditing={submit}
      />
      {!!query && (
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
};

export default MySearchBar;
