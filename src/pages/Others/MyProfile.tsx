import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { BackHandler, ImageURISource, ScrollView } from 'react-native';
import { Button, Image, Input } from 'react-native-elements';
import Header from '../../components/Header';
import IconButton from '../../components/IconButton';
import ProfileModal from '../../components/ProfileModal';
import * as ImagePicker from 'expo-image-picker';
import { myColors, device, images } from '../../constants';
import { getProfile, saveProfile } from '../../functions/dataStorage';
import useMyContext from '../../functions/MyContext';
import Loading from '../../components/Loading';

export interface profileModel {
  photoUri?: ImageURISource,
  name?: string,
  email: string,
  CPF: string,
  phone: string,
}

const emailCorrectRega = /[a-zA-Z0-9.!#$%&'*+/=?`{|}~^-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const emailCompleteReg = /^(.+)@(.+)\.(.{2,})$/;

function cpfMask(value: string) {
  let v = value.replaceAll(/\D/g, '');
  if (v.length > 3)
  v = v.substring(0,3)+'.'+v.substring(3)
  if (v.length > 7)
  v = v.substring(0,7)+'.'+v.substring(7)
  if (v.length > 11)
  v = v.substring(0,11)+'-'+v.substring(11)
  return v
}

function cpfValidation(value: string) {
  const noWay = ["00000000000", "11111111111", "22222222222",
  "33333333333", "44444444444", "55555555555", "66666666666",
  "77777777777", "88888888888", "99999999999", "01234567890"]
  const v = value.replaceAll(/\D/g, '');

  if (noWay.includes(v)) {
    return false;
  }

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(v.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  if (resto == 10 || resto == 11) {
    resto = 0;
  }
  if (resto != parseInt(v.charAt(9))) {
    return false;
  }

  soma = 0;
  for (let i = 0; i < 10; i ++) {
      soma += parseInt(v.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  if (resto == 10 || resto == 11) {
      resto = 0;
  }
  return resto == parseInt(v.charAt(10));
}

function phoneMask(value: string) {
  let v = value.replaceAll(/\D/g, '');
  if (v.length > 0)
  v = v.substring(0,0)+'('+v.substring(0)
  if (v.length > 3)
  v = v.substring(0,3)+') '+v.substring(3)
  if (v.length > 6)
  v = v.substring(0,6)+' '+v.substring(6)
  if (v.length > 11)
  v = v.substring(0,11)+'-'+v.substring(11)
  return v
}

function Perfil({navigation}: {navigation: StackNavigationProp<any, any>}) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [ready, setReady] = React.useState<boolean>(true)
  const [buttonLoading, setButtonLoading] = React.useState<boolean>(false)
  const [profile, setProfile] = React.useState<profileModel>()
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [CPF, setCPF] = useState<string>('');
  const [isCpfValid, setCpfValid] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>('');
  const { toast } = useMyContext();

  React.useEffect(() => {
    ImagePicker.getPendingResultAsync().then(result => {
      if (result.length == 0) return;
      const image = result[result.length-1]
      if (!image.cancelled)
      getProfile()
        .then(profile => {
          profile.photoUri = result[result.length-1].uri;
          saveProfile(profile)
        })
        .catch(() => alert('Erro ao salvar foto de perfil'))
    })
    getProfile().then(profile => {
      setProfile(profile)
      setIsLoading(false)
    })
  }, []);

  React.useEffect(() => {
    if (!modalVisible) return;
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      setModalVisible(false)
      return true;
    });

    return () => backHandler.remove();
  }, [modalVisible]);

  if (isLoading) 
  return (
    <Loading />
  )

  return (
    <>
    <Header navigation={navigation} title={'Meu Perfil'}/>
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{backgroundColor: myColors.background, alignItems: 'center', paddingHorizontal: 4, paddingTop: 12, paddingBottom: 40}}>
      <Image
        placeholderStyle={{backgroundColor: '#FFF'}}
        style={{height: 120, width: 120, borderRadius: 120}}
        source={profile?.photoUri? profile.photoUri : images.account} />
      <IconButton onPress={() => setModalVisible(true)} icon='camera-outline' size={32} color={myColors.grey2} type='profile'/>
      <Input
        label='Nome Completo' 
        placeholder='Seu nome'
        defaultValue={profile?.name}
        labelStyle={{color: myColors.primaryColor}}  
        selectionColor={myColors.colorAccent}
        autoCompleteType='name'
        textContentType='name'
        onChangeText={v => setName(v)} />
      <Input
        label='Email'
        errorMessage={emailError}
        defaultValue={profile?.email}
        placeholder='nome@email.com' 
        keyboardType='email-address' 
        autoCapitalize='none' 
        autoCorrect={false}
        labelStyle={{color: myColors.primaryColor}}  
        selectionColor={myColors.colorAccent}
        autoCompleteType='email'
        textContentType='emailAddress'
        onChangeText={v => {
          setEmail(v)
          if (!emailCorrectRega.test(v.toLowerCase())) return setEmailError('Email inválido')
          setEmailError('')
          }} />
      <Input 
        label='CPF'
        errorMessage={CPF.length == 14 && !isCpfValid ? 'CPF inválido' : '' }
        defaultValue={profile?.CPF}
        placeholder='000.000.000-00' 
        keyboardType='numeric' 
        selectionColor={myColors.colorAccent}
        maxLength={14}
        value={CPF}
        onChangeText={v => {
          if (v != CPF) {
            setCPF(cpfMask(v))
            if (v.length == 14)
            setCpfValid(cpfValidation(v))
          }}} />
      <Input 
        label='Número de celular' 
        defaultValue={profile?.phone}
        placeholder='(00) 0 0000-0000' 
        keyboardType='phone-pad' 
        selectionColor={myColors.colorAccent}
        autoCompleteType='tel'
        textContentType='telephoneNumber'
        maxLength={16}
        value={phone}
        onChangeText={v => {v != phone? setPhone(phoneMask(v)):null}} />
    </ScrollView>
    <Button
      title='Atualizar perfil'
      type='outline'
      theme={{ colors: { primary: myColors.primaryColor}}}
      buttonStyle={{borderWidth: 2, width: 210, height: 46, backgroundColor: '#fff'}}
      containerStyle={{position: 'absolute', alignSelf: 'center', bottom: device.iPhoneNotch ? 38 : 12}}
      disabled={!ready}
      loading={buttonLoading}
      onPress={()=> {
        if (buttonLoading) return;
        setButtonLoading(true);
        saveProfile({
          photoUri: profile?.photoUri,
          name: (name != ''? name : undefined),
          email: email,
          CPF: CPF,
          phone: phone,
        })
        .then(() => {
          toast('Perfil atualizado')
          navigation.navigate('Profile', 'redirect')
        })
        }} />
    <ProfileModal isVisible={modalVisible} setVisible={() => setModalVisible(false)} setProfile={setProfile} />
    </>
  )
}

export default Perfil