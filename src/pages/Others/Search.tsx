import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CartBar } from '../../core/BottomTabs';
import ProdList from '../../components/ProdList';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { myColors, device, globalStyles } from '../../constants';
import IconButton from '../../components/IconButton';
import MySearchbar from '../../components/MySearchBar';
import { Chip } from 'react-native-paper';
import MyButton from '../../components/MyButton';

function SearchHeader({navigation}: 
{navigation: StackNavigationProp<any, any>}) {
  return (
    <View style={[{backgroundColor: myColors.background, flexDirection: 'row', alignItems: 'center', paddingTop: 4, paddingRight: 16}, globalStyles.notch]} >
      <IconButton
      icon='arrow-left'
      size={24}
      color={myColors.primaryColor}
      type='back'
      onPress={() => navigation.goBack()} />
      <MySearchbar onSubmit={() => null} />
    </View>
  )
}

function Search({ navigation, route }:
{navigation: StackNavigationProp<any, any>, route: any}) {
  return (
    <View style={[{backgroundColor: myColors.background}, device.web ? {height: device.height-54} : {flex: 1}]}>
      <SearchHeader navigation={navigation} />
      <ProdList refreshless navigation={navigation} header={({ key }: { key: number }) => (
        <View key={key} style={{width: '100%', height: 48, elevation: 10, zIndex: 10}} >
          <View style={ styles.line2 } >
            <Chip
              key={route.params.categoria}
              onClose={() => navigation.goBack()}
              style={{marginLeft: 4, backgroundColor: '#ECECEC', alignItems: 'center'}} >{route.params.categoria}</Chip>
            <View style={ styles.filerButton } >
              <MyButton 
                onPress={() => navigation.navigate('Filter')}
                type='clear'
                title='Filtros'
                titleStyle={{ color: myColors.grey2 }}
                icon={<Icon name='tune' size={24} color={myColors.grey2} />} 
              />
            </View>
          </View>
        </View>
      )} />
      <CartBar navigation={navigation} />
    </View>
  )
}

const styles = StyleSheet.create({
  line2: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: myColors.background,
    width: '100%',
    height: 44,
    paddingLeft: 8,
    paddingRight: 8
  },
  filerButton: {
    alignItems: 'flex-end',
    flex: 1,
  }
})

export default Search