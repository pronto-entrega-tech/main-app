import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Divider } from 'react-native-elements';
import MySearchbar from './MySearchBar';
import { globalStyles, myColors } from '../constants';

export function Header3({title}: {title: string}) {
  return (
    <>
      <View style={[styles.header, globalStyles.notch]}>
        <Text style={styles.textHeader}>{title}</Text>
        <Divider style={styles.headerDivider}/>
      </View>
      <View style={{marginTop: 12, marginBottom: 8, paddingHorizontal: 16}} >
        <MySearchbar/>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: myColors.background,
    justifyContent: 'center',
    height: 48,
  },
  textHeader: {
    color: myColors.primaryColor,
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    position: 'absolute',
  },
  headerDivider: {
    marginTop: 47,
    backgroundColor: myColors.divider2,
    height: 1,
    marginHorizontal: 16,
  },
})

export default Header3