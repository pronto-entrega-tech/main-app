import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import IconButton from '~/components/IconButton';
import MyButton from '~/components/MyButton';
import MyTouchable from '~/components/MyTouchable';
import { myColors, device, globalStyles } from '~/constants';
import {
  requestForegroundPermissionsAsync,
  enableNetworkProviderAsync,
  getCurrentPositionAsync,
  LocationAccuracy,
  LocationGeocodedLocation,
  reverseGeocodeAsync,
  getForegroundPermissionsAsync,
  hasServicesEnabledAsync,
} from 'expo-location';
import {
  getActiveAddressIndex,
  getAddressList,
  saveActiveAddressIndex,
  saveAddressList,
  saveActiveAddress,
} from '~/core/dataStorage';
import myAlert from '~/functions/myAlert';
import { getStateCode } from '~/functions/converter';
import MyIcon from '~/components/MyIcon';
import MyDivider from '~/components/MyDivider';
import useRouting from '~/hooks/useRouting';
import useFocusEffect from '~/hooks/useFocusEffect';
import Header from '~/components/Header';

export interface addressModel {
  apelido: string;
  rua: string;
  numero: string;
  bairro: string;
  complement?: string;
  cidade: string;
  estado: string;
  latitude?: number;
  longitude?: number;
}

async function getLocation(
  setCurrentAddress: React.Dispatch<
    React.SetStateAction<addressModel | undefined>
  >,
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>,
  setStatusText: React.Dispatch<React.SetStateAction<string>>,
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>
) {
  setStatusText('Carregando...');

  if (!device.web) {
    const { status } = await requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      myAlert('Permissão de acesso à localização foi negada');
      setStatusText('Usar localização atual');
      setDisabled(false);
      return;
    }

    await enableNetworkProviderAsync().catch(() => {
      myAlert('Serviço de localização está desativado');
      setStatusText('Usar localização atual');
      setDisabled(false);
      return;
    });
  }

  setActiveIndex(-1);
  saveActiveAddressIndex(-1);

  setStatusText('Buscando...');

  const address = await getAddress();

  setStatusText('Usar localização atual');
  if (!address) return setDisabled(false);

  saveActiveAddress(address);
  setCurrentAddress(address);
  return true;
}

export async function getAddress() {
  if (device.web) {
    if (!navigator.geolocation) {
      myAlert('Não é possível obter localização!');
      return false;
    }

    const location = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          maximumAge: 5 * 60 * 1000,
          timeout: 10 * 1000,
        });
      }
    ).catch(() => undefined);

    if (!location) {
      myAlert('Erro ao obter localização!');
      return false;
    }

    const addressModel: addressModel = {
      apelido: '',
      rua: 'Rua Martins',
      numero: '1159',
      bairro: '',
      cidade: 'Jataí',
      estado: 'GO',
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    return addressModel;
  }

  const location = await getCurrentPositionAsync({
    accuracy: LocationAccuracy.Highest,
  }).catch(() => undefined);

  if (!location) {
    myAlert('Erro ao obter localização!');
    return false;
  }

  const loc: LocationGeocodedLocation = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
  let address = (await reverseGeocodeAsync(loc))[0];
  let state = address.region ? getStateCode(address.region) : '';

  const addressModel: addressModel = {
    apelido: '',
    rua:
      (device.iOS ? address.name : address.street)?.replace('Avenida', 'Av.') +
      '',
    numero: (device.iOS ? '' : address.name) + '',
    bairro: address.district ?? '',
    cidade: (device.iOS ? address.city : address.subregion) + '',
    estado: state,
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
  return addressModel;
}

async function tryGetLocation(
  setCurrentAddress: React.Dispatch<
    React.SetStateAction<addressModel | undefined>
  >,
  isFocus: boolean
) {
  const { status } = await getForegroundPermissionsAsync();
  if (status !== 'granted') {
    if (isFocus) setCurrentAddress(undefined);
    return;
  }

  if (!(await hasServicesEnabledAsync())) {
    myAlert('Serviço de localização está desativado');
    return;
  }

  const address = await getAddress();

  if (address === false) return;
  if (isFocus) setCurrentAddress(address);
}

function Address() {
  const routing = useRouting();
  const [statusText, setStatusText] = useState<string>(
    'Usar localização atual'
  );
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [currentAddress, setCurrentAddress] = useState<
    addressModel | undefined
  >(undefined);
  const [addressList, setAddressList] = useState<addressModel[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [isFocus, setFocus] = useState<boolean>(true);

  React.useEffect(() => {
    getActiveAddressIndex().then(setActiveIndex);
    if (!device.web) tryGetLocation(setCurrentAddress, isFocus);
    return () => setFocus(false);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getAddressList().then(setAddressList);
    }, [])
  );

  const goBack = () => {
    if (routing.pathname === '/selecione-endereco') {
      routing.navigate('/inicio');
      return;
    }
    if (routing.params.return === 'cart') {
      routing.navigate('/carrinho', { callback: 'refresh', value: '' });
      return;
    }
    if ('back' in routing.params) {
      routing.navigate(`/${routing.params.back}`, { callback: 'refresh' });
      return;
    }
    routing.goBack();
  };

  const addressItem = ({
    item,
    index,
  }: {
    item: addressModel;
    index: number;
  }) => {
    const name = item.apelido !== '' ? item.apelido : 'Endereço ' + (index + 1);
    const address =
      item.rua +
      (item.numero !== '' ? ', ' + item.numero : '') +
      (item.bairro !== '' ? ', ' + item.bairro : '') +
      ', ' +
      item.cidade +
      ' - ' +
      item.estado;
    return (
      <MyTouchable
        style={[
          styles.cardBase,
          globalStyles.elevation3,
          globalStyles.darkBorder,
          activeIndex === index ? styles.cardActive : styles.cardInactive,
        ]}
        onPress={() => {
          setActiveIndex(index);
          saveActiveAddressIndex(index);
          saveActiveAddress(item);
          goBack();
        }}>
        <View style={styles.line1}>
          <MyIcon
            style={{ marginTop: 2 }}
            name='map-marker'
            size={24}
            color={myColors.primaryColor}
          />
          <Text style={styles.nameText}>{name}</Text>
          {activeIndex === index && (
            <MyIcon
              name='check-circle'
              size={20}
              color={myColors.primaryColor}
              style={styles.iconCheck}
            />
          )}
        </View>
        <Text style={styles.addressText}>{address}</Text>
        <View style={styles.line2}>
          <IconButton
            icon='pencil'
            color={myColors.grey3}
            type={'address'}
            onPress={() =>
              routing.navigate('/editar-endereco', {
                addressId: addressList.indexOf(item),
              })
            }
          />
          <IconButton
            icon='delete'
            color={myColors.grey3}
            type={'address'}
            onPress={() => {
              if (activeIndex === index)
                return myAlert(
                  'Este endereço está sendo usado!',
                  'Não é possivel excluir um endereço que está sendo utilizado'
                );
              if (device.web) {
                if (activeIndex > index) {
                  const newActiveIndex = activeIndex - 1;
                  setActiveIndex(newActiveIndex);
                  saveActiveAddressIndex(newActiveIndex);
                }
                const newAddressList = addressList.filter(
                  (value) => value !== item
                );
                setAddressList(newAddressList);
                saveAddressList(newAddressList);
                return;
              }
              Alert.alert(
                'Apagar endereço',
                `Tem certeza que deseja apagar o endereço "${name}"?`,
                [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Confirmar',
                    onPress: () => {
                      if (activeIndex > index) {
                        const newActiveIndex = activeIndex - 1;
                        setActiveIndex(newActiveIndex);
                        saveActiveAddressIndex(newActiveIndex);
                      }
                      const newAddressList = addressList.filter(
                        (value) => value !== item
                      );
                      setAddressList(newAddressList);
                      saveAddressList(newAddressList);
                    },
                  },
                ],
                { cancelable: true }
              );
            }}
          />
        </View>
      </MyTouchable>
    );
  };

  const isSelect = routing.pathname === '/selecione-endereco';
  return (
    <>
      <Header
        title={isSelect ? 'Escolha um endereço' : 'Endereços salvos'}
        goBack={!isSelect}
      />
      <MyTouchable
        disabled={disabled}
        onPress={() => {
          setDisabled(true);
          getLocation(
            setCurrentAddress,
            setActiveIndex,
            setStatusText,
            setDisabled
          ).then((got) => {
            if (got) goBack();
          });
        }}
        style={{ flexDirection: 'row' }}>
        <>
          <View
            style={[
              styles.icon,
              globalStyles.elevation5,
              globalStyles.darkBorder,
            ]}>
            <MyIcon
              name='crosshairs-gps'
              size={28}
              color={
                activeIndex === -1 ? myColors.primaryColor : myColors.grey_1
              }
            />
          </View>
          <View
            style={{
              paddingLeft: 16,
              paddingRight: 100,
              justifyContent: 'center',
            }}>
            <Text style={styles.text1}>{statusText}</Text>
            <Text style={styles.text2}>
              {currentAddress
                ? currentAddress.rua +
                  (currentAddress.numero ? `, ${currentAddress.numero}` : '') +
                  (currentAddress.bairro ? ` - ${currentAddress.bairro}` : '')
                : 'Ativar localização'}
            </Text>
          </View>
        </>
      </MyTouchable>
      <MyDivider style={styles.divider} />
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingTop: 2,
          paddingBottom: 70,
        }}
        showsVerticalScrollIndicator={false}
        data={addressList}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={addressItem}
      />
      <MyButton
        onPress={() => {
          const address = JSON.stringify(currentAddress);
          routing.navigate('/editar-endereco', { address });
        }}
        title='Adicionar endereço'
        type='outline'
        buttonStyle={styles.button}
      />
    </>
  );
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
    color: myColors.text2,
  },
  text2: {
    color: myColors.grey4,
    marginTop: 1,
    fontSize: 15,
  },
  divider: {
    marginHorizontal: 16,
    backgroundColor: myColors.divider3,
  },
  cardBase: {
    minHeight: 94,
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 16,
    paddingLeft: 8,
    paddingBottom: 14,
  },
  cardActive: {
    borderWidth: 1.5,
    borderColor: myColors.primaryColor,
  },
  cardInactive: {
    borderWidth: 1,
    borderColor: myColors.divider,
  },
  line1: {
    flexDirection: 'row',
    marginTop: 12,
  },
  nameText: {
    marginLeft: 4,
    marginTop: 2,
    fontSize: 16,
    color: myColors.text4,
  },
  iconCheck: {
    marginLeft: 3,
    marginTop: 2,
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
    color: myColors.primaryColor,
  },
  button: {
    position: 'absolute',
    bottom: device.iPhoneNotch ? 38 : 12,
    alignSelf: 'center',
    borderWidth: 2,
    width: 210,
    height: 46,
    backgroundColor: '#FFF',
  },
});

export default Address;
