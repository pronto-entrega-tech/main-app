import React from "react"
import { View, ActivityIndicator, StyleSheet } from "react-native"
import { myColors } from "../constants"
import MyButton from "./MyButton"
import MyText from "./MyText"

function Loading({title}: {title?: string}) {
  return (
    <View style={{backgroundColor: myColors.background, flex: 1, justifyContent: 'center', alignItems: 'center'}} >
      {!title? null :
      <MyText style={styles.loading} >{title}</MyText>
      }
      <ActivityIndicator color={myColors.loading} size='large' />
    </View>
  )
}

function Connection(onPress: () => void) {
  return (
    <View style={{backgroundColor: myColors.background, flex: 1, justifyContent: 'center', alignItems: 'center'}} >
      <MyText style={styles.title} >Sem conexão de internet</MyText>
      <MyText style={styles.subtitle} >Verifique sua conexão de internet e tente novamente</MyText>
      <MyButton type='clear' title='Tentar novamente' onPress={onPress} />
    </View>
  )
}

function Server(onPress: () => void) {
  return (
    <View style={{backgroundColor: myColors.background, flex: 1, justifyContent: 'center', alignItems: 'center'}} >
      <MyText style={styles.title} >Erro ao se conectar com o servidor</MyText>
      <MyText style={styles.subtitle} >Tente novamente mais tarde</MyText>
      <MyButton type='clear' title='Tentar novamente' onPress={onPress} />
    </View>
  )
}

function Nothing() {
  return (
    <View style={{backgroundColor: myColors.background, flex: 1, justifyContent: 'center', alignItems: 'center'}} >
      <MyText style={styles.title} >Nenhum mercado na região ainda</MyText>
      <MyText style={styles.subtitle} >Volte mais tarde</MyText>
    </View>
  )
}

function Errors({error, onPress}: {error: 'server'|'connection'|'nothing', onPress: () => void}) {
  switch (error) {
    case 'connection':
      return Connection(onPress)
    case 'nothing':
      return Nothing()
      
    default:
      return Server(onPress)
  }
}

const styles = StyleSheet.create({
  loading: {
    color: myColors.text3,
    fontSize: 16,
    marginBottom: 16,
  },
  title: {
    color: myColors.text3,
    fontSize: 19,
  },
  subtitle: {
    textAlign: 'center',
    marginHorizontal: 8,
    marginTop: 4,
    marginBottom: 6,
    color: myColors.text2,
  },
})

export { Errors }
export default Loading