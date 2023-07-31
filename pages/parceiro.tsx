import React from 'react';
import { View } from 'react-native';
import MyText from '~/components/MyText';
import { globalStyles } from '~/constants';

const Partner = () => {
  return (
    <View style={globalStyles.centralizer}>
      <a
        href='https://static.prontoentrega.com.br/download/ProntoEntrega-Instalador.exe'
        role='link'>
        <MyText>Baixe o app de mercado</MyText>
      </a>
    </View>
  );
};

export default Partner;
