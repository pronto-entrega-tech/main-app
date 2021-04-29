import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Divider } from 'react-native-elements';
import MyButton from '../../components/MyButton';
import { myColors } from '../../constants';

interface ajudaModel {
  text: string, navigate: string, resposta: string
}

const list1: ajudaModel[] = [
  {
    text: 'Como encontrar o melhor preço',
    navigate: 'Questions',
    resposta: '[inserir resposta]',
  },
  {
    text: 'Como funciona os cupons',
    navigate: 'Questions',
    resposta: '[inserir resposta]',
  },
  {
    text: 'O aplicativo é seguro',
    navigate: 'Questions',
    resposta: '[inserir resposta]',
  }
]

const list2: ajudaModel[] = [
  {
    text: 'Envie sua dúvida',
    navigate: 'UploadQuestion',
    resposta: '',
  },
  {
    text: 'Quero ser parceiro',
    navigate: 'Questions',
    resposta: 'Contato: [inserir contato]',
  }
]

function List({title, list, navigation}:
   {title: string, list: ajudaModel[], navigation: StackNavigationProp<any, any>}) {
  return(
    <>
      <View style={styles.header} >
        <Text style={styles.headerText}>{title}</Text>
      </View>
      {
        list.map(( item, index ) => (
          <View key={index} >
            <MyButton
              onPress={() => navigation.navigate(item.navigate, [item.text, item.resposta])}
              type='clear'
              title={item.text}
              titleStyle={styles.buttonText}
              buttonStyle={styles.button} />
            <Divider style={styles.divider} />
          </View>
        ))
      }
    </>
  )
}

function Ajuda({ navigation }:
  {navigation: StackNavigationProp<any, any>}) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{backgroundColor: myColors.background, flex: 1}} >
      <List title='Perguntas Frenquentes' list={list1} navigation={navigation} />
      <List title='Atendimento' list={list2}  navigation={navigation}/>
    </ScrollView>
  )
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
    height: 44
  },
  buttonText: {
    color: myColors.text
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
    backgroundColor: myColors.divider2
  },
})

export default Ajuda