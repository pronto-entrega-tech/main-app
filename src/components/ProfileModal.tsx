import React from "react";
import { StyleSheet, Pressable, Animated } from "react-native";
import { myColors, device } from "../constants";
import IconButtonText from "./IconButtonText";
import * as ImagePicker from 'expo-image-picker';
import { getProfile, saveProfile } from "../functions/dataStorage";
import { profileModel } from "../pages/Others/MyProfile";

function ProfileModal({isVisible, setVisible, setProfile}:
{isVisible: boolean, setVisible: () => void, setProfile: (profile: profileModel) => void}) {
  const [state] = React.useState({
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

  const openCamera = () => {
    setVisible();
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') return;
      
      const image = await ImagePicker.launchCameraAsync({aspect: [1,1], quality: 0.5});
      if (image.cancelled) return;
      getProfile()
        .then(profile => {
          profile.photoUri = {uri: image.uri}
          saveProfile(profile)
          setProfile(profile)
        })
        .catch(() => alert('Erro ao salvar foto de perfil'))
    })();
  }
  
  const openPhotos = () => {
    setVisible();
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') return;
      
      const image = await ImagePicker.launchImageLibraryAsync({allowsEditing: true, aspect: [1,1], quality: 0.5});
      if (image.cancelled) return;
      getProfile()
        .then(profile => {
          profile.photoUri = {uri: image.uri}
          saveProfile(profile)
          setProfile(profile)
        })
        .catch(() => alert('Erro ao salvar foto de perfil'))
    })();
  }
  
  const removePhoto = () => {
    setVisible()
    getProfile()
      .then(profile => {
        profile.photoUri = undefined
        saveProfile(profile)
        setProfile(profile)
      })
      .catch(() => alert('Erro ao remover foto de perfil'))
  }

  return (
    <Animated.View style={[styles.conteiner, {
      transform: [
        { translateY: state.conteiner }
      ]
    }]} >
      <Animated.View style={{opacity: state.opacity}} >
        <Pressable style={[styles.background]} onPress={setVisible} />
      </Animated.View>
      <Animated.View style={[styles.modal, {
        transform: [
          { translateY: state.modal }
        ]
      }]} >
        <IconButtonText icon='camera' text={`Abrir\ncâmera`} onPress={openCamera} type='profile2' />
        <IconButtonText icon='image' text={`Adicionar\nfoto`} onPress={openPhotos} type='profile2' />
        <IconButtonText icon='delete' text={`Remover\nfoto`} onPress={removePhoto} type='profile2' />
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