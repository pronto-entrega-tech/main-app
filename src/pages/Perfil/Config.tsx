import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button, Divider } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { myColors, device, globalStyles } from '../../constants';
import AppInfo from '../../../app.json'

interface configModel {
  text: string, navigate: string
}

function Config({ navigation }:
  {navigation: StackNavigationProp<any, any>}) {
  const data: configModel[] = [
    { text: 'Gerenciar notificações', navigate: 'ConfigNotifications' },
    { text: 'Apagar histórico de pesquisa', navigate: '' },
    { text: 'Politicas de privacidade', navigate: '' },
    { text: 'Termos de uso', navigate: '' },
    { text: 'Fale conosco', navigate: '' },
  ]
  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} >
        <View style={[styles.card, globalStyles.elevation3, globalStyles.darkBoader]} >
          {
            data.map(( item, index ) => (
            <View key={index} >
              {index != 0 ? <Divider style={styles.divider}/> : null}
              <View style={{justifyContent: 'center'}} >
                <Icon
                style={{position: 'absolute', alignSelf: 'flex-end'}}
                name='chevron-right'
                size={32}
                color={myColors.grey2} />
                <Button
                onPress={() => navigation.navigate(item.navigate)}
                title={item.text}
                containerStyle={index == 0? styles.top : index == data.length-1? styles.bottom : null}
                titleStyle={{color: myColors.text, fontSize: 17}}
                type='clear'/>
              </View>
            </View>
            ))
          }
        </View>
        <Text style={styles.versionText} >Versão {AppInfo.expo.version} ({AppInfo.expo.android.versionCode})</Text>
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
  versionText: {
    marginLeft: 16,
    color: myColors.text2,
    fontSize: 15,
  },
  top: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  bottom: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
})

export default Config