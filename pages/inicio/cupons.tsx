import React from 'react';
import { View } from 'react-native';
import { WithBottomNav } from '~/components/Layout';
import MyText from '~/components/MyText';
import { globalStyles, myColors } from '~/constants';
import { ListMercadosHeader } from './lista-mercados';

function Cupons() {
  return (
    <>
      <ListMercadosHeader title={'Cupons'} />
      <View style={globalStyles.centralizer}>
        <MyText style={{ fontSize: 15, color: myColors.text2 }}>
          Nenhum cupom ainda
        </MyText>
      </View>
    </>
  );
}

// to the route outside Home
export { Cupons };

export default WithBottomNav(Cupons);
