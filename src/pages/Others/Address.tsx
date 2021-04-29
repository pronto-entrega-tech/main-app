import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconButton from '../../components/IconButton';
import MyButton from '../../components/MyButton';
import MyTouchable from '../../components/MyTouchable';
import { myColors, device, globalStyles } from '../../constants';
import * as Location from 'expo-location'
import { LocationGeocodedLocation } from 'expo-location';
import { getActiveAddressIndex, getAddressList, saveActiveAddressIndex, saveAddressList, saveActiveAddress } from '../../functions/dataStorage';
import myAlert from '../../functions/myAlert';
import { useFocusEffect } from '@react-navigation/native';

export interface addressModel {
  apelido: string 
  rua: string,
  numero: string,
  bairro: string,
  complement?: string,
  cidade: string,
  estado: string,
  latitude?: number,
  longitude?: number 
}

export async function getAddress() {
  const location = await Location.getCurrentPositionAsync({ accuracy: Location.LocationAccuracy.Highest })
  .catch(() => {return null});
  
  if (!location) {
    alert('Erro ao obter localização!');
    return false
  }

  if (device.web) {
    const addressModel: addressModel = {
      apelido: '',
      rua: 'Rua Martins',
      numero: '1159',
      bairro: '',
      cidade: 'Jataí',
      estado: 'Goiás',
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    };
    return addressModel
  }

  const loc: LocationGeocodedLocation = {
    latitude: location.coords.latitude, 
    longitude: location.coords.longitude
  }
  let address = (await Location.reverseGeocodeAsync(loc))[0];
  let state;
  switch (address.region) {
    case 'Goiás':
      state = 'GO'
      break;
    default:
      state = address.region+''
      break;
  }
  const addressModel: addressModel = {
    apelido: '',
    rua: (device.iOS ? address.name : address.street)?.replace('Avenida', 'Av.')+'',
    numero: (device.iOS ? '' : address.name)+'',
    bairro: address.district != null ? address.district : '',
    cidade: (device.iOS ? address.city : address.subregion)+'',
    estado: state,
    latitude: location.coords.latitude,
    longitude: location.coords.longitude
  };
  return addressModel
}

async function getLocation(setCurrentAddress: React.Dispatch<React.SetStateAction<addressModel | undefined>>,
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>,
  setStatusText: React.Dispatch<React.SetStateAction<string>>,
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>) {
  setStatusText('Carregando...')
  let { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    myAlert('Permissão de acesso à localização foi negada', '');
    setStatusText('Usar localização atual');
    setDisabled(false);
    return false;
  }

  Location.enableNetworkProviderAsync()
  .catch(() => {
    myAlert('Serviço de localização está desativado', '');
    setStatusText('Usar localização atual');
    setDisabled(false);
    return false;
  });
  
  setActiveIndex(-1)
  saveActiveAddressIndex(-1)

  setStatusText('Buscando...')

  const address = await getAddress();

  if (address === false) return false;

  setStatusText('Usar localização atual')
  saveActiveAddress(address)
  setCurrentAddress(address)
  return true
};

async function tryGetLocation(setCurrentAddress: React.Dispatch<React.SetStateAction<addressModel | undefined>>, isFocus: boolean) {
  let { status } = await Location.getForegroundPermissionsAsync();

  if (status !== 'granted') {
    if (isFocus) setCurrentAddress(undefined)
    return;
  }

  const address = await getAddress();

  if (address === false) return false;
  if (isFocus) setCurrentAddress(address)
};

function Address({ navigation, route }:
  {navigation: StackNavigationProp<any, any>, route: any}) {
  const [statusText, setStatusText] = useState<string>('Usar localização atual');
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [currentAddress, setCurrentAddress] = useState<addressModel | undefined>(undefined);
  const [addressList, setAddressList] = useState<addressModel[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [isFocus, setFocus] = useState<boolean>(true);

  React.useEffect(() => {
    getActiveAddressIndex().then(activeIndex => setActiveIndex(activeIndex))
    tryGetLocation(setCurrentAddress, isFocus)
    return () => setFocus(false)
  }, [])
  
  useFocusEffect(
    React.useCallback(() => {
      getAddressList().then(addressList => {if (addressList != null) setAddressList(addressList)})
    }, [])
  );

  const addressItem = ({item, index}: {item: addressModel, index: number}) => {
    const name = item.apelido != '' ? item.apelido : 'Endereço '+(index+1)
    const address = item.rua+(item.numero != '' ? ', '+item.numero : '')+(item.bairro != '' ? ', '+item.bairro : '')+', '+item.cidade+' - '+item.estado
    return (
      <MyTouchable
        style={[styles.cardBase, globalStyles.elevation3, globalStyles.darkBoader, activeIndex == index ? styles.cardActive : styles.cardInactive ]}
        onPress={() => {
          setActiveIndex(index);
          saveActiveAddressIndex(index);
          saveActiveAddress(item);
          if (route.name == 'SelectAddress') {
            navigation.navigate('BottomTabs');
            return;
          }
          if (route.params?.back == 'Cart') {
            navigation.navigate('Cart', {callback: 'refresh', value: ''});
            return;
          }
          navigation.goBack();
        }}>
        <View style={styles.line1}>
          <Icon style={{marginTop: 2}} name='map-marker' size={24} color={myColors.primaryColor}/>
          <Text style={styles.nameText}>{name}</Text>
          {activeIndex == index ? <Icon name='check-circle' size={20} color={myColors.primaryColor} style={styles.iconCheck}/> : null}
        </View>
        <Text style={styles.addressText}>{address}</Text>
        <View style={styles.line2} >
          <IconButton icon='pencil' size={24} color={myColors.grey3} type={'address'} onPress={() => 
            navigation.navigate('NewAddress', {address: addressList.indexOf(item)})} />
          <IconButton icon='delete' size={24} color={myColors.grey3} type={'address'} onPress={() => {
            if (activeIndex == index) return myAlert('Este endereço está sendo usado!',
            'Não é possivel excluir um endereço que está sendo utilizado')
            if (device.web) {
              if (activeIndex > index) {
                const newActiveIndex = activeIndex-1
                setActiveIndex(newActiveIndex)
                saveActiveAddressIndex(newActiveIndex)
              }
              const newAddressList = addressList.filter(value => value != item)
              setAddressList(newAddressList);
              saveAddressList(newAddressList);
              return
            }
            Alert.alert("Apagar endereço",`Tem certeza que deseja apagar o endereço "${name}"?`,[
              {text: 'Cancelar', style: 'cancel'},{text: 'Confirmar', onPress: () => {
                if (activeIndex > index) {
                  const newActiveIndex = activeIndex-1
                  setActiveIndex(newActiveIndex)
                  saveActiveAddressIndex(newActiveIndex)
                }
                const newAddressList = addressList.filter(value => value != item)
                setAddressList(newAddressList);
                saveAddressList(newAddressList);
              }}], {cancelable: true})
          }}/>
        </View>
      </MyTouchable>
    )
  }

  return (
    <View style={{backgroundColor: myColors.background, flex: 1}} >
      <MyTouchable disabled={disabled} onPress={() => {
        setDisabled(true)
        getLocation(setCurrentAddress, setActiveIndex, setStatusText, setDisabled).then(got => {
          if (got) {
            if (route.name == 'SelectAddress') {
              navigation.navigate('BottomTabs');
              return;
            }
            if (route.params?.back == 'Cart') {
              navigation.navigate('Cart', {callback: 'Hi'});
              return;
            }
            navigation.goBack();
          }
        })}
      } style={{flexDirection: 'row'}}>
        <>
          <View style={[styles.icon, globalStyles.elevation5, globalStyles.darkBoader]} >
            <Icon name='crosshairs-gps' size={28} color={
              activeIndex == -1 ?
              myColors.primaryColor : myColors.grey_1} />
          </View>
            <View style={{paddingLeft: 16, paddingRight: 100, justifyContent: 'center'}} >
              <Text style={styles.text1} >{statusText}</Text>
              <Text style={styles.text2} >{
                currentAddress != null ?
                currentAddress.rua+(currentAddress.numero != '' ? ', '+currentAddress.numero : '')+
                (currentAddress.bairro != '' ? ' - '+currentAddress.bairro : '')
                : 'Ativar localização'
              }</Text>
          </View>
        </>
      </MyTouchable>
      <Divider style={styles.divider} />
      <FlatList
        contentContainerStyle={{paddingHorizontal: 18, paddingTop: 2, paddingBottom: 70}}
        showsVerticalScrollIndicator={false}
        data={addressList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={addressItem} />
      <MyButton
        onPress={() => {
          const address = currentAddress;
          navigation.navigate('NewAddress', {address: address})
        }}
        title='Adicionar endereço'
        type='outline'
        buttonStyle={styles.button} />
    </View>
  )
}

const styles = StyleSheet.create({
  icon: {
    width: 52,
    height: 52,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
    marginVertical: 8,
    marginLeft: 26,
  },
  text1: {
    color: myColors.text2
  },
  text2: {
    color: myColors.grey4,
    marginTop: 1,
    fontSize: 15,
  },
  divider: {
    marginHorizontal: 16,
    height: 1,
    backgroundColor: myColors.divider3,
  },
  cardBase: {
    minHeight: 94,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 16,
    paddingLeft: 8,
    paddingBottom: 14,
  },
  cardActive: {
    borderWidth: 1.5,
    borderColor: myColors.primaryColor
  },
  cardInactive: {
    borderWidth: 1,
    borderColor: myColors.divider
  },
  line1: {
    flexDirection: 'row',
    marginTop: 12,
  },
  nameText: {
    marginLeft: 4,
    marginTop: 2,
    fontSize: 16,
    color: myColors.text4
  },
  iconCheck: {
    marginLeft: 3,
    marginTop: 2
  },
  addressText: {
    marginLeft: 28,
    marginRight: 48,
    fontSize: 15,
    color: myColors.text2,
  },
  line2: {
    position: 'absolute',
    right: 0,
    paddingTop: 4,
  },
  alertButton: {
    color: myColors.primaryColor
  },
  button: {
    position: 'absolute',
    bottom: device.iPhoneNotch ? 38 : 12,
    alignSelf:'center',
    borderWidth: 2,
    width: 210,
    height: 46,
    backgroundColor: '#FFF'
  },
})

export default Address

