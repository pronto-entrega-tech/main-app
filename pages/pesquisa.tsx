import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CartBar from '~/components/CartBar';
import ProdList from '~/components/ProdList';
import { myColors, globalStyles, device } from '~/constants';
import IconButton from '~/components/IconButton';
import MySearchbar from '~/components/MySearchBar';
import MyButton from '~/components/MyButton';
import { categoriesArray } from './categorias';
import MyText from '~/components/MyText';
import useRouting from '~/hooks/useRouting';
import Chip from '~/components/Chip';

function Search() {
  const { params, goBack, navigate } = useRouting();
  const categority = params.categority && [params.categority];
  const [refresh, setRefresh] = React.useState(false);
  const [search, setSearch] = React.useState(params?.search);
  const [categories, setCategories] = React.useState<string[] | undefined>(
    params.categories ?? categority
  );

  return (
    <View style={[{ backgroundColor: myColors.background, flex: 1 }]}>
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
          type='back'
          onPress={() => goBack('/inicio')}
        />
        <MySearchbar
          style={{ flex: 1 }}
          search={search}
          onSubmit={(search) => {
            setSearch(search);
            /* if (device.web)
              return navigate('/pesquisa', { categories, search }); */
            setRefresh(!refresh);
          }}
        />
      </View>

      <ProdList
        refreshless
        isSearch
        tryAgain={refresh}
        searchParams={{ categories, search }}
        header={
          <View
            style={{
              width: '100%',
              height: 48,
              elevation: 10,
              zIndex: 10,
              flexDirection: 'row',
              alignItems: 'flex-start',
            }}>
            <ScrollView
              horizontal
              fadingEdgeLength={10}
              showsHorizontalScrollIndicator={false}
              style={{
                flex: 1,
                height: 44,
              }}
              contentContainerStyle={styles.line2}>
              {categories?.length ? (
                categories.map((item) => (
                  <Chip
                    key={item}
                    title={categoriesArray[+item - 1]}
                    onClose={() => {
                      if (categories.length === 1) goBack();
                      setCategories(categories.filter((v) => v !== item));
                      /* if (device.web)
                        return navigate('/pesquisa', { categories, search }); */
                      setRefresh(!refresh);
                    }}
                    style={{
                      marginLeft: 4,
                    }}
                  />
                ))
              ) : (
                <MyText style={styles.ofertasText}>Resultados</MyText>
              )}
            </ScrollView>
            <MyButton
              path='/filtro'
              params={{ categories }}
              type='clear'
              title='Filtros'
              titleStyle={{ color: myColors.grey2 }}
              icon={{ name: 'tune', color: myColors.grey2 }}
            />
          </View>
        }
      />
      <CartBar />
    </View>
  );
}

const styles = StyleSheet.create({
  line2: {
    flexDirection: 'row',
    alignItems: 'center',
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

/* export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const search = params?.categories?.toString();
  const categories = params?.categories?.toString();

  const products = city ? await getProdFeed(city, {search, categories}) : null;

  return {
    props: { products },
  };
}; */
