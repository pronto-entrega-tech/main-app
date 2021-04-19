import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { myColors, device } from '../../constants';

function Sugestao({navigation}:
  {navigation: StackNavigationProp<any, any>}) {
  return (
    <>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{backgroundColor: myColors.background, paddingHorizontal: 4, paddingTop: 20, paddingBottom: 40}}>
      <Input
        label='Nome do estabelecimento' 
        labelStyle={{ color: myColors.primaryColor }}  
        selectionColor={myColors.primaryColor} />
      <Input
        label='Cidade' 
        labelStyle={{color: myColors.primaryColor}}  
        selectionColor={myColors.primaryColor} />
      <Input
        label='Telefone para contato' 
        keyboardType='phone-pad'
        selectionColor={myColors.primaryColor} />
    </ScrollView>
    <Button
      onPress={() => navigation.goBack()}
      title='Enviar'
      type='outline'
      theme={{ colors: { primary: myColors.primaryColor}}}
      buttonStyle={{borderWidth: 2, width: 160, height: 46, backgroundColor: '#fff'}}
      containerStyle={{position: 'absolute', alignSelf: 'center', bottom: device.iPhoneNotch ? 38 : 12}} />
    </>
  )
}

export default Sugestao