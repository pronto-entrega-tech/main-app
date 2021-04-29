import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button, Divider } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { myColors, globalStyles } from '../../constants';
import AppInfo from '../../../app.json'
import { saveOrdersList, saveUserStatus } from '../../functions/dataStorage';
import useMyContext from '../../functions/MyContext';
import MyButton from '../../components/MyButton';

interface configModel {
  title: string, navigate: string
}

function Config({ navigation }:
{navigation: StackNavigationProp<any, any>}) {
  const {isGuest, setIsGuest, toast} = useMyContext()
  let data: configModel[] = [
    {title: 'Gerenciar notificações', navigate: 'ConfigNotifications'},
    {title: 'Apagar histórico de pesquisa', navigate: 'Remove'},
    {title: 'Politicas de privacidade', navigate: ''},
    {title: 'Termos de uso', navigate: ''},
    {title: 'Fale conosco', navigate: ''},
    {title: 'Sair da conta', navigate: 'SignIn'}
  ]
  if (isGuest) data = data.filter(item => item.navigate != 'SignIn')
  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 58}}>
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
                <MyButton
                onPress={() => {
                  if (item.navigate == 'Remove')
                  return saveOrdersList([])
                  .then(() => toast('Apagado'))

                  if (item.navigate == 'SignIn')
                  return saveUserStatus('returning')
                  .then(() => setIsGuest(true))
                  .then(() => navigation.replace(item.navigate))
                  
                  navigation.navigate(item.navigate)
                }}
                title={item.title}
                buttonStyle={index == 0? styles.top : index == data.length-1? styles.bottom : {borderRadius: 0}}
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

export default Config