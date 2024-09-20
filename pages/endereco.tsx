import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import IconButton from '~/components/IconButton';
import MyButton from '~/components/MyButton';
import MyTouchable from '~/components/MyTouchable';
import { myColors, device, globalStyles } from '~/constants';
import {
  requestForegroundPermissionsAsync,
  enableNetworkProviderAsync,
  getForegroundPermissionsAsync,
  hasServicesEnabledAsync,
} from 'expo-location';
import { getActiveAddressId, saveActiveAddressId } from '~/core/dataStorage';
import { stringifyAddress } from '~/functions/converter';
import MyIcon from '~/components/MyIcon';
import MyDivider from '~/components/MyDivider';
import useRouting from '~/hooks/useRouting';
import MyHeader from '~/components/MyHeader';
import { Address } from '~/core/models';
import MyText from '~/components/MyText';
import { useAddressContext } from '~/contexts/AddressContext';
import { useAuthContext } from '~/contexts/AuthContext';
import Loading from '~/components/Loading';
import Errors from '~/components/Errors';
import { useAlertContext } from '~/contexts/AlertContext';
import { useGetAddress } from '~/hooks/useAddress';

const Addresses = () => {
  const routing = useRouting();
  const { alert } = useAlertContext();
  const { setAddress } = useAddressContext();
  const getAddress = useGetAddress();
  const [statusText, setStatusText] = useState('Usar localização atual');
  const [activeId, _setActiveId] = useState<string | null>();
  const [gpsAddress, setGpsAddress] = useState<Address>();
  const [disabled, setDisabled] = useState(false);

  const setActiveId = (id: string | null) => {
    _setActiveId(id);
    saveActiveAddressId(id);
  };

  useEffect(() => {
    getActiveAddressId().then(_setActiveId);

    let canceled = false;
    const tryGetLocation = async () => {
      const { status } = await getForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (!canceled) setGpsAddress(undefined);
        return;
      }

      const enabled = await hasServicesEnabledAsync();
      if (!enabled) {
        alert('Serviço de localização está desativado');
        return;
      }

      const address = await getAddress();

      if (!address) return;
      if (!canceled) setGpsAddress(address);
    };
    // don't auto get location on web because reverse geocoding costs to our backend
    if (!device.web) tryGetLocation();

    return () => {
      canceled = true;
    };
  }, [alert, getAddress]);

  const goBack = () => {
    routing.screen === 'SelectAddress'
      ? routing.navigate('Home')
      : routing.goBack('Home');
  };

  const getLocation = async () => {
    setStatusText('Carregando...');

    if (!device.web) {
      const { status } = await requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        alert('Permissão de acesso à localização foi negada');
        setStatusText('Usar localização atual');
        setDisabled(false);
        return;
      }

      try {
        await enableNetworkProviderAsync();
      } catch {
        alert('Serviço de localização está desativado');
        setStatusText('Usar localização atual');
        setDisabled(false);
        return;
      }
    }

    setActiveId(null);

    setStatusText('Buscando...');

    const address = await getAddress();

    setStatusText('Usar localização atual');
    if (!address) return setDisabled(false);

    setAddress(address);
    return true;
  };

  if (activeId === undefined) return <Loading />;

  const isSelectRoute = routing.screen === 'SelectAddress';
  return (
    <>
      <MyHeader
        title={isSelectRoute ? 'Escolha um endereço' : 'Endereços salvos'}
        goBackLess={isSelectRoute}
      />
      <MyTouchable
        disabled={disabled}
        onPress={() => {
          setDisabled(true);
          getLocation().then((got) => {
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
              color={!activeId ? myColors.primaryColor : myColors.grey_1}
            />
          </View>
          <View style={styles.gpsContainer}>
            <MyText style={styles.gpsStatus}>{statusText}</MyText>
            <MyText style={styles.gpsAddress}>
              {gpsAddress ? stringifyAddress(gpsAddress) : 'Ativar localização'}
            </MyText>
          </View>
        </>
      </MyTouchable>
      <MyDivider style={styles.divider} />
      <AddressesList {...{ activeId, setActiveId, goBack }} />
    </>
  );
};

const AddressesList = (props: {
  activeId?: string | null;
  setActiveId: (id: string | null) => void;
  goBack: () => void;
}) => {
  const { activeId, setActiveId, goBack } = props;

  const routing = useRouting();
  const { alert } = useAlertContext();
  const { accessToken } = useAuthContext();
  const { addresses, setAddress, loadAddresses, deleteAddress } =
    useAddressContext();

  useEffect(() => {
    if (accessToken) loadAddresses(accessToken);
  }, [accessToken, loadAddresses]);

  if (accessToken === undefined) return <Loading />;

  if (!accessToken)
    return (
      <Errors
        title='Entre para ver seus endereços salvos'
        error='missing_auth'
      />
    );

  const addressItem = ({
    item: address,
    index,
  }: {
    item: Address;
    index: number;
  }) => {
    const isSelected = activeId === address.id;
    const name = address.nickname ?? `Endereço ${index + 1}`;

    const removeAddress = () => {
      if (isSelected)
        return alert(
          'Este endereço está sendo usado!',
          'Não é possível excluir um endereço que está sendo utilizado',
        );

      alert(
        'Apagar endereço',
        `Tem certeza que deseja apagar o endereço "${name}"?`,
        { onConfirm: () => deleteAddress(accessToken, address.id) },
      );
    };

    return (
      <View
        style={[
          globalStyles.elevation3,
          globalStyles.darkBorder,
          styles.cardBase,
          isSelected ? styles.cardActive : styles.cardInactive,
        ]}>
        <MyTouchable
          style={{ flex: 1 }}
          onPress={() => {
            setActiveId(address.id);
            setAddress(address);
            goBack();
          }}>
          <View style={styles.addressNameContainer}>
            <MyIcon
              style={{ marginTop: 2 }}
              name='map-marker'
              size={24}
              color={myColors.primaryColor}
            />
            <MyText style={styles.addressName}>{name}</MyText>
            {isSelected && (
              <MyIcon
                name='check-circle'
                size={20}
                color={myColors.primaryColor}
                style={styles.iconCheck}
              />
            )}
          </View>
          <MyText style={styles.address}>{stringifyAddress(address)}</MyText>
        </MyTouchable>
        <View style={styles.itemButtonsContainer}>
          <IconButton
            icon='pencil'
            color={myColors.grey3}
            style={styles.itemButton}
            onPress={() => routing.navigate('EditAddress', { i: address.id })}
          />
          <IconButton
            icon='delete'
            color={myColors.grey3}
            style={styles.itemButton}
            onPress={removeAddress}
          />
        </View>
      </View>
    );
  };

  return (
    <>
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingTop: 2,
          paddingBottom: 70,
        }}
        showsVerticalScrollIndicator={false}
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={addressItem}
      />
      <MyButton
        screen='EditAddress'
        title='Adicionar endereço'
        type='outline'
        buttonStyle={globalStyles.bottomButton}
      />
    </>
  );
};

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
  gpsContainer: {
    paddingLeft: 16,
    paddingRight: 100,
    justifyContent: 'center',
  },
  gpsStatus: {
    color: myColors.text2,
  },
  gpsAddress: {
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
  addressNameContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  addressName: {
    marginLeft: 4,
    marginTop: 2,
    fontSize: 16,
    color: myColors.text4,
  },
  iconCheck: {
    marginLeft: 3,
    marginTop: 2,
  },
  address: {
    marginLeft: 28,
    marginRight: 48,
    fontSize: 15,
    color: myColors.text2,
  },
  itemButtonsContainer: {
    position: 'absolute',
    right: 0,
    top: -2,
  },
  itemButton: {
    height: 48,
    width: 48,
  },
});

export default Addresses;
