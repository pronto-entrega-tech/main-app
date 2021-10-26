import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Market } from '~/components/MarketItem';
import type { Product } from '~/components/ProdItem';
import type { Order } from '@pages/compras/pedido';
import type { addressModel } from '@pages/endereco';
import type { Profile } from '@pages/meu-perfil';
import { getMarket } from '~/services/requests';
import { toCityState } from '~/functions/converter';

const suffix = '@prontoentrega{g&?Op#b}/';

// userStatus
export async function saveUserStatus(status: 'returning' | 'returning&logged') {
  await AsyncStorage.setItem(suffix + 'userStatus', status);
}

export async function getUserStatus() {
  const value = await AsyncStorage.getItem(suffix + 'userStatus');
  if (value === 'returning' || value === 'returning&logged') return value;
  return null;
}

// guest
export async function saveIsGuest(isGuest: boolean) {
  if (isGuest) {
    await AsyncStorage.removeItem(suffix + 'guest');
  } else {
    await AsyncStorage.setItem(suffix + 'guest', 'notGuest');
  }
}

export async function getIsGuest() {
  const item = await AsyncStorage.getItem(suffix + 'guest');
  return item !== 'notGuest';
}

// shortAddress
export async function getShortAddress() {
  const address = await getActiveAddress();
  if (!address) return 'Escolha um endereço';
  return (
    (address.rua ?? address.cidade) +
    (address.numero ? ', ' + address.numero : '')
  );
}

// longAddress
export async function getLongAddress() {
  const address = await getActiveAddress();
  /* if (!address) return { rua: '', bairro: '' };
  return {
    rua: (address.rua ?? '') + (address.numero ? ', ' + address.numero : ''),
    bairro: address.bairro,
  }; */
  return address
    ? {
        rua: address.rua + (address.numero ? ', ' + address.numero : ''),
        bairro: address.bairro,
      }
    : { rua: '', bairro: '' };
}

// city
export async function getCity() {
  const address = await getActiveAddress();
  return address ? toCityState(address) : '';
}

// activeAddressIndex
export async function saveActiveAddressIndex(value: number) {
  const stringValue = JSON.stringify(value);
  await AsyncStorage.setItem(suffix + 'activeAddressIndex', stringValue);
}

export async function getActiveAddressIndex() {
  const stringValue = await AsyncStorage.getItem(suffix + 'activeAddressIndex');
  return stringValue ? +JSON.parse(stringValue) : -1;
}

// activeAddress
export async function saveActiveAddress(value: addressModel) {
  const stringValue = JSON.stringify(value);
  await AsyncStorage.setItem(suffix + 'activeAddress', stringValue);
}

export async function getActiveAddress() {
  const stringValue = await AsyncStorage.getItem(suffix + 'activeAddress');
  return stringValue ? (JSON.parse(stringValue) as addressModel) : null;
}

// addressList
export async function saveAddressList(value: addressModel[]) {
  const stringValue = JSON.stringify(value);
  await AsyncStorage.setItem(suffix + 'addressList', stringValue);
}

export async function getAddressList(): Promise<addressModel[]> {
  const stringValue = await AsyncStorage.getItem(suffix + 'addressList');
  return stringValue ? JSON.parse(stringValue) : [];
}

// notify
export async function saveNotify(value: Map<string, Product>) {
  const stringValue = JSON.stringify(Array.from(value));
  await AsyncStorage.setItem(suffix + 'notify', stringValue);
}

export async function getNotify() {
  const stringValue = await AsyncStorage.getItem(suffix + 'notify');
  return new Map<string, Product>(stringValue ? JSON.parse(stringValue) : null);
}

// favorites
export async function saveFavorites(value: Map<string, Product>) {
  const stringValue = JSON.stringify(Array.from(value));
  await AsyncStorage.setItem(suffix + 'favorites', stringValue);
}

export async function getFavorites() {
  const stringValue = await AsyncStorage.getItem(suffix + 'favorites');
  return new Map<string, Product>(stringValue ? JSON.parse(stringValue) : null);
}

// shoppingList
export async function saveShoppingList(
  value: Map<string, { quantity: number; item: Product }>
) {
  const stringValue = JSON.stringify(Array.from(value));
  await AsyncStorage.setItem(suffix + 'shoppingList', stringValue);
}

export async function getShoppingList() {
  const stringValue = await AsyncStorage.getItem(suffix + 'shoppingList');
  return new Map<string, { quantity: number; item: Product }>(
    stringValue ? JSON.parse(stringValue) : null
  );
}

// activeMarketId
export async function saveActiveMarketId(value: string, city?: string) {
  await AsyncStorage.setItem(suffix + 'activeMarketId', value);
  if (!value || !city) {
    return AsyncStorage.removeItem(suffix + 'activeMarket');
  }
  const data = await getMarket(city, value);
  if (!data) return;

  saveActiveMarket(data);
}

export async function getActiveMarketId() {
  const stringValue = await AsyncStorage.getItem(suffix + 'activeMarketId');
  return stringValue ?? '';
}

// activeMarket
async function saveActiveMarket(value: Market) {
  const stringValue = JSON.stringify(value);
  await AsyncStorage.setItem(suffix + 'activeMarket', stringValue);
}

export async function getActiveMarket(): Promise<Market> {
  const stringValue = await AsyncStorage.getItem(suffix + 'activeMarket');
  return stringValue ? JSON.parse(stringValue) : undefined;
}

// ordersList
export async function saveOrdersList(value: Order[]) {
  const stringValue = JSON.stringify(value);
  await AsyncStorage.setItem(suffix + 'ordersList', stringValue);
}

export async function getOrdersList() {
  const stringValue = await AsyncStorage.getItem(suffix + 'ordersList');
  return stringValue ? (JSON.parse(stringValue) as Order[]) : [];
}

// profile
export async function saveProfile(value: Profile) {
  const stringValue = JSON.stringify(value);
  await AsyncStorage.setItem(suffix + 'profile', stringValue);
}

export async function getProfile() {
  const stringValue = await AsyncStorage.getItem(suffix + 'profile');
  return stringValue ? (JSON.parse(stringValue) as Profile) : undefined;
}

// configNoti
export async function saveConfigNoti(value: Map<string, boolean>) {
  const stringValue = JSON.stringify(Array.from(value));
  await AsyncStorage.setItem(suffix + 'configNoti', stringValue);
}

export async function getConfigNoti() {
  try {
    const stringValue = await AsyncStorage.getItem(suffix + 'configNoti');
    return new Map<string, boolean>(JSON.parse(stringValue ?? ''));
  } catch {
    return new Map<string, boolean>();
  }
}

// lastPayment
export async function saveLastPayment(value: { title: string; sub: string }) {
  const stringValue = JSON.stringify(value);
  await AsyncStorage.setItem(suffix + 'lastPayment', stringValue);
}

interface Payment {
  title: string;
  sub: string;
}
export async function getLastPayment() {
  const stringValue = await AsyncStorage.getItem(suffix + 'lastPayment');
  return stringValue ? (JSON.parse(stringValue) as Payment) : null;
}
