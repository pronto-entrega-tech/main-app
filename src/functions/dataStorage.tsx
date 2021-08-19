import AsyncStorage from "@react-native-async-storage/async-storage"
import { mercModel } from "../components/MercItem"
import { prodModel } from "../components/ProdItem"
import { orderModel } from "../pages/Compras/Order"
import { addressModel } from "../pages/Others/Address"
import { profileModel } from "../pages/Others/MyProfile"
import requests from "../services/requests"
import { createMercItem, removeAccents } from "./converter"

const suffix = '@prontoentrega{g&?Op#b}/'

// userStatus
export async function saveUserStatus(status: 'returning'|'returning&logged') {
  await AsyncStorage.setItem(suffix+'userStatus', status)
}

export async function getUserStatus(): Promise<'returning'|'returning&logged'|undefined> {
  const value = await AsyncStorage.getItem(suffix+'userStatus')
  if (value == 'returning' || value == 'returning&logged') return value
  return
}

// guest
export async function saveIsGuest(isGuest: boolean) {
  if (isGuest) {
    await AsyncStorage.removeItem(suffix+'guest')
  } else {
    await AsyncStorage.setItem(suffix+'guest', 'notGuest')
  }
}

export async function getIsGuest() {
  const item = await  AsyncStorage.getItem(suffix+'guest')
  return item !== 'notGuest'
}

// shortAddress
export async function getShortAddress() {
  const address: addressModel = await getActiveAddress()
  if (!address) return 'Escolha um endereço'
  return (address.rua !== '' ? address.rua : address.cidade)+(address.numero !== '' ? ', '+address.numero : '')
}

// longAddress
export async function getLongAddress() {
  const address: addressModel = await getActiveAddress()
  if (!address) return {rua: '', bairro: ''}
  return {rua: (address.rua !== '' ? address.rua : '')+(address.numero !== '' ? ', '+address.numero : ''), bairro: address.bairro}
}

// city
export async function getCity() {
  const address: addressModel = await getActiveAddress()
  return removeAccents(address.cidade)+'-'+address.estado?.toLowerCase()
}

// activeAddressIndex
export async function saveActiveAddressIndex(value: number) {
  const stringValue = JSON.stringify(value)
  await AsyncStorage.setItem(suffix+'activeAddressIndex', stringValue)
}

export async function getActiveAddressIndex() {
  const stringValue =  await AsyncStorage.getItem(suffix+'activeAddressIndex')
  return stringValue? +JSON.parse(stringValue) : -1
}

// activeAddress
export async function saveActiveAddress(value: addressModel) {
  const stringValue = JSON.stringify(value)
  await AsyncStorage.setItem(suffix+'activeAddress', stringValue)
}

export async function getActiveAddress(): Promise<addressModel> {
  const stringValue =  await AsyncStorage.getItem(suffix+'activeAddress')
  return stringValue? JSON.parse(stringValue) : ''
}

// addressList
export async function saveAddressList(value: addressModel[]) {
  const stringValue = JSON.stringify(value)
  await AsyncStorage.setItem(suffix+'addressList', stringValue)
}

export async function getAddressList(): Promise<addressModel[]> {
  const stringValue =  await AsyncStorage.getItem(suffix+'addressList')
  return stringValue? JSON.parse(stringValue) : []
}

// notify
export async function saveNotify(value: Map<string, prodModel>) {
  const stringValue = JSON.stringify(Array.from(value.entries()))
  await AsyncStorage.setItem(suffix+'notify', stringValue)
}

export async function getNotify() {
  const stringValue = await AsyncStorage.getItem(suffix+'notify')
  return new Map<string, prodModel>(stringValue? JSON.parse(stringValue) : null)
}

// favorites
export async function saveFavorites(value: Map<string, prodModel>) {
  const stringValue = JSON.stringify(Array.from(value.entries()))
  await AsyncStorage.setItem(suffix+'favorites', stringValue)
}

export async function getFavorites() {
  const stringValue = await AsyncStorage.getItem(suffix+'favorites')
  return new Map<string, prodModel>(stringValue? JSON.parse(stringValue) : null)
}

// shoppingList
export async function saveShoppingList(value: Map<string, {quantity: number, item: prodModel}>) {
  const stringValue = JSON.stringify(Array.from(value.entries()))
  await AsyncStorage.setItem(suffix+'shoppingList', stringValue)
}

export async function getShoppingList() {
  const stringValue = await AsyncStorage.getItem(suffix+'shoppingList')
  return new Map<string, {quantity: number, item: prodModel}>(stringValue? JSON.parse(stringValue) : null)
}

// activeMarketKey
export async function saveActiveMarketKey(value: string, city?: string) {
  const stringValue = JSON.stringify(value)
  await AsyncStorage.setItem(suffix+'activeMarketKey', stringValue)
  if (value === '') {
    await AsyncStorage.removeItem(suffix+'activeMarket')
    return
  }
  fetch(requests+`mercList.php?city=${city}&market=${value}`)
  .then((response) => response.json())
  .then((json: mercModel[]) => saveActiveMarket(createMercItem(json[0])))
  .catch((error) => console.error(error))
}

export async function getActiveMarketKey(): Promise<string> {
  const stringValue =  await AsyncStorage.getItem(suffix+'activeMarketKey')
  return stringValue? JSON.parse(stringValue) : ''
}

// activeMarket
async function saveActiveMarket(value: mercModel) {
  const stringValue = JSON.stringify(value)
  await AsyncStorage.setItem(suffix+'activeMarket', stringValue)
}

export async function getActiveMarket(): Promise<mercModel> {
  const stringValue =  await AsyncStorage.getItem(suffix+'activeMarket')
  return stringValue? JSON.parse(stringValue) : undefined
}

// ordersList
export async function saveOrdersList(value: orderModel[]) {
  const stringValue = JSON.stringify(value)
  await AsyncStorage.setItem(suffix+'ordersList', stringValue)
}

export async function getOrdersList(): Promise<orderModel[]> {
  const stringValue =  await AsyncStorage.getItem(suffix+'ordersList')
  return stringValue? JSON.parse(stringValue) : []
}

// profile
export async function saveProfile(value: profileModel) {
  const stringValue = JSON.stringify(value)
  await AsyncStorage.setItem(suffix+'ordersList', stringValue)
}

export async function getProfile(): Promise<profileModel> {
  const stringValue =  await AsyncStorage.getItem(suffix+'ordersList')
  return stringValue? JSON.parse(stringValue) : undefined
}

// lastPayment
export async function saveLastPayment(value: {title: string, sub: string}) {
  const stringValue = JSON.stringify(value)
  await AsyncStorage.setItem(suffix+'lastPayment', stringValue)
}

export async function getLastPayment(): Promise<{title: string, sub: string}> {
  const stringValue =  await AsyncStorage.getItem(suffix+'lastPayment')
  return stringValue? JSON.parse(stringValue) : undefined
}