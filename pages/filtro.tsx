import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import MyTouchable from '~/components/MyTouchable';
import MyButton from '~/components/MyButton';
import { myColors, device, globalStyles, myFonts } from '~/constants';
import { categoriesArray } from './categorias';
import MyHeader from '~/components/MyHeader';
import useRouting from '~/hooks/useRouting';
import MyIcon, { IconNames } from '~/components/MyIcon';
import Chip from '~/components/Chip';
import AnimatedText from '~/components/AnimatedText';
import MyText from '~/components/MyText';
import { toArray } from '~/functions/converter';
import { ItemOrderBy } from '~/core/models';
import { objectConditional } from '~/functions/conditionals';

const FilterButton = (props: {
  icon: IconNames;
  text: string;
  onPress: () => void;
  selected: boolean;
}) => {
  const { icon, text, onPress, selected } = props;
  return (
    <MyTouchable onPress={onPress} style={styles.filterButton}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: selected ? myColors.primaryColor : 'white' },
          selected ? globalStyles.elevation5 : globalStyles.elevation3,
        ]}>
        <MyIcon name={icon} color={selected ? 'white' : myColors.grey2} />
      </View>
      <MyText
        style={[
          styles.buttonText,
          { color: selected ? myColors.primaryColor : myColors.text2 },
        ]}>
        {text}
      </MyText>
    </MyTouchable>
  );
};
const defaultDistance = 15;

const Filter = () => {
  const routing = useRouting();
  const [orderBy, setOrderBy] = useState(ItemOrderBy.Default);
  const [distance, setDistance] = useState(defaultDistance);
  const [categories, setCategories] = useState<string[]>(
    toArray(routing.params.category) ?? []
  );

  const chipsBar = categoriesArray.map((category, index) => {
    const categoryId = index + 1;
    const isSelected = categories.includes(`${categoryId}`);

    return (
      <Chip
        key={categoryId}
        title={category}
        titleStyle={{ color: isSelected ? 'white' : '#191919' }}
        style={{
          margin: 4,
          backgroundColor: isSelected ? myColors.colorAccent : '#ECECEC',
        }}
        onPress={() => {
          if (isSelected) {
            setCategories((c) => c.filter((i) => i !== `${categoryId}`));
          } else {
            setCategories((c) => [...c, `${categoryId}`]);
          }
        }}
      />
    );
  });

  const filterButtonState = (type: ItemOrderBy) => ({
    onPress: () => setOrderBy(type),
    selected: orderBy === type,
  });

  return (
    <>
      <MyHeader title='Filtro' />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ height: device.height - (device.web ? 56 : 0) }}
        contentContainerStyle={styles.container}>
        <MyText style={styles.title}>Ordenar por</MyText>
        <FilterButton
          icon='sort-variant'
          text='Padrão'
          {...filterButtonState(ItemOrderBy.Default)}
        />
        <FilterButton
          icon='star'
          text='Avaliação'
          {...filterButtonState(ItemOrderBy.Rating)}
        />
        <FilterButton
          icon='clock'
          text='Tempo de entrega'
          {...filterButtonState(ItemOrderBy.DeliveryTime)}
        />
        <FilterButton
          icon='map-marker'
          text='Distância'
          {...filterButtonState(ItemOrderBy.Distance)}
        />
        <View style={styles.distanceContainer}>
          <MyText style={styles.distance}>Distância</MyText>
          <View style={{ flexDirection: 'row' }}>
            <MyText style={styles.distance2}>Menos de </MyText>
            <AnimatedText style={styles.distance2} distance={10}>
              {distance}
            </AnimatedText>
            <MyText style={styles.distance2}>km</MyText>
          </View>
        </View>
        <View style={device.web ? { height: 28 } : {}}>
          <Slider
            value={distance}
            onValueChange={setDistance} // called on drag
            onSlidingComplete={setDistance} // called on touch
            minimumValue={1}
            maximumValue={defaultDistance}
            step={1}
            style={styles.slider}
            thumbTintColor={device.iOS ? 'white' : myColors.colorAccent}
            minimumTrackTintColor={myColors.colorAccent}
          />
        </View>
        <MyText style={styles.title}>Categorias</MyText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 8 }}>
          {chipsBar}
        </View>
      </ScrollView>
      <MyButton
        title='Ver resultados'
        type='outline'
        buttonStyle={globalStyles.bottomButton}
        onPress={() => {
          routing.pop(2);
          routing.push('Search', {
            orderBy,
            category: categories,
            ...objectConditional(distance !== defaultDistance)({ distance }),
          });
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
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
  iconContainer: {
    padding: 8,
    borderRadius: 24,
  },
  buttonText: {
    marginLeft: 12,
    fontSize: 17,
    fontFamily: myFonts.Regular,
  },
  distanceContainer: {
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
});

export default Filter;
