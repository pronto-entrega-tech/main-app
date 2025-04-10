import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";
import { View, StyleSheet } from "react-native";
import MyHeader from "~/components/MyHeader";
import { WithBottomNav } from "~/components/Layout";
import useRouting from "~/hooks/useRouting";
import { helpList } from "../ajuda";
import MyText from "~/components/MyText";
import myColors from "~/constants/myColors";

const Questions = () => {
  const { params } = useRouting();
  // if `params.question` is undefined, `question` will be too
  const [question] = helpList.filter((i) => i.route === params.question);

  return (
    <>
      <MyHeader title="Perguntas frequentes" />
      <View style={styles.container}>
        {question && (
          <>
            <MyText style={styles.title}>{question.title}</MyText>
            <MyText style={styles.body}>{question.body}</MyText>
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: myColors.background, flex: 1, padding: 16 },
  title: { fontSize: 20, color: myColors.grey4 },
  body: { fontSize: 15, color: myColors.text2, marginTop: 8 },
});

export default WithBottomNav(Questions);

export const getStaticPaths: GetStaticPaths = async () => {
  const helpPaths = helpList
    .filter((help) => help.route) // filter empty strings
    .map((help) => ({ params: { question: help.route } }));

  return {
    paths: helpPaths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} };
};
