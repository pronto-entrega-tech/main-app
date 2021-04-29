import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, TextInput } from 'react-native';
import { Input } from 'react-native-elements';
import MyButton from '../../components/MyButton';
import { myColors, device } from '../../constants';
import useMyContext from '../../functions/MyContext';

function Sugestao({navigation}:
{navigation: StackNavigationProp<any, any>}) {
  const [name, setName] = React.useState<string>('');
  const [nameError, setNameError] = React.useState<boolean>(false);
  const [city, setCity] = React.useState<string>('');
  const [cityError, setCityError] = React.useState<boolean>(false);
  const { toast } = useMyContext();

  const inputCity = React.useRef<TextInput | null>();
  const inputPhone = React.useRef<TextInput | null>();
  
  return (
    <>
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={device.web? {height: device.height-56}:{}}
      contentContainerStyle={{backgroundColor: myColors.background, paddingHorizontal: 4, paddingTop: 20, paddingBottom: 66}}>
      <Input
        label='Nome do estabelecimento' 
        labelStyle={{ color: myColors.primaryColor }}  
        selectionColor={myColors.primaryColor}
        errorMessage={nameError? 'Insira o nome' : ''}
        onChangeText={v => {setNameError(false); setName(v)}}
        returnKeyType='next'
        onSubmitEditing={() => inputCity.current?.focus()} />
      <Input
        label='Cidade' 
        labelStyle={{color: myColors.primaryColor}}  
        selectionColor={myColors.primaryColor} 
        errorMessage={nameError? 'Insira a cidade' : ''}
        onChangeText={v => {setCityError(false); setCity(v)}}
        returnKeyType='next'
        ref={ref => inputCity.current = ref}
        onSubmitEditing={() => inputPhone.current?.focus()} />
      <Input
        label='Telefone para contato' 
        keyboardType='phone-pad'
        selectionColor={myColors.primaryColor}
        ref={ref => inputPhone.current = ref} />
    </ScrollView>
    <MyButton
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
      buttonStyle={{position: 'absolute', alignSelf: 'center', bottom: device.iPhoneNotch ? 38 : 12, borderWidth: 2, width: 160, height: 46, backgroundColor: '#fff'}} />
    </>
  )
}

export default Sugestao