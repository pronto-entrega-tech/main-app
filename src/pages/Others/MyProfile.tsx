import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import Header from '~/components/Header';
import {
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Input } from 'react-native-elements';
import { myColors, device } from '~/constants';
import { getProfile, saveProfile } from '~/functions/dataStorage';
import useMyContext from '~/functions/MyContext';
import Loading from '~/components/Loading';
import BottomModal from '~/components/BottomModal';
import IconButtonText from '~/components/IconButtonText';
import MyButton from '~/components/MyButton';

export interface profileModel {
  name?: string;
  email: string;
  CPF: string;
  phone: string;
}

const emailCorrectRega =
  /[a-zA-Z0-9.!#$%&'*+/=?`{|}~^-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const emailCompleteReg = /^(.+)@(.+)\.(.{2,})$/;

function cpfMask(v: string) {
  v = v.replace(/\D/g, '');
  if (v.length > 3) v = v.substring(0, 3) + '.' + v.substring(3);
  if (v.length > 7) v = v.substring(0, 7) + '.' + v.substring(7);
  if (v.length > 11) v = v.substring(0, 11) + '-' + v.substring(11);
  return v;
}

function cpfValidation(value: string) {
  const noWay = [
    '00000000000',
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999',
    '01234567890',
  ];
  const v = value.replace(/\D/g, '');

  if (noWay.includes(v)) {
    return false;
  }

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += +v.charAt(i) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) {
    resto = 0;
  }
  if (resto !== +v.charAt(9)) {
    return false;
  }

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += +v.charAt(i) * (11 - i);
  }
  resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) {
    resto = 0;
  }
  return resto === +v.charAt(10);
}

function phoneMask(v: string) {
  v = v.replace(/\D/g, '');
  if (v.length > 0) v = v.substring(0, 0) + '(' + v.substring(0);
  if (v.length > 3) v = v.substring(0, 3) + ') ' + v.substring(3);
  if (v.length > 6) v = v.substring(0, 6) + ' ' + v.substring(6);
  if (v.length > 11) v = v.substring(0, 11) + '-' + v.substring(11);
  return v;
}

function Perfil({ navigation }: { navigation: StackNavigationProp<any, any> }) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [ready, setReady] = React.useState<boolean>(true);
  const [profile, setProfile] = React.useState<profileModel>();
  //const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [CPF, setCPF] = useState<string>('');
  const [isCpfValid, setCpfValid] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>('');
  const { toast } = useMyContext();

  React.useEffect(() => {
    /* ImagePicker.getPendingResultAsync().then(result => {
      if (result.length == 0) return;
      const image = result[result.length-1]
      if (!image.cancelled)
      getProfile()
        .then(profile => {
          profile.photoUri = result[result.length-1].uri;
          saveProfile(profile)
        })
        .catch(() => alert('Erro ao salvar foto de perfil'))
    }) */
    getProfile().then((profile) => {
      setProfile(profile);
      setIsLoading(false);
    });
  }, []);

  /* const openCamera = () => {
    setIsModalVisible(false);
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') return;
      
      const image = await ImagePicker.launchCameraAsync({aspect: [1,1], quality: 0.5});
      if (image.cancelled) return;
      getProfile()
        .then(profile => {
          profile.photoUri = {uri: image.uri}
          saveProfile(profile)
          setProfile(profile)
        })
        .catch(() => alert('Erro ao salvar foto de perfil'))
    })();
  }
  
  const openPhotos = () => {
    setIsModalVisible(false);
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') return;
      
      const image = await ImagePicker.launchImageLibraryAsync({allowsEditing: true, aspect: [1,1], quality: 0.5});
      if (image.cancelled) return;
      getProfile()
        .then(profile => {
          profile.photoUri = {uri: image.uri}
          saveProfile(profile)
          setProfile(profile)
        })
        .catch(() => alert('Erro ao salvar foto de perfil'))
    })();
  }
  
  const removePhoto = () => {
    setIsModalVisible(false);
    getProfile()
      .then(profile => {
        profile.photoUri = undefined
        saveProfile(profile)
        setProfile(profile)
      })
      .catch(() => alert('Erro ao remover foto de perfil'))
  } */

  const inputEmail = React.useRef<TextInput | null>();
  const inputCPF = React.useRef<TextInput | null>();
  const inputPhone = React.useRef<TextInput | null>();

  if (isLoading) return <Loading />;

  return (
    <KeyboardAvoidingView
      behavior='height'
      style={[
        { marginBottom: device.iPhoneNotch ? 28 : 0 },
        device.web ? { height: device.height } : { flex: 1 },
      ]}>
      <Header navigation={navigation} title={'Meu Perfil'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: myColors.background,
          alignItems: 'center',
          paddingTop: 24,
          paddingHorizontal: 4,
          paddingBottom: 66,
        }}>
        {/* <Image
          placeholderStyle={{backgroundColor: '#FFF'}}
          containerStyle={{height: 120, width: 120, borderRadius: 120}}
          source={profile?.photoUri? profile.photoUri : images.account} />
        <IconButton
          onPress={() => setIsModalVisible(true)}
          icon='camera-outline'
          size={32}
          color={myColors.grey2}
          type='profile'/> */}
        <Input
          label='Nome Completo'
          placeholder='Seu nome'
          defaultValue={profile?.name}
          labelStyle={{ color: myColors.primaryColor }}
          selectionColor={myColors.colorAccent}
          autoCompleteType='name'
          textContentType='name'
          onChangeText={(v) => setName(v)}
          returnKeyType='next'
          onSubmitEditing={() => inputEmail.current?.focus()}
        />
        <Input
          label='Email'
          errorMessage={emailError}
          defaultValue={profile?.email}
          placeholder='nome@email.com'
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          labelStyle={{ color: myColors.primaryColor }}
          selectionColor={myColors.colorAccent}
          autoCompleteType='email'
          textContentType='emailAddress'
          onChangeText={(v) => {
            setEmail(v);
            if (!emailCorrectRega.test(v.toLowerCase()))
              return setEmailError('Email inválido');
            setEmailError('');
          }}
          returnKeyType='next'
          ref={(ref) => (inputEmail.current = ref)}
          onSubmitEditing={() => inputCPF.current?.focus()}
        />
        <Input
          label='CPF'
          errorMessage={CPF.length == 14 && !isCpfValid ? 'CPF inválido' : ''}
          defaultValue={profile?.CPF}
          placeholder='000.000.000-00'
          keyboardType='numeric'
          selectionColor={myColors.colorAccent}
          maxLength={14}
          value={CPF}
          onChangeText={(v) => {
            if (v != CPF) {
              setCPF(cpfMask(v));
              if (v.length == 14) setCpfValid(cpfValidation(v));
            }
          }}
          returnKeyType='next'
          ref={(ref) => (inputCPF.current = ref)}
          onSubmitEditing={() => inputPhone.current?.focus()}
        />
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
          onChangeText={(v) => {
            v != phone ? setPhone(phoneMask(v)) : null;
          }}
          ref={(ref) => (inputPhone.current = ref)}
        />
      </ScrollView>
      <MyButton
        title='Atualizar perfil'
        type='outline'
        buttonStyle={styles.button}
        disabled={!ready}
        onPress={() => {
          setIsLoading(true);
          saveProfile({
            name: name !== '' ? name : undefined,
            email: email,
            CPF: CPF,
            phone: phone,
          }).then(() => {
            toast('Perfil atualizado');
            navigation.navigate('Profile', 'redirect');
          });
        }}
      />
      {/* <BottomModal
        isVisible={isModalVisible}
        onDismiss={() => setIsModalVisible(false)}
        style={styles.modal} >
          <IconButtonText icon='camera' text={`Abrir\ncâmera`} onPress={openCamera} type='profile2' />
          <IconButtonText icon='image' text={`Adicionar\nfoto`} onPress={openPhotos} type='profile2' />
          <IconButtonText icon='delete' text={`Remover\nfoto`} onPress={removePhoto} type='profile2' />
      </BottomModal> */}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  modal: {
    paddingRight: '20%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: 24,
    paddingBottom: 26,
  },
  button: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 12,
    width: 210,
    height: 46,
    backgroundColor: '#fff',
  },
});

export default Perfil;
