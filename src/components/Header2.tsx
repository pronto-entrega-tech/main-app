import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { myColors, globalStyles } from '../constants'
import IconButton from './IconButton';
import MySearchbar from './MySearchBar';
import { getShortAddress } from '../functions/dataStorage';
import { useFocusEffect } from '@react-navigation/native';
import MyButton from './MyButton';

function Header2({navigation, fallback}: 
  {navigation: StackNavigationProp<any, any>, fallback: string}) {
  const [shortAdress, setShortAdress] = useState<string>('Carregando endereço...');
  
  useFocusEffect(
    React.useCallback(() => {
      getShortAddress().then(shortAdress => {if (shortAdress != null) setShortAdress(shortAdress)})
    }, [])
  );

  return (
    <View style={[{backgroundColor: myColors.background, paddingBottom: 12}, globalStyles.notch]} >
      <IconButton
      icon='arrow-left'
      size={24}
      color={myColors.primaryColor}
      type='back'
      onPress={() => {
        if (navigation.canGoBack()) return navigation.goBack()
        navigation.navigate(fallback)
        }} />
      <View style={styles.icon} >
        <Icon 
          name='map-marker'
          size={30} 
          color={myColors.primaryColor} 
          style={{ marginTop: 5, marginRight: -4 }} />
        <MyButton
          type='clear'
          title={shortAdress}
          titleStyle={{ color: myColors.text5, fontFamily: 'Condensed', fontSize: 17}}
          iconRight
          icon={<Icon name='chevron-right' size={24} color={myColors.text5} />}
          onPress={() => navigation.navigate('Address')} />
      </View>
      <View style={{ marginHorizontal: 16 }} >
        <Divider style={{backgroundColor: myColors.divider2, height: 1, marginBottom: 8, marginTop: -1 }}/>
        <MySearchbar/>
      </View>
    </View>
  )
}



const styles = StyleSheet.create({
  icon: {
    flexDirection: 'row',
    position: 'absolute',
    marginTop: 7,
    marginStart: 52,
  },
})

export default Header2