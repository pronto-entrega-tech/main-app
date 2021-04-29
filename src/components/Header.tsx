import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Divider } from 'react-native-elements';
import { myColors, globalStyles } from '../constants';
import IconButton from './IconButton';

function Header({navigation, title, divider = true, goBack = true, notchless = false}:
  {navigation: StackNavigationProp<any, any>, title: string, divider?: boolean, goBack?: boolean, notchless?: boolean}) {
  return(
    <View style={[styles.header, notchless? {} : globalStyles.notch]}>
      {goBack? <IconButton
      icon='arrow-left'
      size={24}
      color={myColors.primaryColor}
      type='back'
      onPress={() => {
        if (navigation.canGoBack()) return navigation.goBack()
        navigation.navigate('BottomTabs', {screen: 'Home'})
        }}
      />: null}
      <Text style={styles.textHeader}>{title}</Text>
      {divider ? <Divider style={styles.divider} /> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    minHeight: 56,
    backgroundColor: myColors.background
  },
  textHeader: {
    color: myColors.primaryColor,
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    position: 'absolute',
  },
  divider: {
    backgroundColor: myColors.divider2,
    height: 1,
    position: 'absolute',
    bottom: 0,
    width: '100%'
  },
})

export default Header