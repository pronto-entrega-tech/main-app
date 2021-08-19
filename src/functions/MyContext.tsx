import React from 'react';
import { Alert } from 'react-native';
import { prodModel } from '../components/ProdItem';
import { money, Money } from './converter';
import { getActiveMarketKey, getFavorites, getShoppingList, saveActiveMarketKey, saveFavorites, getIsGuest, saveIsGuest, saveShoppingList, saveNotify, getCity } from './dataStorage';

interface contextModel {
  isGuest: boolean,
  setIsGuest: (isGuest: boolean) => Promise<void>,
  refresh: boolean,
  subtotal: Money,
  setSubtotal: React.Dispatch<React.SetStateAction<Money>>,
  shoppingList: Map<string, {
    quantity: number;
    item: prodModel;
  }>,
  setShoppingList: React.Dispatch<React.SetStateAction<Map<string, {
    quantity: number;
    item: prodModel;
  }>>>,
  notify: Map<string, prodModel>,
  onPressNot: (item: prodModel) => void,
  favorites: Map<string, prodModel>,
  onPressFav: (item: prodModel) => void,
  onPressAdd: (item: prodModel) => void,
  onPressRemove: (item: prodModel) => void,
  setActiveMarketKey: React.Dispatch<React.SetStateAction<string>>,
  modalState: {
    message: string;
    long?: boolean;
  },
  toast: (message: string, long?: boolean) => void,
  modalRefresh: boolean,
} 

const MyContext = React.createContext<contextModel | undefined>(undefined);

function useMyContext() {
  const context = React.useContext(MyContext)
  if (!context) {
    throw new Error(`useMyContext must be used within a MyContext`)
  }
  return context
}

function MyProvider(props: any) {
  const [isGuest, setIsGuest] = React.useState<boolean>();
  const [refresh, setRefresh] = React.useState<boolean>(false);
  const [subtotal, setSubtotal] = React.useState<Money>(money('0'));
  const [city, seCity] = React.useState<string>('');
  const [activeMarketKey, setActiveMarketKey] = React.useState<string>('');
  const [shoppingList, setShoppingList] = React.useState<Map<string, {quantity: number, item: prodModel}>>(new Map);
  const [notify, setNotify] = React.useState<Map<string, prodModel>>(new Map);
  const [favorites, setFavorites] = React.useState<Map<string, prodModel>>(new Map);
  const doSetIsGuest = async (isGuest: boolean) => {
    setIsGuest(isGuest)
    await saveIsGuest(isGuest)
  }
  const doRefresh = () => setRefresh(c => !c);
  
  const [modalRefresh, setModalRefresh] = React.useState<boolean>(false);
  const doModalRefresh = () => setModalRefresh(c => !c);
  const [modalState, setModalState] = React.useState({
    message: '',
    long: false
  })

  React.useEffect(() => {
    getIsGuest()
    .then(isGuest => setIsGuest(isGuest))

    getActiveMarketKey()
    .then(key => setActiveMarketKey(key))

    getFavorites()
    .then(favorites => setFavorites(favorites))

    getShoppingList()
    .then(list => {if (list != null) {
      setShoppingList(list)
      setSubtotal(updateCart(list))
      doRefresh()
    }})

    getCity()
    .then(city => seCity(city))
  }, [])

  const toast = (message: string, long = false) => {
    setModalState({
      message: message, 
      long: long,
    })
    doModalRefresh()
  }
  
  const onPressNot = (item: prodModel) => {
    let isNotify = notify.has(item.prod_id);
    if (isNotify) {
      if (notify.delete(item.prod_id)) {
        setNotify(notify)
        saveNotify(notify)
        doRefresh()
      } else {
        Alert.alert('Erro ao remover produto')
      }
    } else {
      const newNotify = notify.set(item.prod_id, item);
      setNotify(newNotify)
      saveNotify(newNotify)
      doRefresh()
    }
  }
  
  const onPressFav = (item: prodModel) => {
    let isFavorite = favorites.has(item.prod_id);
    if (isFavorite) {
      if (favorites.delete(item.prod_id)) {
        setFavorites(favorites)
        saveFavorites(favorites)
        doRefresh()
      } else {
        Alert.alert('Erro ao remover produto')
      }
    } else {
      const newFavorites = favorites.set(item.prod_id, item);
      setFavorites(newFavorites)
      saveFavorites(newFavorites)
      doRefresh()
    }
  }

  const onPressAdd = (item: prodModel) => {
    if (activeMarketKey == '') {
      saveActiveMarketKey(item.market_id, city)
      setActiveMarketKey(item.market_id)
    } else if (item.market_id != activeMarketKey) {
      Alert.alert("O carrinho já possui itens de outro mercado",'Deseja limpar o carrinho?',[
        {text: 'Cancelar', style: 'cancel'},{text: 'Confirmar', onPress: () => {
          saveActiveMarketKey(item.market_id, city)
          setActiveMarketKey(item.market_id)
          const newShoppingList = new Map;
          newShoppingList.set(item.prod_id, {quantity: 1, item: item})
          setShoppingList(newShoppingList)
          setSubtotal(updateCart(newShoppingList))
          saveShoppingList(newShoppingList)
          doRefresh()
        }}
      ], {cancelable: true})
      return;
    }
    let value: number | undefined = shoppingList.has(item.prod_id) ? shoppingList.get(item.prod_id)?.quantity : 0;
    if (typeof value == 'undefined') return Alert.alert('Erro ao adicionar produto', 'Tente novamente');
    if (value >= 99) return
    shoppingList.set(item.prod_id, {quantity: value+1, item: item})
    setShoppingList(shoppingList)
    setSubtotal(updateCart(shoppingList))
    saveShoppingList(shoppingList)
    doRefresh()
  }

  const onPressRemove = (item: prodModel) => {
    let value: number | undefined = shoppingList.has(item.prod_id) ? shoppingList.get(item.prod_id)?.quantity : 0;
    if (typeof value == 'undefined') return Alert.alert('Erro ao remover produto', 'Tente novamente');
    if (value > 1) {
      setShoppingList(shoppingList.set(item.prod_id, {quantity: value-1, item: item}))
      setSubtotal(updateCart(shoppingList))
      saveShoppingList(shoppingList)
      doRefresh()
    } else if (value == 1) {
      if (shoppingList.delete(item.prod_id)) {
        if (shoppingList.size == 0) {
          saveActiveMarketKey('')
          setActiveMarketKey('')
        }
        setShoppingList(shoppingList)
        setSubtotal(updateCart(shoppingList))
        saveShoppingList(shoppingList)
        doRefresh()
      } else {
        Alert.alert('Erro ao remover produto')
      }
    }
  }
  
  return <MyContext.Provider value={{
    isGuest: isGuest,
    setIsGuest: doSetIsGuest,
    refresh: refresh,
    subtotal: subtotal,
    setSubtotal: setSubtotal,
    shoppingList: shoppingList,
    setShoppingList: setShoppingList,
    notify: notify,
    onPressNot: onPressNot,
    favorites: favorites,
    onPressFav: onPressFav,
    onPressAdd: onPressAdd,
    onPressRemove: onPressRemove,
    setActiveMarketKey: setActiveMarketKey,
    modalState: modalState,
    toast: toast,
    modalRefresh: modalRefresh
  }} {...props} />
}

function updateCart(shoppingList: Map<string, {quantity: number, item: prodModel}>) {
  var final = money('0')
  if (!shoppingList || shoppingList.size == 0) return final;
  const keys = Array.from(shoppingList.keys());
  for (var i = 0; i < keys.length; i++) {
    const item = shoppingList.get(keys[i])
    if (item) (
      final.add(item.item.price.value * item.quantity)
    )
  }
  return final;
}

export {
  MyProvider,
}

export default useMyContext