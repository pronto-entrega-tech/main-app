import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Button, Divider, Input } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import IconButton from '../../components/IconButton';
import { myColors, device, globalStyles } from '../../constants';
import { saveAddressList } from '../../functions/dataStorage';
import { addressModel } from './Address';

function NewAddress({navigation, route}:
  {navigation: StackNavigationProp<any, any>, route: any}) {
  const params = route.params;
  const position = params.position;
  var addressList: addressModel[] = params.addressList
  var addressItem: addressModel;
  var newAddressItem: addressModel;
  if (params.addressItem != null) {
    addressItem = params.addressItem;
    newAddressItem = params.addressItem;
  } else {
    addressItem = {
      apelido: '',
      rua: '',
      numero: '',
      bairro: '',
      cidade: 'Jataí',
      estado: 'Goiás',
      latitude: 0,
      longitude: 0
    };
    newAddressItem = addressItem;
  }
  return (
    <>
    <View style={[styles.header, globalStyles.notch]}>
      <IconButton
      icon='arrow-left'
      size={24}
      color={myColors.primaryColor}
      type='back'
      onPress={() => navigation.goBack()} />
      <Text style={styles.textHeader}>{addressList?.includes(addressItem) ? 'Editar endereço' : 'Novo endereço'}</Text>
      <Divider style={styles.divider} />
    </View>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{backgroundColor: myColors.background, paddingHorizontal: 4, paddingTop: 12, paddingBottom: 40}}>
      <Input
        label='Apelido do endereço'
        placeholder={'Endereço '+position}
        onChangeText={(text) => newAddressItem.apelido = text}
        defaultValue={addressItem.apelido}
        selectionColor={myColors.primaryColor}
        autoCompleteType='off' />
      <Input
        label='Rua' 
        onChangeText={(text) => newAddressItem.rua = text}
        defaultValue={addressItem.rua}
        labelStyle={{color: myColors.primaryColor}}  
        selectionColor={myColors.primaryColor}
        autoCompleteType='street-address'
        textContentType='streetAddressLine1' />
      <Input 
        label='Número' 
        onChangeText={(text) => newAddressItem.numero = text}
        defaultValue={addressItem.numero}
        keyboardType='numeric' 
        labelStyle={{color: myColors.primaryColor}}  
        selectionColor={myColors.primaryColor}
        textContentType='streetAddressLine2' />
      <Input 
        label='Bairro'
        onChangeText={(text) => newAddressItem.bairro = text}
        defaultValue={addressItem.bairro}
        labelStyle={{color: myColors.primaryColor}}  
        selectionColor={myColors.primaryColor}
        textContentType='sublocality' />
      <Picker mode='dropdown' >
        <Picker.Item label='Jataí' value="Jataí" />
        <Picker.Item label='Goiania' value="Goiania" />
      </Picker>
      <View style={{flexDirection: 'row'}} >
        <Input
          containerStyle={{flex: 2}}
          label='Cidade'
          onChangeText={(text) => newAddressItem.cidade = text}
          defaultValue={addressItem.cidade}
          labelStyle={{color: myColors.primaryColor}}  
          selectionColor={myColors.primaryColor}
          textContentType='addressCity' />
        <Input 
          containerStyle={{flex: 1}}
          label='Estado' 
          onChangeText={(text) => newAddressItem.estado = text}
          defaultValue={addressItem.estado}
          labelStyle={{color: myColors.primaryColor}}  
          selectionColor={myColors.primaryColor}
          textContentType='addressState' />
      </View>
      <Input 
        label='Complemento'
        onChangeText={(text) => newAddressItem.complement = text}
        defaultValue={addressItem.complement}
        selectionColor={myColors.primaryColor}
        textContentType='location' />
    </ScrollView>
    <Button
      title='Salvar endereço'
      onPress={() => {
        if (addressList.includes(addressItem)) {
          addressList[addressList.indexOf(addressItem)] = newAddressItem
        } else {
          addressList = [...addressList, newAddressItem]
        }
        saveAddressList(addressList).then(() => navigation.goBack())
      }}
      type='outline'
      theme={{ colors: { primary: myColors.primaryColor}}}
      buttonStyle={{borderWidth: 2, width: 210, height: 46, backgroundColor: '#fff'}}
      containerStyle={{position: 'absolute', alignSelf: 'center', bottom: device.iPhoneNotch ? 38 : 12}} />
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
  }
})

export default NewAddress