import React from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { Button } from "react-native-elements";
import { myColors, device } from "../constants";

function MyModal({isVisible, setVisible}: {isVisible: boolean, setVisible: any}) {
  const [state] = React.useState({
    opacity: new Animated.Value(0),
  })

  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(state.opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    } else {
      Animated.timing(state.opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    }
  }, [isVisible])

  return (
    <Animated.View style={[styles.conteiner, {opacity: state.opacity}]} >
      <Pressable style={styles.background} onPress={()=> setVisible(false)} />
      <View style={styles.modal} >
        <Text style={styles.title} >Title</Text>
        <Text style={styles.subtitle} >Subtitle</Text>
        <View style={{flexDirection: 'row-reverse'}} >
          <Button title='Comfirmar' onPress={() => null} />
          <Button title='Cancelar' onPress={() => null} type='outline' />
        </View>
      </View>
    </Animated.View>
  )
}

const padding = device.iOS ? 55 : 25
const styles = StyleSheet.create({
  conteiner: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    justifyContent: 'center',
  },
  background: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: '100%',
    width: '100%',
  },
  modal: {
    alignSelf: 'center',
    position: 'absolute',
    width: '90%',
    padding: 14,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    color: myColors.text4
  },
  subtitle: {
    color: myColors.text2
  }
})

export default MyModal