import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import MyTouchable from '~/components/MyTouchable';
import MyButton from '~/components/MyButton';
import { myColors, device, globalStyles } from '~/constants';
import { categoriesArray } from './categorias';
import Header from '~/components/Header';
import useRouting from '~/hooks/useRouting';
import MyIcon, { IconNames } from '~/components/MyIcon';
import Chip from '~/components/Chip';
import AnimatedText from '~/components/AnimatedText';
import MyText from '~/components/MyText';

function FilterButton(props: {
  icon: IconNames;
  text: string;
  onPress: () => void;
  selected: boolean;
}) {
  const { icon, text, onPress, selected } = props;
  return (
    <MyTouchable onPress={onPress} style={styles.filterButton}>
      <View
        style={[
          styles.iconConteiner,
          { backgroundColor: selected ? myColors.primaryColor : '#FFF' },
          selected ? globalStyles.elevation5 : globalStyles.elevation3,
        ]}>
        <MyIcon name={icon} color={selected ? '#FFF' : myColors.grey2} />
      </View>
      <Text
        style={[
          styles.buttonText,
          { color: selected ? myColors.primaryColor : myColors.text2 },
        ]}>
        {text}
      </Text>
    </MyTouchable>
  );
}

function Filter() {
  const routing = useRouting();
  const [filter, setFilter] = useState<number>(0);
  const [distance, setDistance] = useState<number>(14);
  const [categoriasList, setCategoriasList] = useState<string[]>( // primitive values in params are converted to string
    routing.params.categories ?? []
  );
  return (
    <>
      <Header title={'Filtro'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ height: device.height - (device.web ? 56 : 0) }}
        contentContainerStyle={styles.conteiner}>
        <Text style={styles.title}>Ordernar por</Text>
        <FilterButton
          icon='sort-variant'
          text='Padrão'
          onPress={() => setFilter(0)}
          selected={filter === 0}
        />
        <FilterButton
          icon='star'
          text='Avaliação'
          onPress={() => setFilter(1)}
          selected={filter === 1}
        />
        <FilterButton
          icon='clock'
          text='Tempo de entrega'
          onPress={() => setFilter(2)}
          selected={filter === 2}
        />
        <FilterButton
          icon='map-marker'
          text='Distância'
          onPress={() => setFilter(3)}
          selected={filter === 3}
        />
        <View style={styles.distanceConteiner}>
          <Text style={styles.distance}>Distância</Text>
          <View style={{ flexDirection: 'row' }}>
            <MyText style={styles.distance2}>Menos de </MyText>
            <AnimatedText style={styles.distance2} distace={10}>
              {distance + 1}
            </AnimatedText>
            <MyText style={styles.distance2}>km</MyText>
          </View>
        </View>
        <View style={device.web ? { height: 28 } : {}}>
          <Slider
            value={distance}
            onValueChange={(v) => setDistance(v)}
            maximumValue={14}
            step={1}
            style={styles.slider}
            thumbTintColor={device.iOS ? '#FFF' : myColors.colorAccent}
            minimumTrackTintColor={myColors.colorAccent}
          />
        </View>
        <Text style={styles.title}>Categorias</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 8 }}>
          {categoriesArray.map((category, index) => {
            const categoryId = index + 1;
            const isSelected = categoriasList.includes(categoryId.toString());
            return (
              <Chip
                key={categoryId}
                title={category}
                titleStyle={{ color: isSelected ? '#FFF' : '#191919' }}
                style={{
                  margin: 4,
                  backgroundColor: isSelected
                    ? myColors.colorAccent
                    : '#ECECEC',
                }}
                onPress={() => {
                  if (isSelected) {
                    setCategoriasList((c) =>
                      c.filter((i) => i !== categoryId.toString())
                    );
                  } else {
                    setCategoriasList((c) => [...c, categoryId.toString()]);
                  }
                }}
              />
            );
          })}
        </View>
      </ScrollView>
      <MyButton
        title='Ver resultados'
        type='outline'
        buttonStyle={styles.button}
        onPress={() => {
          routing.pop(2);
          routing.push(
            { screen: 'Search', path: '/pesquisa' },
            { categories: categoriasList }
          );
        }}
      />
    </>
  );
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
    alignItems: 'center',
  },
  iconConteiner: {
    padding: 8,
    borderRadius: 24,
  },
  buttonText: {
    marginLeft: 12,
    fontSize: 17,
    fontFamily: 'Regular',
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
});

export default Filter;
