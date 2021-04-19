import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { myColors, device } from "../constants";

function MessageModal({isVisible, setVisible, message}: {isVisible: boolean, setVisible: any, message: string}) {
  return (
    <Modal visible={isVisible} animationType='slide' transparent onRequestClose={()=> setVisible(false)} >
      <View style={styles.conteiner} >
        <Text>{message}</Text>
      </View>
    </Modal>
  )
}

const padding = device.iOS ? 50 : 20
const styles = StyleSheet.create({
  model: {
    opacity: 0.3,
    backgroundColor: '#000000',
    width: 100,
    height: 100
  },
  conteiner: {
    paddingBottom: padding,
    backgroundColor: myColors.background,
    padding: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  }
})

export default MessageModal