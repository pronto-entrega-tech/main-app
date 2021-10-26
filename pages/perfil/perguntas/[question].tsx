import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '~/components/Header';
import { WithBottomNav } from '~/components/Layout';
import { myColors } from '~/constants';
import useRouting from '~/hooks/useRouting';
import { helpList } from '../ajuda';

function Questions() {
  const { params } = useRouting();
  // if `params.question` is undefined, `question` will be too
  const [question] = helpList.filter((i) => i.route === params.question);

  return (
    <>
      <Header title={'Perguntas frequentes'} />
      <View style={styles.conteiner}>
        {question && (
          <>
            <Text style={styles.title}>{question.title}</Text>
            <Text style={styles.body}>{question.body}</Text>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  conteiner: { backgroundColor: myColors.background, flex: 1, padding: 16 },
  title: { fontSize: 20, color: myColors.grey4 },
  body: { fontSize: 15, color: myColors.text2, marginTop: 8 },
});

export default WithBottomNav(Questions);

export const getStaticPaths: GetStaticPaths = async () => {
  const helpPaths = helpList
    .filter((help) => help.route) // filter empty strings
    .map((help) => ({
      params: { question: help.route },
    }));
  return {
    paths: helpPaths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} };
};
