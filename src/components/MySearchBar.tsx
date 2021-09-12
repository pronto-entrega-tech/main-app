import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { device, myColors } from '~/constants';

function MySearchbar({
  style,
  onSubmit,
}: {
  style?: StyleProp<ViewStyle>;
  onSubmit: (search: string) => void;
}) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = (query: string) => setSearchQuery(query);

  return (
    <Searchbar
      theme={{
        colors: { primary: myColors.primaryColor },
        mode: 'exact',
        dark: false,
      }}
      style={[
        {
          borderRadius: 50,
          borderWidth: 2,
          borderColor: myColors.primaryColor,
          height: 38,
          elevation: 2,
        },
        style,
      ]}
      placeholder='O que você procura?'
      onChangeText={onChangeSearch}
      value={searchQuery}
      onKeyPress={(e) =>
        e.nativeEvent.key === 'Enter' && device.web
          ? onSubmit(searchQuery)
          : null
      }
      onSubmitEditing={() => (!device.web ? onSubmit(searchQuery) : null)}
      focusable={false}
    />
  );
}

export default MySearchbar;
