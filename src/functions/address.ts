import { device } from '~/constants';
import {
  getCurrentPositionAsync,
  getForegroundPermissionsAsync,
  hasServicesEnabledAsync,
  LocationAccuracy,
  reverseGeocodeAsync,
} from 'expo-location';
import { getStateCode } from '~/functions/converter';
import { Address } from '~/core/models';
import { api } from '~/services/api';
import { ShowAlert } from '~/contexts/AlertContext';
import { saveActiveAddress } from '~/core/dataStorage';

export const updateAddress = async (showAlert: ShowAlert) => {
  const { status } = await getForegroundPermissionsAsync();
  if (status !== 'granted') return false;

  const enabled = await hasServicesEnabledAsync();
  if (!enabled) return false;

  const address = await getAddress(showAlert);

  if (!address) return false;

  saveActiveAddress(address);
  return true;
};

export const getAddress = async (
  showAlert: ShowAlert,
): Promise<Address | undefined> => {
  if (device.web) {
    if (!navigator.geolocation) {
      showAlert('Não é possível obter localização!');
      return;
    }

    const location = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          maximumAge: 5 * 60 * 1000,
          timeout: 10 * 1000,
        });
      },
    ).catch(() => undefined);

    if (!location) {
      showAlert('Erro ao obter localização!');
      return;
    }

    const address = await api.location.reverseGeocode(location.coords);

    return {
      id: '',
      nickname: '',
      ...address,
      coords: {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      },
    };
  }

  const location = await getCurrentPositionAsync({
    accuracy: LocationAccuracy.Highest,
  }).catch(() => undefined);

  if (!location) {
    showAlert('Erro ao obter localização!');
    return;
  }

  const [raw] = await reverseGeocodeAsync(location.coords);

  return {
    id: '',
    nickname: '',
    street: raw.street?.replace('Avenida', 'Av.') ?? '',
    number: raw.streetNumber ?? '',
    district: raw.district ?? '',
    city: (device.iOS ? raw.city : raw.subregion) ?? '',
    state: raw.region ? getStateCode(raw.region) : '',
    coords: {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    },
  };
};
