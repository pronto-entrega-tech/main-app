import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { WithBottomNav } from '~/components/Layout';
import { myColors, globalStyles, myFonts } from '~/constants';
import MyButton from '~/components/MyButton';
import MyText from '~/components/MyText';
import MyDivider from '~/components/MyDivider';
import MyIcon from '~/components/MyIcon';

export const categoriesArray = [
  'Alimentos básicos',
  'Bebidas',
  'Bebidas alcoólicas',
  'Laticínios',
  'Biscoitos e salgadinho',
  'Doces e sobremesas',
  'Açougue e peixaria',
  'Congelados',
  'Padaria',
  'Queijos e frios',
  'Hortifrúti',
  'Higiene e cosméticos',
  'Limpeza',
];

function Categories() {
  return (
    <>
      <View style={[styles.header, globalStyles.notch]}>
        <MyText style={styles.textHeader}>Categorias</MyText>
        <MyDivider style={styles.headerDivider} />
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.card,
            globalStyles.elevation3,
            globalStyles.darkBorder,
          ]}>
          {categoriesArray.map((category, index) => (
            <View key={index}>
              {index !== 0 && <MyDivider style={styles.divider} />}
              <View style={{ justifyContent: 'center' }}>
                <MyIcon
                  style={{ position: 'absolute', alignSelf: 'flex-end' }}
                  name='chevron-right'
                  size={32}
                  color={myColors.grey2}
                />
                <MyButton
                  title={category}
                  type='clear'
                  buttonStyle={
                    index === 0
                      ? styles.top
                      : index === categoriesArray.length - 1
                      ? styles.bottom
                      : { borderRadius: 0 }
                  }
                  titleStyle={{ color: myColors.grey3, fontSize: 17 }}
                  path='/pesquisa'
                  params={{ categority: index + 1 }}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    height: 48,
  },
  headerDivider: {
    backgroundColor: myColors.divider3,
    marginTop: 47,
    marginHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
  },
  divider: {
    backgroundColor: myColors.divider3,
    marginHorizontal: 8,
  },
  textHeader: {
    color: myColors.primaryColor,
    fontSize: 20,
    fontFamily: myFonts.Bold,
    alignSelf: 'center',
    position: 'absolute',
  },
  top: {
    borderRadius: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  bottom: {
    borderRadius: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
});

export default WithBottomNav(Categories);
