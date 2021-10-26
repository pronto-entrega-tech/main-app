import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '~/components/Header';
import { WithBottomNav } from '~/components/Layout';
import MyButton from '~/components/MyButton';
import MyDivider from '~/components/MyDivider';
import { myColors } from '~/constants';

interface HelpOption {
  route: string;
  title: string;
  body: string;
  navigate?: string;
}

export const helpList1: HelpOption[] = [
  {
    route: 'encontrar-melhor-preco',
    title: 'Como encontrar o melhor preço',
    body: '[inserir resposta]',
  },
  {
    route: 'notificacoes-das-promocoes',
    title: 'Como receber notificações das promoções de um produto',
    body: 'Toque no produto e depois toque no sininho no canto superior direito da tela',
  },
  {
    route: 'precos',
    title: 'Os preços no ProntoEntrega e na loja física são os mesmos',
    body: 'Os preços na plataforma são exclusivos para a ProntoEntrega',
  },
  {
    route: 'cupons',
    title: 'Como funciona os cupons',
    body: '[inserir resposta]',
  },
  {
    route: 'seguranca',
    title: 'O aplicativo é seguro',
    body: '[inserir resposta]',
  },
];

const helpList2: HelpOption[] = [
  {
    route: '',
    title: 'Envie sua dúvida',
    body: '',
    navigate: '/mandar-pergunta',
  },
  {
    route: 'parceiro',
    title: 'Quero ser parceiro',
    body: 'Contato: [inserir contato]',
  },
];

export const helpList = [...helpList1, ...helpList2];

function HelpList({ title, list }: { title: string; list: HelpOption[] }) {
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
      </View>
      {list.map((item, index) => (
        <View key={index}>
          <MyButton
            path={item.navigate ?? `/perfil/perguntas/${item.route}`}
            type='clear'
            title={item.title}
            titleStyle={styles.buttonText}
            buttonStyle={styles.button}
          />
          <MyDivider style={styles.divider} />
        </View>
      ))}
    </>
  );
}

function Help() {
  return (
    <>
      <Header title={'Central de ajuda'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: myColors.background,
          flex: 1,
        }}>
        <HelpList title='Perguntas Frenquentes' list={helpList1} />
        <HelpList title='Atendimento' list={helpList2} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: myColors.primaryColor,
  },
  headerText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: {
    height: 48,
  },
  buttonText: {
    color: myColors.text,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  divider: {
    marginHorizontal: 20,
    backgroundColor: myColors.divider2,
  },
});

export default WithBottomNav(Help);
