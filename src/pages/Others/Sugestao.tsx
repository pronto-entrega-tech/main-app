import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { myColors, device } from '../../constants';
import useMyContext from '../../functions/MyContext';

function Sugestao({navigation}:
{navigation: StackNavigationProp<any, any>}) {
  const [name, setName] = React.useState<string>('');
  const [nameError, setNameError] = React.useState<boolean>(false);
  const [city, setCity] = React.useState<string>('');
  const [cityError, setCityError] = React.useState<boolean>(false);
  const { toast } = useMyContext();
  
  return (
    <>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{backgroundColor: myColors.background, paddingHorizontal: 4, paddingTop: 20, paddingBottom: 40}}>
      <Input
        label='Nome do estabelecimento' 
        labelStyle={{ color: myColors.primaryColor }}  
        selectionColor={myColors.primaryColor}
        errorMessage={nameError? 'Insira o nome' : ''}
        onChangeText={v => {setNameError(false); setName(v)}} />
      <Input
        label='Cidade' 
        labelStyle={{color: myColors.primaryColor}}  
        selectionColor={myColors.primaryColor} 
        errorMessage={nameError? 'Insira a cidade' : ''}
        onChangeText={v => {setCityError(false); setCity(v)}}/>
      <Input
        label='Telefone para contato' 
        keyboardType='phone-pad'
        selectionColor={myColors.primaryColor} />
    </ScrollView>
    <Button
      onPress={() => {
        let error = false;
        if (name == '') {error = true; setNameError(true)};
        if (city == '') {error = true; setCityError(true)};
        if (error) return;
        toast('Sugestão enviada')
        navigation.goBack()
      }}
      title='Enviar'
      type='outline'
      theme={{ colors: { primary: myColors.primaryColor}}}
      buttonStyle={{borderWidth: 2, width: 160, height: 46, backgroundColor: '#fff'}}
      containerStyle={{position: 'absolute', alignSelf: 'center', bottom: device.iPhoneNotch ? 38 : 12}} />
    </>
  )
}

export default Sugestao