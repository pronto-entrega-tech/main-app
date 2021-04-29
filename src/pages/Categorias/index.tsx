import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button, Divider } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { myColors, globalStyles, device } from '../../constants';
import MyButton from '../../components/MyButton';

export function CategoriasHeader() {
  return (
    <View style={[styles.header, globalStyles.notch]}>
      <Text style={styles.textHeader}>Categorias</Text>
      <Divider style={styles.headerDivider}/>
    </View>
  )
}

export const categorias: string[] = [
  "Alimentos", "Bebidas", "Carnes e cia", "Padaria",
  "Frios e Laticínios", "Hortifrúti", "Enlatados",
  "Cosméticos", "Limpeza", "Utilitários"
]

function Categorias({ navigation }:
  {navigation: StackNavigationProp<any, any>}) {
  return (
    <>
      <CategoriasHeader/>
      <ScrollView
      contentContainerStyle={{paddingBottom: 50}}
      showsVerticalScrollIndicator={false} >
        <View style={[styles.card, globalStyles.elevation3, globalStyles.darkBoader]} >
          {
            categorias.map(( item, index ) => (
            <View key={index} >
              {index != 0 ? <Divider style={styles.divider}/> : null}
              <View style={{justifyContent: 'center'}} >
                <Icon
                  style={{position: 'absolute', alignSelf: 'flex-end'}}
                  name='chevron-right'
                  size={32}
                  color={myColors.grey2} />
                <MyButton
                  onPress={() => navigation.navigate('Search', item)}
                  title={item}
                  buttonStyle={index == 0? styles.top : index == categorias.length-1? styles.bottom : {borderRadius: 0}}
                  titleStyle={{color: myColors.grey3, fontSize: 17}}
                  type='clear'/>
              </View>
            </View>
            ))
          }
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    height: 48,
  },
  headerDivider: {
    marginTop: 47,
    backgroundColor: myColors.divider3,
    height: 1,
    marginHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
  },
  divider: {
    backgroundColor: myColors.divider3,
    height: 1,
    marginHorizontal: 8,
  },
  textHeader: {
    color: myColors.primaryColor,
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    position: 'absolute',
  },
  top: {
    borderRadius: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  bottom: {
    borderRadius: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
})

export default {
  Categorias,
  CategoriasHeader,
}