import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Text, ScrollView, StyleSheet, View, Pressable, TextInput } from 'react-native';
import { Button, Divider, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as DocumentPicker from 'expo-document-picker';
import Loading from '../../components/Loading';
import { device, myColors } from '../../constants';
import { getProfile } from '../../functions/dataStorage';
import useMyContext from '../../functions/MyContext';
import IconButton from '../../components/IconButton';
import MyButton from '../../components/MyButton';
import myAlert from '../../functions/myAlert';

const emailCorrectRega = /[a-zA-Z0-9.!#$%&'*+/=?`{|}~^-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const emailCompleteReg = /^(.+)@(.+)\.(.{2,})$/;

function UploadQuestion({navigation}:
{navigation: StackNavigationProp<any, any>}) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [email, setEmail] = React.useState<string>('');
  const [emailError, setEmailError] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState<string>('');
  const [titleError, setTitleError] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>('');
  const [messageError, setMessageError] = React.useState<boolean>(false);
  const [documents, setDocuments] = React.useState<DocumentPicker.DocumentResult[]>([]);
  const {toast} = useMyContext();

  React.useEffect(() => {
    getProfile().then(profile => {
      setEmail(profile?.email)
      setIsLoading(false)
    })
  }, []);

  const inputTitle = React.useRef<TextInput | null>();
  const inputMessage = React.useRef<TextInput | null>();

  if (isLoading) 
  return (
    <Loading />
  )

  return (
    <>
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.conteiner}>
      <Input
        label='Email'
        labelStyle={styles.label}
        errorMessage={emailError? 'Email inválido' : ''}
        defaultValue={email}
        placeholder='nome@email.com' 
        keyboardType='email-address'
        autoCompleteType='email'
        autoCapitalize='none' 
        autoCorrect={false}
        selectionColor={myColors.colorAccent}
        inputStyle={styles.border}
        inputContainerStyle={{borderColor: 'transparent'}}
        onChangeText={v => {
          setEmailError(false)
          setEmail(v)
          }}
        returnKeyType='next'
        onSubmitEditing={() => inputTitle.current?.focus()} />
      <Input
        label='Assunto'
        labelStyle={styles.label}
        errorMessage={titleError? 'Insira assunto' : ''}
        selectionColor={myColors.colorAccent}
        inputStyle={styles.border}
        inputContainerStyle={{borderColor: 'transparent'}}
        onChangeText={v => {setTitleError(false); setTitle(v)}}
        returnKeyType='next'
        onSubmitEditing={() => inputMessage.current?.focus()}
        ref={ref => inputTitle.current = ref} />
      <Input
        label='Descrição'
        labelStyle={styles.label}
        errorMessage={messageError? 'Insira descrição' : ''}
        selectionColor={myColors.colorAccent}
        inputStyle={styles.border}
        inputContainerStyle={{borderColor: 'transparent'}}
        style={{textAlignVertical: 'top'}}
        multiline={true}
        numberOfLines={5}
        onChangeText={v => {setMessageError(false); setMessage(v)}} 
        ref={ref => inputMessage.current = ref}/>
        
      <Text style={[styles.label, {alignSelf: 'flex-start', fontFamily: 'Bold', marginLeft: 19, fontSize: 16}]} >Anexos</Text>
      <View style={styles.attachment} >
        <MyButton
          title='Adicionar arquivo'
          type='clear'
          buttonStyle={{borderRadius: 12, width: device.width-20}}
          onPress={()=> {
            (async () => {
              const document = await DocumentPicker.getDocumentAsync({copyToCacheDirectory: false});
              if (document.type == 'cancel') return;
              if (documents.length > 4) return myAlert('Máximo de 5 anexos');
              setDocuments([...documents, document])
            })();
            }} />
        {
          documents.map((item, i) => {
            if (item.type == 'cancel') return;
            return (
              <View key={i} >
                <Divider style={{height: 1, backgroundColor: myColors.divider2, width: device.width-48, alignSelf: 'center'}} />
                <View style={{justifyContent: 'center'}} >
                  <View style={{flexDirection: 'row', alignItems: 'center', width: device.width-20}} >
                    <Icon name='file' size={24} color={myColors.primaryColor} style={{padding: 12}} />
                    <Text
                      style={{color: myColors.text4, maxWidth: device.width-120}} >
                      {item.name}
                    </Text>
                  </View>
                  <View style={{position: 'absolute', right: 0, justifyContent: 'center'}} >
                  <IconButton
                    icon='close-circle'
                    type='cancel'
                    onPress={() => setDocuments(documents.filter(v => v != item))} />
                  </View>
                </View>
              </View>
            )
          })
        }
      </View>
    </ScrollView>
    <MyButton
      title='Enviar'
      type='outline'
      buttonStyle={styles.button}
      onPress={()=> {
        let error = false;
        if (!emailCorrectRega.test(email)) {error = true; setEmailError(true)};
        if (title == '') {error = true; setTitleError(true)};
        if (message == '') {error = true; setMessageError(true)};
        if (error) return;
        toast('Dúvida enviada')
        navigation.navigate('Profile', 'redirect')
        }} />
    </>
  )
}

const styles = StyleSheet.create({
  conteiner: {
    alignItems: 'center',
    backgroundColor: myColors.background,
    paddingTop: 24,
    paddingBottom: 8+46+(device.iPhoneNotch ? 38 : 12),
  },
  label: {
    color: myColors.primaryColor,
    marginBottom: 6,
    marginLeft: 8,
  },
  border: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 8,
    borderColor: myColors.primaryColor,
  },
  attachment: {
    borderWidth: 2,
    borderColor: myColors.primaryColor,
    borderRadius: 12,
    width: device.width-20,
    borderStyle: 'dashed',
  },
  button: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: device.iPhoneNotch ? 38 : 12,
    borderWidth: 2,
    width: 120,
    height: 46,
    backgroundColor: '#fff',
  },
})

export default UploadQuestion