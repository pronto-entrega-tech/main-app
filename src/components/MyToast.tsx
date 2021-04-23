import React from "react";
import { StyleSheet, Animated, Text } from "react-native";
import { device, globalStyles, myColors } from "../constants";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useMyContext from "../functions/MyContext";

function MessageModal() {
  const { modalState, modalRefresh } = useMyContext();

  const [modal] = React.useState({
    opacity: new Animated.Value(0),
    scale: new Animated.Value(0.5),
  })

  React.useEffect(() => {
    if (modalState.message == '') return;
    Animated.parallel([
      Animated.timing(modal.opacity, { toValue: 0, duration: 0, useNativeDriver: true }),
      Animated.timing(modal.scale, { toValue: 0.5, duration: 0, useNativeDriver: true }),
    ]).start()

    Animated.parallel([
      Animated.timing(modal.opacity, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.timing(modal.scale, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start()

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(modal.opacity, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(modal.scale, { toValue: 0.5, duration: 150, useNativeDriver: true }),
      ]).start()
    }, modalState.long? 3500 : 2000)
    return () => {modalState.message = ''}
  }, [modalRefresh])

  return (
    <Animated.View style={[styles.model, globalStyles.elevation4, {
      opacity: modal.opacity,
      transform: [
        { scale: modal.scale }
      ]
    }]} >
      <Icon name='check' size={24} color='#FFF' />
      <Text style={{color: '#FFF', marginLeft: 8}} >{modalState.message}</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  model: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#4BB543',
    padding: 10,
    marginBottom: device.iPhoneNotch? 142:112,
    borderRadius: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  }
})

export default MessageModal