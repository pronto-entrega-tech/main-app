import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import MyHeader from "~/components/MyHeader";
import { WithBottomNav } from "~/components/Layout";
import MyButton from "~/components/MyButton";
import MyDivider from "~/components/MyDivider";
import MyText from "~/components/MyText";
import myColors from "~/constants/myColors";
import myFonts from "~/constants/myFonts";

type HelpOption = {
  route: string;
  title: string;
  body: string;
  navigate?: string;
};

export const helpList1: HelpOption[] = [
  {
    route: "encontrar-melhor-preco",
    title: "Como encontrar o melhor preço",
    body: "[inserir resposta]",
  },
  {
    route: "notificacoes-das-promocoes",
    title: "Como receber notificações das promoções de um produto",
    body: "Toque no produto e depois toque no sininho no canto superior direito da tela",
  },
  {
    route: "precos",
    title: "Os preços no ProntoEntrega e na loja física são os mesmos",
    body: "Os preços na plataforma são exclusivos para a ProntoEntrega",
  },
  {
    route: "cupons",
    title: "Como funciona os cupons",
    body: "[inserir resposta]",
  },
  {
    route: "seguranca",
    title: "O aplicativo é seguro",
    body: "[inserir resposta]",
  },
];

const helpList2: HelpOption[] = [
  {
    route: "",
    title: "Envie sua dúvida",
    body: "",
    navigate: "UploadQuestion",
  },
  {
    route: "parceiro",
    title: "Quero ser parceiro",
    body: "Contato: [inserir contato]",
  },
];

export const helpList = [...helpList1, ...helpList2];

const HelpList = ({ title, list }: { title: string; list: HelpOption[] }) => (
  <>
    <View style={styles.header}>
      <MyText style={styles.headerText}>{title}</MyText>
    </View>
    {list.map((item, index) => (
      <View key={index}>
        <MyButton
          screen={item.navigate ?? "Questions"}
          params={{ question: item.route }}
          type="clear"
          title={item.title}
          titleStyle={styles.buttonText}
          buttonStyle={styles.button}
        />
        <MyDivider style={styles.divider} />
      </View>
    ))}
  </>
);

const Help = () => (
  <>
    <MyHeader title="Central de ajuda" />
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <HelpList title="Perguntas Frequentes" list={helpList1} />
      <HelpList title="Atendimento" list={helpList2} />
    </ScrollView>
  </>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: myColors.background,
    paddingBottom: 56,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: myColors.primaryColor,
  },
  headerText: {
    color: "#FFF",
    fontFamily: myFonts.Bold,
    fontSize: 16,
  },
  button: {
    minHeight: 48,
  },
  buttonText: {
    color: myColors.text,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  divider: {
    marginHorizontal: 20,
    backgroundColor: myColors.divider2,
  },
});

export default WithBottomNav(Help);
