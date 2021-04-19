import React from "react";
import { StyleSheet, Pressable, Animated } from "react-native";
import { myColors, device } from "../constants";
import IconButtonText from "./IconButtonText";

function ProfileModal({isVisible, setVisible}: {isVisible: boolean, setVisible: any}) {
  const [state, _setState] = React.useState({
    opacity: new Animated.Value(0),
    conteiner: new Animated.Value(device.height),
    modal: new Animated.Value(device.height),
  })

  const openModal = () => {
    Animated.parallel([
      Animated.timing(state.conteiner, { toValue: 0, duration: 0, useNativeDriver: true }),
      Animated.timing(state.opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(state.modal, { toValue: 0, duration: 200, useNativeDriver: true })
    ]).start()
  }

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(state.modal, { toValue: device.height, duration: 300, useNativeDriver: true }),
      Animated.timing(state.opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(state.conteiner, { toValue: device.height, duration: 0, delay: 300, useNativeDriver: true }),
    ]).start()
  }

  React.useEffect(() => {
    if (isVisible) {
      openModal()
    } else {
      closeModal()
    }
  }, [isVisible])

  return (
    <Animated.View style={[styles.conteiner, {
      transform: [
        { translateY: state.conteiner }
      ]
    }]} >
      <Animated.View style={{opacity: state.opacity}} >
        <Pressable style={[styles.background]} onPress={()=> setVisible(false)} />
      </Animated.View>
      <Animated.View style={[styles.modal, {
        transform: [
          { translateY: state.modal }
        ]
      }]} >
        <IconButtonText icon='camera' text={`Abrir\ncâmera`} onPress={()=> setVisible(false)} type='profile2' />
        <IconButtonText icon='image' text={`Adicionar\nfoto`} onPress={()=> setVisible(false)} type='profile2' />
        <IconButtonText icon='delete' text={`Remover\nfoto`} onPress={()=> setVisible(false)} type='profile2' />
      </Animated.View>
    </Animated.View>
  )
}

const padding = device.iOS ? 55 : 25
const styles = StyleSheet.create({
  conteiner: {
    height: '100%',
    width: '100%',
    position: 'absolute'
  },
  background: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: '100%',
    width: '100%',
  },
  modal: {
    width: '100%',
    paddingBottom: padding,
    paddingRight: '20%',
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: myColors.background,
    paddingVertical: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  }
})

export default ProfileModal