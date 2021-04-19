import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AdsSlider from '../../components/Slides';
import IconButtonText from '../../components/IconButtonText';
import { myColors, device, globalStyles } from '../../constants'
import { StackNavigationProp } from '@react-navigation/stack';
import ProdList from '../../components/ProdList';
import MySearchbar from '../../components/MySearchBar';
import { getShortAddress } from '../../functions/dataStorage';
import { useFocusEffect } from '@react-navigation/native';

export function HomeHeader({ navigation }:
  {navigation: StackNavigationProp<any, any>}) {
  const [shortAdress, setShortAdress] = useState<string>('Carregando endereço...');

  useFocusEffect(
    React.useCallback(() => {
      getShortAddress().then(shortAdress => {if (shortAdress != null) setShortAdress(shortAdress)})
    }, [])
  );

  return (
    <View style={[{backgroundColor: myColors.background, width: '100%', paddingTop: 4, paddingBottom: 12}, globalStyles.notch]} >
      <Text style={styles.text} >Mostrando ofertas próximas à</Text>
      <View style={styles.icon} >
        <Icon 
          name='map-marker'
          size={30} 
          color={myColors.primaryColor} />
        <Button
          type='clear'
          title={shortAdress}
          titleStyle={{color: myColors.text5, fontFamily: 'Condensed', fontSize: 17}}
          icon={<Icon name='chevron-right' size={24} color={myColors.text5} />}
          iconRight={true}
          onPress={() => {
            navigation.navigate('Address')
            }} />
      </View>
      <View style={{ marginHorizontal: 16 }} >
        <Divider style={{backgroundColor: myColors.divider3, height: 1, marginBottom: 8, marginTop: -1 }}/>
        <MySearchbar onSubmit={() => navigation.navigate('Search')} />
      </View>
    </View>
  )
}

function Home({ navigation }:
  {navigation: StackNavigationProp<any, any>}) {
  return (
    <View style={{backgroundColor: myColors.background, flex: 1}} >
      <ProdList navigation={navigation} header={({ key }: { key: number }) => (
        <View key={key} >
          <AdsSlider/>

          <View style={styles.buttons} >
            <IconButtonText
              icon='basket'
              text='Mercados'
              onPress={() => navigation.navigate('ListMercados')} />
            <IconButtonText
              icon='ticket-percent'
              text='Cupons'
              onPress={() => navigation.navigate('Cupons')} />
            <IconButtonText
              icon='heart'
              text='Favoritos' 
              onPress={() => navigation.navigate('Favoritos')} />
          </View>
        </View>
      )} />
    </View>
  )
};

const top = device.web ? 10 : 0;
const iconTop = device.android ? -12 : -8;
const styles = StyleSheet.create({
  topbar: {
    backgroundColor: '#FEFEFE'
  },
  text: {
    marginTop: top,
    marginStart: 78,
    color: myColors.text2
  },
  icon: {
    flexDirection: 'row',
    marginTop: iconTop,
    marginStart: 40
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    paddingBottom: 6,
  },
  line2: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: myColors.background,
    width: '100%',
    height: 44,
    paddingLeft: 16,
    paddingRight: 8
  },
  ofertasText: {
    color: myColors.primaryColor,
    fontSize: 20,
    fontWeight: 'bold'
  },
  filerButton: {
    alignItems: 'flex-end',
    flex: 1,
  }
})

export default Home