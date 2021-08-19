import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput } from 'react-native';
import * as Location from 'expo-location'
import { Divider, Input } from 'react-native-elements';
import IconButton from '../../components/IconButton';
import Loading from '../../components/Loading';
import MyButton from '../../components/MyButton';
import MyPicker from '../../components/MyPicker';
import { myColors, device, globalStyles } from '../../constants';
import { getAddressList, saveAddressList } from '../../functions/dataStorage';
import useMyContext from '../../functions/MyContext';
import { addressModel } from './Address';

function NewAddress({navigation, route}:
{navigation: StackNavigationProp<any, any>, route: any}) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [addressList, setAddressList] = React.useState<addressModel[]>();
  const [addressItem, setAddressItem] = React.useState<addressModel>();
  const [isNew, setIsNew] = React.useState<boolean>(true);
  const [streetError, setStreetError] = React.useState<boolean>(false);
  const [numberError, setNumberError] = React.useState<boolean>(false);
  const [districtError, setDistrictError] = React.useState<boolean>(false);
  const [cityError, setCityError] = React.useState<boolean>(false);
  const [stateError, setStateError] = React.useState<boolean>(false);
  const {toast} = useMyContext();
  const address = route.params.address;

  React.useEffect(() => {
    getAddressList()
    .then(list => {
      if (address === undefined) {
        setAddressItem({
          apelido: '',
          rua: '',
          numero: '',
          bairro: '',
          cidade: 'Jataí',
          estado: 'GO',
          latitude: 0,
          longitude: 0
        })
      } else if (typeof address == 'number') {
        setAddressItem(list[address])
        setIsNew(false)
      } else {
        setAddressItem(address)
      }

      setAddressList(list)
    })
  }, [])

  const inputRua = React.useRef<TextInput | null>();
  const inputNumero = React.useRef<TextInput | null>();
  const inputBairro = React.useRef<TextInput | null>();

  if (!(addressList && addressItem) || isLoading)
  return <Loading title={isLoading? 'Salvando endereço...': undefined} />

  return (
    <>
    <View style={[styles.header, globalStyles.notch]}>
      <IconButton
      icon='arrow-left'
      size={24}
      color={myColors.primaryColor}
      type='back'
      onPress={() => navigation.goBack()} />
      <Text style={styles.textHeader}>{isNew? 'Novo endereço' : 'Editar endereço'}</Text>
      <Divider style={styles.divider} />
    </View>
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={device.web? {height: device.height-56}:{}}
      contentContainerStyle={{backgroundColor: myColors.background, paddingHorizontal: 4, paddingTop: 18, paddingBottom: 66}}>
      <Input
        label='Apelido do endereço'
        placeholder={'Endereço '+(addressList.length+1).toString()}
        onChangeText={(text) => addressItem.apelido = text}
        defaultValue={addressItem.apelido}
        selectionColor={myColors.primaryColor}
        autoCompleteType='off'
        returnKeyType='next'
        onSubmitEditing={() => inputRua.current?.focus()} />
      <Input
        label='Rua'
        labelStyle={{color: myColors.primaryColor}}
        errorMessage={streetError? 'Insira uma rua' : ''}
        onChangeText={(text) => {addressItem.rua = text; setStreetError(false)}}
        defaultValue={addressItem.rua}
        selectionColor={myColors.primaryColor}
        autoCompleteType='street-address'
        textContentType='streetAddressLine1'
        returnKeyType='next'
        ref={ref => inputRua.current = ref}
        onSubmitEditing={() => inputNumero.current?.focus()} />
      <Input 
        label='Número'
        labelStyle={{color: myColors.primaryColor}}  
        errorMessage={numberError? 'Insira um número' : ''}
        onChangeText={(text) => {addressItem.numero = text; setNumberError(false)}}
        defaultValue={addressItem.numero}
        keyboardType='numeric' 
        selectionColor={myColors.primaryColor}
        textContentType='streetAddressLine2'
        returnKeyType='next'
        ref={ref => inputNumero.current = ref}
        onSubmitEditing={() => inputBairro.current?.focus()} />
      <Input 
        label='Bairro'
        labelStyle={{color: myColors.primaryColor}}
        errorMessage={districtError? 'Insira um bairro' : ''}
        onChangeText={(text) => {addressItem.bairro = text; setDistrictError(false)}}
        defaultValue={addressItem.bairro}
        selectionColor={myColors.primaryColor}
        textContentType='sublocality'
        ref={ref => inputBairro.current = ref} />
      <View style={{flexDirection: 'row'}} >
        <MyPicker
          label='Cidade'
          style={{flex: 2}}
          errorMessage={cityError? 'Insira uma cidade' : ''}
          items={['Jataí','Rio verde']}
          selectedValue={addressItem.cidade}
          onValueChange={v => {addressItem.cidade = v; setCityError(false)}} />
        <MyPicker
          label='Estado'
          style={{flex: 1}}
          errorMessage={stateError? 'Insira um estado' : ''}
          items={['GO']}
          selectedValue={addressItem.estado}
          onValueChange={v => {addressItem.estado = v; setStateError(false)}} />
      </View>
      <Input 
        label='Complemento'
        onChangeText={(text) => addressItem.complement = text}
        defaultValue={addressItem.complement}
        selectionColor={myColors.primaryColor}
        textContentType='location' />
    </ScrollView>
    <MyButton
      title='Salvar endereço'
      onPress={async ()  => {
        let error = false;
        const wrong = [undefined, '', '-']
        if (wrong.includes(addressItem.rua)) {error = true; setStreetError(true)};
        if (wrong.includes(addressItem.numero)) {error = true; setNumberError(true)};
        if (wrong.includes(addressItem.bairro)) {error = true; setDistrictError(true)};
        if (wrong.includes(addressItem.cidade)) {error = true; setCityError(true)};
        if (wrong.includes(addressItem.estado)) {error = true; setStateError(true)};
        if (error) return;

        setIsLoading(true)
        const address = `${addressItem.estado}, ${addressItem.cidade}, ${addressItem.bairro}, ${addressItem.rua}, ${addressItem.numero}`
        if (device.web) {
          addressItem.latitude = 0
          addressItem.longitude = 0
        } else {
          const loc = await Location.geocodeAsync(address)
          addressItem.latitude = loc[0].latitude
          addressItem.longitude = loc[0].longitude
        }

        let newAddressList
        if (isNew) {
          newAddressList = [...addressList, addressItem]
        } else {
          addressList[addressList.indexOf(addressItem)] = addressItem
          newAddressList = addressList
        }

        await saveAddressList(newAddressList)
        toast('Endereço salvo')
        navigation.goBack()
      }}
      type='outline'
      buttonStyle={styles.button} />
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: myColors.background,
    justifyContent: 'center',
  },
  textHeader: {
    color: myColors.primaryColor,
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    position: 'absolute',
  },
  divider: {
    height: 1,
    marginTop: -1,
    backgroundColor: myColors.divider2,
  },
  label: {
    color: myColors.primaryColor,
    marginBottom: 0,
    marginLeft: 10,
    alignSelf: 'flex-start',
    fontSize: 16,
    fontFamily: 'Bold',
  },
  button: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: device.iPhoneNotch ? 38 : 12,
    borderWidth: 2,
    width: 210,
    height: 46,
    backgroundColor: '#fff'
  },
})

export default NewAddress