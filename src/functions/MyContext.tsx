import React from 'react';
import { Alert, Animated } from 'react-native';
import { prodModel } from '../components/ProdItem';
import { getActiveMarketKey, getFavorites, getShoppingList, saveActiveMarketKey, saveFavorites, saveShoppingList } from './dataStorage';
import validate from './validate';

interface contextModel {
  refresh: boolean,
  subtotal: number,
  setSubtotal: React.Dispatch<React.SetStateAction<number>>,
  shoppingList: Map<number, {
    quantity: number;
    item: prodModel;
  }>,
  setShoppingList: React.Dispatch<React.SetStateAction<Map<number, {
    quantity: number;
    item: prodModel;
  }>>>,
  favorites: Map<number, prodModel>,
  onPressFav: (item: prodModel) => void,
  onPressAdd: (item: prodModel) => void,
  onPressRemove: (item: prodModel) => void,
  setActiveMarketKey: React.Dispatch<React.SetStateAction<number>>,
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
  const [refresh, setRefresh] = React.useState<boolean>(false);
  const [subtotal, setSubtotal] = React.useState<number>(0);
  const [activeMarketKey, setActiveMarketKey] = React.useState<number>(0);
  const [shoppingList, setShoppingList] = React.useState<Map<number, {quantity: number, item: prodModel}>>(new Map);
  const [favorites, setFavorites] = React.useState<Map<number, prodModel>>(new Map);
  const doRefresh = () => setRefresh(c => !c);
  
  const [modalRefresh, setModalRefresh] = React.useState<boolean>(false);
  const doModalRefresh = () => setModalRefresh(c => !c);
  const [modalState, setModalState] = React.useState({
    message: '',
    long: false
  })  

  const toast = (message: string, long = false) => {
    setModalState({
      message: message, 
      long: long,
    })
    doModalRefresh()
  }
  
  const onPressFav = (item: prodModel) => {
    if (!validate([favorites])) return;
    let isFavorite = favorites.has(item.prodKey);
    if (isFavorite) {
      if (favorites.delete(item.prodKey)) {
        setFavorites(favorites)
        saveFavorites(favorites)
        doRefresh()
      } else {
        Alert.alert('Erro ao remover produto')
      }
    } else {
      const newFavorites = favorites.set(item.prodKey, item);
      setFavorites(newFavorites)
      saveFavorites(newFavorites)
      doRefresh()
    }
  }

  const onPressAdd = (item: prodModel) => {
    if (!validate([shoppingList, activeMarketKey])) return;
    if (activeMarketKey == 0) {
      saveActiveMarketKey(item.mercKey)
      setActiveMarketKey(item.mercKey)
    } else if (item.mercKey != activeMarketKey) {
      Alert.alert("O carrinho já possui itens de outro mercado",'Deseja limpar o carrinho?',[
        {text: 'Cancelar', style: 'cancel'},{text: 'Confirmar', onPress: () => {
          saveActiveMarketKey(item.mercKey)
          setActiveMarketKey(item.mercKey)
          const newShoppingList = new Map;
          newShoppingList.set(item.prodKey, {quantity: 1, item: item})
          setShoppingList(newShoppingList)
          setSubtotal(updateCart(newShoppingList))
          saveShoppingList(newShoppingList)
          doRefresh()
        }}], {cancelable: true})
        return
    }
    let value: number | undefined = shoppingList.has(item.prodKey) ? shoppingList.get(item.prodKey)?.quantity : 0;
    if (typeof value == 'undefined') return Alert.alert('Erro ao adicionar produto', 'Tente novamente');
    if (value >= 99) return
    shoppingList.set(item.prodKey, {quantity: value+1, item: item})
    setShoppingList(shoppingList)
    setSubtotal(updateCart(shoppingList))
    saveShoppingList(shoppingList)
    doRefresh()
  }

  const onPressRemove = (item: prodModel) => {
    if (!validate([shoppingList, activeMarketKey])) return;
    let value: number | undefined = shoppingList.has(item.prodKey) ? shoppingList.get(item.prodKey)?.quantity : 0;
    if (typeof value == 'undefined') return Alert.alert('Erro ao remover produto', 'Tente novamente');
    if (value > 1) {
      setShoppingList(shoppingList.set(item.prodKey, {quantity: value-1, item: item}))
      setSubtotal(updateCart(shoppingList))
      saveShoppingList(shoppingList)
      doRefresh()
    } else if (value == 1) {
      if (shoppingList.delete(item.prodKey)) {
        if (shoppingList.size == 0) {
          saveActiveMarketKey(0)
          setActiveMarketKey(0)
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

  React.useEffect(() => {
    getShoppingList()
      .then(list => {if (list != null) {
        setShoppingList(list)
        setSubtotal(updateCart(list))
        doRefresh()
      }});

    getActiveMarketKey()
    .then(key => setActiveMarketKey(key))

    getFavorites()
      .then(favorites => setFavorites(favorites));
  }, []);
  
  return <MyContext.Provider value={{
    refresh: refresh,
    subtotal: subtotal,
    setSubtotal: setSubtotal,
    shoppingList: shoppingList,
    setShoppingList: setShoppingList,
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

function updateCart(shoppingList: Map<number, {quantity: number, item: prodModel}>) {
  if (!validate([shoppingList])) return 0;
  var final: number = 0
  const keys = Array.from(shoppingList.keys());
  for (var i = 0; i < keys.length ;i++) {
    const key = keys[i]
    const item = shoppingList.get(key)
    if (typeof item === 'undefined') return 0;
    final = final + (item?.item.preco * item.quantity)
  }
  return final;
}

export {
  MyProvider,
}

export default useMyContext