import AsyncStorage from "@react-native-async-storage/async-storage"
import { mercModel } from "../components/MercItem"
import { prodModel } from "../components/ProdItem"
import { orderModel } from "../pages/Compras/Order"
import { addressModel } from "../pages/Others/Address"
import { profileModel } from "../pages/Others/MyProfile"
import requests from "../services/requests"
import { createMercItem } from "./converter"

const suffix = '@poupapreco{g&?Op#b}/'

//userStatus
export async function saveUserStatus(status: 'returning'|'returning&logged') {
  await AsyncStorage.setItem(suffix+'userStatus', status)
}

export async function getUserStatus(): Promise<'returning'|'returning&logged'|undefined> {
  const value = await AsyncStorage.getItem(suffix+'userStatus')
  if (value == 'returning' || value == 'returning&logged') return value;
  return
}

//guest
export async function saveIsGuest(isGuest: boolean) {
  if (isGuest) {
    await AsyncStorage.removeItem(suffix+'guest')
  } else {
    await AsyncStorage.setItem(suffix+'guest', 'notGuest')
  }
}

export async function getIsGuest() {
  return AsyncStorage.getItem(suffix+'guest')
  .then(item => item !== 'notGuest')
}

//shortAddress
export async function getShortAddress() {
  return getActiveAddress()
  .then((address: addressModel | '') => {
    if (address === '') return 'Escolha um endereço';
    return (address.rua != '' ? address.rua : address.cidade)+(address.numero != '' ? ', '+address.numero : '')
  })
}

//longAddress
export async function getLongAddress() {
  return getActiveAddress()
  .then((address: addressModel | '') => {
    if (address === '') return {rua: '', bairro: ''};
    return {rua: (address.rua != '' ? address.rua : '')+(address.numero != '' ? ', '+address.numero : ''), bairro: address.bairro}
  })
}

//activeAddressIndex
export async function saveActiveAddressIndex(value: number) {
  const stringValue = JSON.stringify(value);
  await AsyncStorage.setItem(suffix+'activeAddressIndex', stringValue)
}

export async function getActiveAddressIndex() {
  const stringValue =  await AsyncStorage.getItem(suffix+'activeAddressIndex')
  const activeIndex: number = stringValue? JSON.parse(stringValue) : -1
  return activeIndex
}

//activeAddress
export async function saveActiveAddress(value: addressModel) {
  const stringValue = JSON.stringify(value);
  await AsyncStorage.setItem(suffix+'activeAddress', stringValue)
}

export async function getActiveAddress() {
  const stringValue =  await AsyncStorage.getItem(suffix+'activeAddress')
  const address: addressModel = stringValue? JSON.parse(stringValue) : ''
  return address
}

//addressList
export async function saveAddressList(value: addressModel[]) {
  const stringValue = JSON.stringify(value);
  await AsyncStorage.setItem(suffix+'addressList', stringValue)
}

export async function getAddressList(): Promise<addressModel[]> {
  const stringValue =  await AsyncStorage.getItem(suffix+'addressList');
  return stringValue? JSON.parse(stringValue) : []
}

//favorites
export async function saveFavorites(value: Map<string, prodModel>) {
  const stringValue = JSON.stringify(Array.from(value.entries()))
  await AsyncStorage.setItem(suffix+'favorites', stringValue)
}

export async function getFavorites() {
  const stringValue = await AsyncStorage.getItem(suffix+'favorites');
  return new Map<string, prodModel>(stringValue? JSON.parse(stringValue) : null)
}

//shoppingList
export async function saveShoppingList(value: Map<string, {quantity: number, item: prodModel}>) {
  const stringValue = JSON.stringify(Array.from(value.entries()))
  await AsyncStorage.setItem(suffix+'shoppingList', stringValue)
}

export async function getShoppingList() {
  const stringValue = await AsyncStorage.getItem(suffix+'shoppingList')
  return new Map<string, {quantity: number, item: prodModel}>(stringValue? JSON.parse(stringValue) : null)
}

//activeMarketKey
export async function saveActiveMarketKey(value: string) {
  const stringValue = JSON.stringify(value);
  await AsyncStorage.setItem(suffix+'activeMarketKey', stringValue)
  if (value == '') {
    await AsyncStorage.removeItem(suffix+'activeMarket')
    return;
  }
  fetch(requests+'mercList.php')
  .then((response) => response.json())
  .then((json: mercModel[]) => saveActiveMarket(createMercItem(json[0])))
  .catch((error) => console.error(error));
}

export async function getActiveMarketKey() {
  const stringValue =  await AsyncStorage.getItem(suffix+'activeMarketKey')
  const activeKey: string = stringValue? JSON.parse(stringValue) : 0;
  return activeKey
}

//activeMarket
async function saveActiveMarket(value: mercModel) {
  const stringValue = JSON.stringify(value);
  await AsyncStorage.setItem(suffix+'activeMarket', stringValue)
}

export async function getActiveMarket() {
  const stringValue =  await AsyncStorage.getItem(suffix+'activeMarket')
  const activeMarket: mercModel = stringValue? JSON.parse(stringValue) : undefined
  return activeMarket
}

//ordersList
export async function saveOrdersList(value: orderModel[]) {
  const stringValue = JSON.stringify(value);
  await AsyncStorage.setItem(suffix+'ordersList', stringValue)
}

export async function getOrdersList() {
  const stringValue =  await AsyncStorage.getItem(suffix+'ordersList')
  const ordersList: orderModel[] = stringValue? JSON.parse(stringValue) : []
  return ordersList
}

//profile
export async function saveProfile(value: profileModel) {
  const stringValue = JSON.stringify(value);
  await AsyncStorage.setItem(suffix+'ordersList', stringValue)
}

export async function getProfile() {
  const stringValue =  await AsyncStorage.getItem(suffix+'ordersList')
  const ordersList: profileModel = stringValue? JSON.parse(stringValue) : undefined
  return ordersList
}

//lastPayment
export async function saveLastPayment(value: {title: string, sub: string}) {
  const stringValue = JSON.stringify(value);
  await AsyncStorage.setItem(suffix+'lastPayment', stringValue)
}

export async function getLastPayment() {
  const stringValue =  await AsyncStorage.getItem(suffix+'lastPayment')
  const lastPayment: {title: string, sub: string} = stringValue? JSON.parse(stringValue) : undefined
  return lastPayment
}