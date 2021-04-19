import AsyncStorage from "@react-native-async-storage/async-storage"
import { mercModel } from "../components/MercItem"
import { prodModel } from "../components/ProdItem"
import { orderModel } from "../pages/Compras/Order"
import { addressModel } from "../pages/Others/Address"
import requests from "../services/requests"

const suffix = '@poupapreco{g&?Op#b}/'

//returningUser
export const saveReturning = async () => {
  await AsyncStorage.setItem(suffix+'returningUser', 'returningUser')
}
export const isReturning = async () => {
  return AsyncStorage.getItem(suffix+'returningUser')
  .then(item => item === 'returningUser')
}

//shortAddress
export const getShortAddress = async () => {
  return getActiveAddress()
  .then((address: addressModel | '') => {
    if (address === '') return 'Escolha um endereço';
    return (address.rua != '' ? address.rua : address.cidade)+(address.numero != '' ? ', '+address.numero : '')
  })
}

//longAddress
export const getLongAddress = async () => {
  return getActiveAddress()
  .then((address: addressModel | '') => {
    if (address === '') return {rua: '', bairro: ''};
    return {rua: (address.rua != '' ? address.rua : '')+(address.numero != '' ? ', '+address.numero : ''), bairro: address.bairro}
  })
}

//activeAddressIndex
export const saveActiveAddressIndex = async (value: number) => {
  const stringValue = JSON.stringify(value);
  await AsyncStorage.setItem(suffix+'activeAddressIndex', stringValue)
}

export const getActiveAddressIndex = async () => {
  const stringValue =  await AsyncStorage.getItem(suffix+'activeAddressIndex')
  const activeIndex: number = stringValue? JSON.parse(stringValue) : -1
  return activeIndex
}

//activeAddress
export const saveActiveAddress = async (value: addressModel) => {
  const stringValue = JSON.stringify(value);
  await AsyncStorage.setItem(suffix+'activeAddress', stringValue)
}

export const getActiveAddress = async () => {
  const stringValue =  await AsyncStorage.getItem(suffix+'activeAddress')
  const address: addressModel = stringValue? JSON.parse(stringValue) : ''
  return address
}

//addressList
export const saveAddressList = async (value: addressModel[]) => {
  const stringValue = JSON.stringify(value);
  await AsyncStorage.setItem(suffix+'addressList', stringValue)
}

export const getAddressList = async () => {
  const stringValue =  await AsyncStorage.getItem(suffix+'addressList');
  return stringValue? JSON.parse(stringValue) : []
}

//favorites
export const saveFavorites = async (value: Map<number, prodModel>) => {
  const stringValue = JSON.stringify(Array.from(value.entries()))
  await AsyncStorage.setItem(suffix+'favorites', stringValue)
}

export const getFavorites = async () => {
  const stringValue = await AsyncStorage.getItem(suffix+'favorites');
  return new Map<number, prodModel>(stringValue? JSON.parse(stringValue) : null)
}

//shoppingList
export const saveShoppingList = async (value: Map<number, {quantity: number, item: prodModel}>) => {
  const stringValue = JSON.stringify(Array.from(value.entries()))
  await AsyncStorage.setItem(suffix+'shoppingList', stringValue)
}

export const getShoppingList = async () => {
  const stringValue = await AsyncStorage.getItem(suffix+'shoppingList')
  return new Map<number, {quantity: number, item: prodModel}>
    (stringValue? JSON.parse(stringValue) : null)
}

//activeMarketKey
export const saveActiveMarketKey = async (value: number) => {
  const stringValue = JSON.stringify(value);
  await AsyncStorage.setItem(suffix+'activeMarketKey', stringValue)
  if (value == 0) {
    await AsyncStorage.removeItem(suffix+'activeMarket')
    return;
  }
  fetch(requests+'mercList.php')
      .then((response) => response.json())
      .then((json: mercModel[]) => saveActiveMarket(json[0]))
      .catch((error) => console.error(error));
}

export const getActiveMarketKey = async () => {
  const stringValue =  await AsyncStorage.getItem(suffix+'activeMarketKey')
  const activeIndex: number = stringValue? JSON.parse(stringValue) : 0;
  return activeIndex
}

//activeMarket
const saveActiveMarket = async (value: mercModel) => {
  const stringValue = JSON.stringify(value);
  await AsyncStorage.setItem(suffix+'activeMarket', stringValue)
}

export const getActiveMarket = async () => {
  const stringValue =  await AsyncStorage.getItem(suffix+'activeMarket')
  const activeMarket: mercModel = stringValue? JSON.parse(stringValue) : undefined
  return activeMarket
}

//ordersList
export const saveOrdersList = async (value: orderModel[]) => {
  const stringValue = JSON.stringify(value);
  await AsyncStorage.setItem(suffix+'ordersList', stringValue)
}

export const getOrdersList = async () => {
  const stringValue =  await AsyncStorage.getItem(suffix+'ordersList')
  const ordersList: orderModel[] = stringValue? JSON.parse(stringValue) : []
  return ordersList
}
