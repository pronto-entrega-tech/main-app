import React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MyTouchable from '../../components/MyTouchable';
import MyButton from '../../components/MyButton';
import { myColors, device, globalStyles } from '../../constants';
import { categorias } from '../Categorias';
import { Chip } from 'react-native-paper';

function FilterButton({icon, text, onPress, selected}:
   {icon: string, text: string, onPress: (i: number) => void, selected: boolean}) {
  return (
    <MyTouchable onPress={onPress} style={styles.filterButton} >
      <View style={[styles.iconConteiner, {backgroundColor: selected? myColors.primaryColor : '#FFF'}, selected? globalStyles.elevation5 : globalStyles.elevation3]} >
        <Icon name={icon} size={24} color={selected? '#FFF' : myColors.grey2} />
      </View>
      <Text style={[styles.buttonText, {color: selected? myColors.primaryColor : myColors.text2}]} >{text}</Text>
    </MyTouchable>
  )
}

function Filter({ navigation }:
  {navigation: StackNavigationProp<any, any>}) {
  const [filter, setFilter] = useState<number>(0);
  const [distance, setDistance] = useState<number>(14);
  const [categoriasList, setCategoriasList] = useState<string[]>([]);
  return(
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{height: device.height-(device.web? 56 : 0)}}
        contentContainerStyle={styles.conteiner} >
        <Text style={styles.title} >Ordernar por</Text>
        <FilterButton icon='sort-variant' text='Padrão' onPress={() => setFilter(0)} selected={filter===0} />
        <FilterButton icon='star' text='Avaliação' onPress={() => setFilter(1)} selected={filter===1} />
        <FilterButton icon='clock' text='Tempo de entrega' onPress={() => setFilter(2)} selected={filter===2} />
        <FilterButton icon='map-marker' text='Distância' onPress={() => setFilter(3)} selected={filter===3} />
        <View style={styles.distanceConteiner} >
          <Text style={styles.distance} >Distância</Text>
          <Text style={styles.distance2} >Menos de {distance+1}km</Text>
        </View>
        <View style={device.web? {height: 28} : {}} >
          <Slider
            value={distance}
            onValueChange={(v) => setDistance(v)}
            maximumValue={14}
            step={1}
            style={styles.slider}
            thumbTintColor={device.iOS? '#FFF' : myColors.colorAccent}
            minimumTrackTintColor={myColors.colorAccent} />
        </View>
        <Text style={styles.title} >Categorias</Text>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', padding: 8}}>
          {
            categorias.map((item) => {
              const isSelected = categoriasList.includes(item);
              return (
              <Chip
                key={item}
                onPress={() => {
                    if (isSelected) {
                      setCategoriasList(c => c.filter(i => i != item))
                    } else {
                      setCategoriasList(c => [...c, item])
                    }
                  }}
                icon={{}}
                selectedColor={isSelected? '#FFF' : '#191919'}
                style={{margin: 4, backgroundColor: isSelected? myColors.colorAccent : '#ECECEC'}} >{item}</Chip>
            )})
          }
        </View>
      </ScrollView>
      <MyButton
        title='Ver resultados'
        type='outline'
        buttonStyle={styles.button}
        onPress={()=> {
          navigation.pop(1)
          navigation.navigate('Search')
          }} />
    </>
  )
}

const styles = StyleSheet.create({
  conteiner: {
    backgroundColor: myColors.background,
    paddingBottom: 56,
  },
  title: {
    color: myColors.text3,
    fontSize: 15,
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 4,
  },
  filterButton: {
    paddingLeft: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconConteiner: {
    padding: 8,
    borderRadius: 24
  },
  buttonText: {
    marginLeft: 12,
    fontSize: 17,
    fontFamily: 'Regular'
  },
  distanceConteiner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
  },
  distance: {
    color: myColors.text3,
    fontSize: 15,
  },
  distance2: {
    color: myColors.text2,
  },
  slider: {
    marginTop: 8,
    marginHorizontal: 16,
  },
  button: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: device.iPhoneNotch ? 38 : 12,
    borderWidth: 2,
    width: 210,
    height: 46,
    backgroundColor: '#fff',
  },
})

export default Filter