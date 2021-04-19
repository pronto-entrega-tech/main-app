import React from 'react';
import { Searchbar } from 'react-native-paper';
import { myColors } from '../constants'

function MySearchbar ({onSubmit}: {onSubmit: () => void}) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = (query: string) => setSearchQuery(query);

  return (
    <Searchbar
      theme={{ colors: { primary: myColors.primaryColor}, mode: 'exact', dark: false }}
      style={{ borderRadius: 50, borderWidth: 2,
         borderColor: myColors.primaryColor, height: 38, elevation: 2}}
      placeholder="O que você procura?"
      onChangeText={onChangeSearch}
      value={searchQuery}
      onSubmitEditing={onSubmit}
      focusable={false}
    />
  );
};

export default MySearchbar