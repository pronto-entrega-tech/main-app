import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import MySearchbar from '~/components/MySearchBar';
import ProdListHorizontal from '~/components/ProdListHorizontal';
import { globalStyles, myColors } from '~/constants';
import useMyContext from '~/core/MyContext';
import { ListMercadosHeader } from './lista-mercados';
import MyText from '~/components/MyText';
import { WithBottomNav } from '~/components/Layout';

function Favoritos({
  navigation,
}: {
  navigation: StackNavigationProp<any, any>;
}) {
  const { favorites } = useMyContext();

  return (
    <>
      <ListMercadosHeader title={'Favoritos'} />
      <View style={{ marginTop: 12, marginBottom: 8, paddingHorizontal: 16 }}>
        <MySearchbar onSubmit={() => {}} />
      </View>
      {favorites.size === 0 ? (
        <View style={globalStyles.centralizer}>
          <MyText
            style={{
              fontSize: 15,
              color: myColors.text2,
            }}>
            Nenhum produto salvo
          </MyText>
        </View>
      ) : (
        <ProdListHorizontal
          style={{ paddingTop: 12 }}
          data={Array.from(favorites.values()).reverse()}
        />
      )}
    </>
  );
}

export default WithBottomNav(Favoritos);
