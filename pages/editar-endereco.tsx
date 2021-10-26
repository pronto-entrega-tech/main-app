import React from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput } from 'react-native';
import { geocodeAsync } from 'expo-location';
import { Input } from 'react-native-elements/dist/input/Input';
import IconButton from '~/components/IconButton';
import Loading from '~/components/Loading';
import MyButton from '~/components/MyButton';
import MyPicker from '~/components/MyPicker';
import { myColors, device, globalStyles, myFonts } from '~/constants';
import { getAddressList, saveAddressList } from '~/core/dataStorage';
import useMyContext from '~/core/MyContext';
import { addressModel } from './endereco';
import MyDivider from '~/components/MyDivider';
import useRouting from '~/hooks/useRouting';

function NewAddress() {
  const routing = useRouting();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [addressList, setAddressList] = React.useState<addressModel[]>();
  const [addressItem, setAddressItem] = React.useState<addressModel>();
  const [isNew, setIsNew] = React.useState<boolean>(true);
  const [streetError, setStreetError] = React.useState<boolean>(false);
  const [numberError, setNumberError] = React.useState<boolean>(false);
  const [districtError, setDistrictError] = React.useState<boolean>(false);
  const [cityError, setCityError] = React.useState<boolean>(false);
  const [stateError, setStateError] = React.useState<boolean>(false);
  const { toast } = useMyContext();
  const addressId = routing.params.addressId;
  const address = routing.params.address && JSON.parse(routing.params.address);

  React.useEffect(() => {
    getAddressList().then((list) => {
      if (addressId) {
        setAddressItem(list[addressId]);
        setIsNew(false);
      } else if (address) {
        setAddressItem(address);
      } else {
        setAddressItem({
          apelido: '',
          rua: '',
          numero: '',
          bairro: '',
          cidade: 'Jataí',
          estado: 'GO',
          latitude: 0,
          longitude: 0,
        });
      }

      setAddressList(list);
    });
  }, [address, addressId]);

  const inputRua = React.useRef<TextInput | null>();
  const inputNumero = React.useRef<TextInput | null>();
  const inputBairro = React.useRef<TextInput | null>();

  if (!(addressList && addressItem) || isLoading)
    return <Loading title={isLoading ? 'Salvando endereço...' : undefined} />;

  return (
    <>
      <View style={[styles.header, globalStyles.notch]}>
        <IconButton
          icon='arrow-left'
          type='back'
          onPress={() => routing.goBack()}
        />
        <Text style={styles.textHeader}>
          {isNew ? 'Novo endereço' : 'Editar endereço'}
        </Text>
        <MyDivider style={styles.divider} />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: myColors.background,
          paddingHorizontal: 4,
          paddingTop: 18,
          paddingBottom: 66,
        }}>
        <Input
          label='Apelido do endereço'
          placeholder={'Endereço ' + (addressList.length + 1).toString()}
          onChangeText={(text) => (addressItem.apelido = text)}
          defaultValue={addressItem.apelido}
          selectionColor={myColors.primaryColor}
          autoCompleteType='off'
          returnKeyType='next'
          onSubmitEditing={() => inputRua.current?.focus()}
        />
        <Input
          label='Rua'
          labelStyle={{ color: myColors.primaryColor }}
          errorMessage={streetError ? 'Insira uma rua' : ''} // empty string to maintain the padding
          onChangeText={(text) => {
            addressItem.rua = text;
            setStreetError(false);
          }}
          defaultValue={addressItem.rua}
          selectionColor={myColors.primaryColor}
          autoCompleteType='street-address'
          textContentType='streetAddressLine1'
          returnKeyType='next'
          ref={(ref: any) => (inputRua.current = ref)}
          onSubmitEditing={() => inputNumero.current?.focus()}
        />
        <Input
          label='Número'
          labelStyle={{ color: myColors.primaryColor }}
          errorMessage={numberError ? 'Insira um número' : ''}
          onChangeText={(text) => {
            addressItem.numero = text;
            setNumberError(false);
          }}
          defaultValue={addressItem.numero}
          keyboardType='numeric'
          selectionColor={myColors.primaryColor}
          textContentType='streetAddressLine2'
          returnKeyType='next'
          ref={(ref: any) => (inputNumero.current = ref)}
          onSubmitEditing={() => inputBairro.current?.focus()}
        />
        <Input
          label='Bairro'
          labelStyle={{ color: myColors.primaryColor }}
          errorMessage={districtError ? 'Insira um bairro' : ''}
          onChangeText={(text) => {
            addressItem.bairro = text;
            setDistrictError(false);
          }}
          defaultValue={addressItem.bairro}
          selectionColor={myColors.primaryColor}
          textContentType='sublocality'
          ref={(ref: any) => (inputBairro.current = ref)}
        />
        <View style={{ flexDirection: 'row' }}>
          <MyPicker
            label='Cidade'
            style={{ flex: 2 }}
            errorMessage={cityError ? 'Insira uma cidade' : ''}
            items={['Jataí', 'Rio verde']}
            selectedValue={addressItem.cidade}
            onValueChange={(v) => {
              addressItem.cidade = v;
              setCityError(false);
            }}
          />
          <MyPicker
            label='Estado'
            style={{ flex: 1 }}
            errorMessage={stateError ? 'Insira um estado' : ''}
            items={['GO']}
            selectedValue={addressItem.estado}
            onValueChange={(v) => {
              addressItem.estado = v;
              setStateError(false);
            }}
          />
        </View>
        <Input
          label='Complemento'
          onChangeText={(text) => (addressItem.complement = text)}
          defaultValue={addressItem.complement}
          selectionColor={myColors.primaryColor}
          textContentType='location'
        />
      </ScrollView>
      <MyButton
        title='Salvar endereço'
        onPress={async () => {
          let error = false;
          const wrong = [undefined, '', '-'];
          if (wrong.includes(addressItem.rua)) {
            error = true;
            setStreetError(true);
          }
          if (wrong.includes(addressItem.numero)) {
            error = true;
            setNumberError(true);
          }
          if (wrong.includes(addressItem.bairro)) {
            error = true;
            setDistrictError(true);
          }
          if (wrong.includes(addressItem.cidade)) {
            error = true;
            setCityError(true);
          }
          if (wrong.includes(addressItem.estado)) {
            error = true;
            setStateError(true);
          }
          if (error) return;

          setIsLoading(true);
          const address = `${addressItem.estado}, ${addressItem.cidade}, ${addressItem.bairro}, ${addressItem.rua}, ${addressItem.numero}`;
          if (device.web) {
            addressItem.latitude = 0;
            addressItem.longitude = 0;
          } else {
            const loc = await geocodeAsync(address);
            addressItem.latitude = loc[0].latitude;
            addressItem.longitude = loc[0].longitude;
          }

          let newAddressList;
          if (isNew) {
            newAddressList = [...addressList, addressItem];
          } else {
            addressList[addressList.indexOf(addressItem)] = addressItem;
            newAddressList = addressList;
          }

          await saveAddressList(newAddressList);
          toast('Endereço salvo');
          routing.goBack();
        }}
        type='outline'
        buttonStyle={styles.button}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: myColors.background,
    justifyContent: 'center',
  },
  textHeader: {
    color: myColors.primaryColor,
    fontSize: 20,
    fontFamily: myFonts.Bold,
    alignSelf: 'center',
    position: 'absolute',
  },
  divider: {
    marginTop: -1,
    backgroundColor: myColors.divider2,
  },
  label: {
    color: myColors.primaryColor,
    marginBottom: 0,
    marginLeft: 10,
    alignSelf: 'flex-start',
    fontSize: 16,
    fontFamily: myFonts.Bold,
  },
  button: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: device.iPhoneNotch ? 38 : 12,
    borderWidth: 2,
    width: 210,
    height: 46,
    backgroundColor: '#fff',
  },
});

export default NewAddress;
