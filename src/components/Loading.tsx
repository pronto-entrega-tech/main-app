import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { myColors } from '~/constants';
import MyButton from './MyButton';
import MyText from './MyText';

function Loading({ title }: { title?: string }) {
  return (
    <View style={styles.conteiner}>
      {!title ? null : <MyText style={styles.loading}>{title}</MyText>}
      <ActivityIndicator color={myColors.loading} size='large' />
    </View>
  );
}

function Connection(onPress: () => void) {
  return (
    <View style={styles.conteiner}>
      <MyText style={styles.title}>Sem conexão de internet</MyText>
      <MyText style={styles.subtitle}>
        Verifique sua conexão de internet e tente novamente
      </MyText>
      <MyButton type='clear' title='Tentar novamente' onPress={onPress} />
    </View>
  );
}

function Server(onPress: () => void) {
  return (
    <View style={styles.conteiner}>
      <MyText style={styles.title}>Erro ao se conectar com o servidor</MyText>
      <MyText style={styles.subtitle}>Tente novamente mais tarde</MyText>
      <MyButton type='clear' title='Tentar novamente' onPress={onPress} />
    </View>
  );
}

function NothingFeed() {
  return (
    <View style={styles.conteiner}>
      <MyText style={styles.title}>Nenhum mercado na região ainda</MyText>
      <MyText style={styles.subtitle}>Volte mais tarde</MyText>
    </View>
  );
}

function NothingMarket() {
  return (
    <View style={styles.conteiner}>
      <MyText style={styles.title}>Nenhum mercado encontrado</MyText>
    </View>
  );
}

function NothingSearch() {
  return (
    <View style={styles.conteiner}>
      <MyText style={styles.title}>Nenhum produto encontrado</MyText>
    </View>
  );
}

export type myErrors =
  | 'server'
  | 'connection'
  | 'nothing'
  | 'nothing_feed'
  | 'nothing_market'
  | 'nothing_search'
  | null;
function Errors({ error, onPress }: { error: myErrors; onPress: () => void }) {
  switch (error) {
    case 'connection':
      return Connection(onPress);
    case 'server':
      return Server(onPress);
    case 'nothing':
      return NothingFeed();
    case 'nothing_feed':
      return NothingFeed();
    case 'nothing_market':
      return NothingMarket();
    case 'nothing_search':
      return NothingSearch();

    default:
      return null;
  }
}

const styles = StyleSheet.create({
  loading: {
    color: myColors.text3,
    fontSize: 16,
    marginBottom: 16,
  },
  conteiner: {
    backgroundColor: myColors.background,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
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

export { Errors };
export default Loading;
