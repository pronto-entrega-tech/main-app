import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { CartBar } from '~/core/BottomTabs';
import ProdList from '~/components/ProdList';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { myColors, device, globalStyles } from '~/constants';
import IconButton from '~/components/IconButton';
import MySearchbar from '~/components/MySearchBar';
import { Chip } from 'react-native-paper';
import MyButton from '~/components/MyButton';
import { categoriesArray } from '../Categorias';
import MyText from '~/components/MyText';

function SearchHeader({
  navigation,
  onSubmit,
}: {
  navigation: StackNavigationProp<any, any>;
  onSubmit: (search: string) => void;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: myColors.background,
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: 4,
          paddingRight: 16,
        },
        globalStyles.notch,
      ]}>
      <IconButton
        icon='arrow-left'
        size={24}
        color={myColors.primaryColor}
        type='back'
        onPress={() => navigation.goBack()}
      />
      <MySearchbar style={{ flex: 1 }} onSubmit={onSubmit} />
    </View>
  );
}

function Search({
  navigation,
  route: { params },
}: {
  navigation: StackNavigationProp<any, any>;
  route: any;
}) {
  const [refresh, setRefresh] = React.useState(false);
  const [categories, setCategories] = React.useState(
    params?.categories as number[]
  );
  const [search, setSearch] = React.useState(params?.search);

  return (
    <View
      style={[
        { backgroundColor: myColors.background },
        device.web ? { height: device.height - 54 } : { flex: 1 },
      ]}>
      <SearchHeader
        navigation={navigation}
        onSubmit={(search) => {
          setSearch(search);
          setRefresh(!refresh);
        }}
      />

      <ProdList
        refreshless
        search
        tryAgain={refresh}
        navigation={navigation}
        searchParams={{ categories, search }}
        header={
          <View
            style={{
              width: '100%',
              height: 48,
              elevation: 10,
              zIndex: 10,
              flexDirection: 'row',
            }}>
            <ScrollView
              horizontal
              fadingEdgeLength={10}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.line2}>
              {categories ? (
                categories?.map((item) => (
                  <Chip
                    key={item}
                    onClose={() => {
                      if (categories.length === 1) navigation.goBack();
                      setCategories(categories.filter((v) => v !== item));
                      setRefresh(!refresh);
                    }}
                    style={{
                      marginLeft: 4,
                      backgroundColor: '#ECECEC',
                      alignItems: 'center',
                    }}>
                    {categoriesArray[item - 1]}
                  </Chip>
                ))
              ) : (
                <MyText style={styles.ofertasText}>Resultados</MyText>
              )}
            </ScrollView>
            <View style={styles.filerButton}>
              <MyButton
                onPress={() => navigation.navigate('Filter')}
                type='clear'
                title='Filtros'
                titleStyle={{ color: myColors.grey2 }}
                icon={<Icon name='tune' size={24} color={myColors.grey2} />}
              />
            </View>
          </View>
        }
      />
      <CartBar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  line2: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: myColors.background,
    flex: 1,
    height: 44,
    paddingLeft: 8,
    marginRight: 8,
  },
  ofertasText: {
    color: myColors.primaryColor,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  filerButton: {
    alignItems: 'flex-end',
  },
});

export default Search;
