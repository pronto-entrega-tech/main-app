import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { Divider, Image, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { myColors, images, device, globalStyles } from '../../constants';

function Perfil({ navigation }:
  {navigation: StackNavigationProp<any, any>}) {
  const data1: {icon: string, title: string, navegate: string}[] = [
    {icon: 'account', title: 'Meu Perfil', navegate: 'MyProfile'},
    {icon: 'map-marker', title: 'Endereços salvos', navegate: 'Address'},
    {icon: 'bell', title: 'Notificações', navegate: 'Notifications'},
    {icon: 'credit-card-outline', title: 'Formas de pagamento', navegate: 'PaymentInApp'},
  ]
  const data2: {icon: string, title: string, navegate: string}[] = [
    {icon: 'help-circle', title: 'Central de ajuda', navegate: 'Help'},
    {icon: 'cog', title: 'Configurações', navegate: 'Config'},
    {icon: 'store', title: 'Sugerir estabelecimento', navegate: 'Sugestao'},
    {icon: 'logout-variant', title: 'Sair da conta', navegate: ''},
  ]
  const data: {icon: string, title: string, navegate: string}[][] = [data1, data2]
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[{paddingBottom: 50}, globalStyles.notch]}>
      <>
        <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 30, marginBottom: 22, marginTop: 18}} >
          <Image
            placeholderStyle={{backgroundColor: '#FFF'}}
            style={{height: 100, width: 100, }}
            source={images.account} />
          <Text style={{fontSize: 22, color: myColors.grey4, fontWeight: 'bold', marginLeft: 16}} >Convidado</Text>
        </View>
        {
          data.map((data, index) => (
            <View key={index} style={[styles.card, globalStyles.elevation3, globalStyles.darkBoader]} >
            {
              data.map(( item, index ) => (
              <View key={index} >
                {index != 0 ? <Divider style={styles.divider}/> : null}
                <View style={{justifyContent: 'center'}} >
                  <Icon
                  style={{position: 'absolute', alignSelf: 'flex-end', right: 4}}
                  name='chevron-right'
                  size={32}
                  color={myColors.grey2} />
                  <Button
                  onPress={() => navigation.navigate(item.navegate)}
                  title={item.title}
                  icon={<Icon name={item.icon} size={28} color={myColors.primaryColor}/>}
                  containerStyle={index == 0? styles.top : index == data.length-1? styles.bottom : null}
                  buttonStyle={styles.button}
                  titleStyle={{color: myColors.text2, fontSize: 17, marginLeft: 6}}
                  type='clear'
                  />
                </View>
              </View>
              ))
            }
          </View>
          ))
        }
      </>
    </ScrollView>
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
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  top: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  bottom: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  divider: {
    backgroundColor: myColors.divider3,
    height: 1,
    marginHorizontal: 8,
  },
  textHeader: {
    color: myColors.primaryColor,
    fontSize: 18,
    alignSelf: 'center',
    position: 'absolute',
  },
  button: {
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingVertical: 9,
  }
})

export default Perfil