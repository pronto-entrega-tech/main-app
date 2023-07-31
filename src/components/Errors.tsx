import React from 'react';
import { View, StyleSheet } from 'react-native';
import { globalStyles, myColors } from '~/constants';
import { MyContextValues } from '~/core/MyContext';
import MyButton from './MyButton';
import MyText from './MyText';

export const serverError = (alert: MyContextValues['alert']) =>
  alert('Erro ao se conectar com o servidor', 'Tente novamente mais tarde');

const Connection = () => (
  <View style={globalStyles.centralizer}>
    <MyText style={styles.title}>Sem internet</MyText>
    <MyText style={styles.subtitle}>Verifique sua conexão de internet</MyText>
  </View>
);
const Server = (onPress?: () => void) => (
  <View style={globalStyles.centralizer}>
    <MyText style={styles.title}>Erro ao se conectar com o servidor</MyText>
    <MyText style={styles.subtitle}>Tente novamente mais tarde</MyText>
    <MyButton title='Tentar novamente' onPress={onPress} type='clear' />
  </View>
);
const Saving = (onPress?: () => void) => (
  <View style={globalStyles.centralizer}>
    <MyText style={styles.title}>Erro tentar ao salvar</MyText>
    <MyButton title='Tentar novamente' onPress={onPress} type='clear' />
  </View>
);
const MissingAddress = () => (
  <View style={[globalStyles.centralizer, { minHeight: 100 }]}>
    <MyText style={styles.title}>Primeiro escolha um endereço</MyText>
    <MyText style={styles.subtitle}>
      Para ver as ofertas próximas de voce
    </MyText>
  </View>
);
const MissingAuth = (title?: string) => (
  <View style={[globalStyles.centralizer, { minHeight: 100 }]}>
    <MyText style={{ color: myColors.text3, fontSize: 19, marginBottom: 8 }}>
      {title ?? 'Primeiro entre'}
    </MyText>
    <MyButton
      title='Entrar ou cadastrar-se'
      screen='SignIn'
      type='clear'
      buttonStyle={{ marginTop: 12 }}
    />
  </View>
);
export const NothingFeed = () => (
  <View style={[globalStyles.centralizer, { minHeight: 100 }]}>
    <MyText style={styles.title}>Nenhum mercado na região ainda</MyText>
    <MyText style={styles.subtitle}>Volte mais tarde</MyText>
  </View>
);
const NothingProduct = () => (
  <View style={globalStyles.centralizer}>
    <MyText style={styles.title}>Nenhum produto encontrado</MyText>
  </View>
);
const NothingMarket = () => (
  <View style={globalStyles.centralizer}>
    <MyText style={styles.title}>Nenhum mercado encontrado</MyText>
  </View>
);
const NothingSearch = () => (
  <View style={globalStyles.centralizer}>
    <MyText style={styles.title}>Nenhum produto encontrado</MyText>
  </View>
);
const NothingOrder = () => (
  <View style={globalStyles.centralizer}>
    <MyText style={styles.title}>Nenhum pedido encontrado</MyText>
  </View>
);

export type MyErrors =
  | 'server'
  | 'connection'
  | 'saving'
  | 'missing_auth'
  | 'missing_address'
  | 'nothing_feed'
  | 'nothing_product'
  | 'nothing_market'
  | 'nothing_search'
  | 'nothing_order'
  | null;

const Errors = ({
  error,
  title,
  onPress,
}: {
  error: MyErrors;
  title?: string;
  onPress?: () => void;
}) =>
  ({
    server: () => Server(onPress),
    connection: () => Connection(),
    saving: () => Saving(onPress),
    missing_auth: () => MissingAuth(title),
    missing_address: () => MissingAddress(),
    nothing_feed: () => NothingFeed(),
    nothing_product: () => NothingProduct(),
    nothing_market: () => NothingMarket(),
    nothing_search: () => NothingSearch(),
    nothing_order: () => NothingOrder(),
  }[error ?? 'server']());

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    color: myColors.text3,
    fontSize: 19,
  },
  subtitle: {
    textAlign: 'center',
    marginHorizontal: 8,
    marginTop: 4,
    marginBottom: 6,
    color: myColors.text2,
  },
});

export default Errors;
