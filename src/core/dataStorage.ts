import AsyncStorage from '@react-native-async-storage/async-storage';
import { Address, OrderPayment, Product, ShoppingList } from '~/core/models';
import { getJwtExpiration } from '~/functions/converter';

const prefix = '@prontoentrega:';

const key = {
  isNewUser: prefix + 'isNewUser',
  refreshToken: prefix + 'refreshToken',
  activeAddressId: prefix + 'activeAddressId',
  activeAddress: prefix + 'activeAddress',
  notifies: prefix + 'notifies',
  favorites: prefix + 'favorites',
  shoppingList: prefix + 'shoppingList',
  activeMarketId: prefix + 'activeMarketId',
  activeMarket: prefix + 'activeMarket',
  notifConfig: prefix + 'notifConfig',
  lastPayment: prefix + 'lastPayment',
  confirmationTokens: prefix + 'confirmationTokens',
};

// isNewUser
export const saveIsNewUser = async (isNewUser: boolean) => {
  !isNewUser
    ? await AsyncStorage.setItem(key.isNewUser, 'false')
    : await AsyncStorage.removeItem(key.isNewUser);
};

export const getIsNewUser = async () => {
  const value = await AsyncStorage.getItem(key.isNewUser);
  return value !== 'false';
};

// refreshToken
export const saveRefreshToken = async (value: string | null) => {
  value
    ? await AsyncStorage.setItem(key.refreshToken, value)
    : await AsyncStorage.removeItem(key.refreshToken);
};

export const getRefreshToken = async () => {
  return AsyncStorage.getItem(key.refreshToken);
};

// activeAddressId
export const saveActiveAddressId = async (value: string | null) => {
  value
    ? await AsyncStorage.setItem(key.activeAddressId, value)
    : await AsyncStorage.removeItem(key.activeAddressId);
};

export const getActiveAddressId = async () => {
  return AsyncStorage.getItem(key.activeAddressId);
};

// activeAddress
export const saveActiveAddress = async (value: Address) => {
  const stringValue = JSON.stringify(value);
  await AsyncStorage.setItem(key.activeAddress, stringValue);
};

export const getActiveAddress = async () => {
  const stringValue = await AsyncStorage.getItem(key.activeAddress);
  return stringValue ? (JSON.parse(stringValue) as Address) : null;
};

// notifies
export const saveNotifies = async (value: Map<string, Product>) => {
  const stringValue = JSON.stringify([...value]);
  await AsyncStorage.setItem(key.notifies, stringValue);
};

export const getNotifies = async () => {
  const stringValue = await AsyncStorage.getItem(key.notifies);
  return new Map<string, Product>(stringValue ? JSON.parse(stringValue) : null);
};

// favorites
export const saveFavorites = async (value: Set<string>) => {
  const stringValue = JSON.stringify([...value]);
  await AsyncStorage.setItem(key.favorites, stringValue);
};

export const getFavorites = async () => {
  const stringValue = await AsyncStorage.getItem(key.favorites);
  return new Set<string>(stringValue ? JSON.parse(stringValue) : null);
};

// shoppingList
export const saveShoppingList = async (value: ShoppingList) => {
  const stringValue = JSON.stringify([...value]);
  await AsyncStorage.setItem(key.shoppingList, stringValue);
};

export const getShoppingList = async () => {
  const stringValue = await AsyncStorage.getItem(key.shoppingList);
  return new Map(stringValue ? JSON.parse(stringValue) : null) as ShoppingList;
};

// activeMarketId
export const saveActiveMarketId = async (
  market_id?: string,
  city_slug?: string,
) => {
  if (!market_id || !city_slug)
    return AsyncStorage.removeItem(key.activeMarketId);

  const stringValue = JSON.stringify({ market_id, city_slug });
  await AsyncStorage.setItem(key.activeMarketId, stringValue);
};

export const getActiveMarketId = async () => {
  const stringValue = await AsyncStorage.getItem(key.activeMarketId);
  return JSON.parse(stringValue ?? '{}') as {
    market_id?: string;
    city_slug?: string;
  };
};

// notifConfig
export const saveNotifConfig = async (value: Map<string, boolean>) => {
  if (!value.size) return AsyncStorage.removeItem(key.notifConfig);

  const stringValue = JSON.stringify([...value]);
  await AsyncStorage.setItem(key.notifConfig, stringValue);
};

export const getNotifConfig = async () => {
  const stringValue = await AsyncStorage.getItem(key.notifConfig);
  return new Map<string, boolean>(JSON.parse(stringValue ?? '[]'));
};

// lastPayment
export const saveLastPayment = async (value: OrderPayment | null) => {
  value
    ? await AsyncStorage.setItem(key.lastPayment, JSON.stringify(value))
    : await AsyncStorage.removeItem(key.lastPayment);
};

export const getLastPayment = async () => {
  const stringValue = await AsyncStorage.getItem(key.lastPayment);
  return stringValue ? (JSON.parse(stringValue) as OrderPayment) : null;
};

type ConfirmationToken = { order_id: string; token: string };

// confirmationToken
export const saveConfirmationToken = async (value: ConfirmationToken) => {
  const tokens = await getConfirmationTokens();
  const newTokens = tokens
    .filter((v) => getJwtExpiration(v.token) > Date.now())
    .concat(value);

  await AsyncStorage.setItem(key.confirmationTokens, JSON.stringify(newTokens));
};

export const getConfirmationTokens = async () => {
  const stringValue = await AsyncStorage.getItem(key.confirmationTokens);
  return stringValue ? (JSON.parse(stringValue) as ConfirmationToken[]) : [];
};
