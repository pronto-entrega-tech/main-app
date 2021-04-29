import React from "react"
import { View, ActivityIndicator } from "react-native"
import { myColors } from "../constants"

function Loading() {
  return (
    <View style={{backgroundColor: myColors.background, flex: 1, justifyContent: 'center', alignItems: 'center'}} >
      <ActivityIndicator color={myColors.loading} size='large' /> 
    </View>
  )
}

export default Loading