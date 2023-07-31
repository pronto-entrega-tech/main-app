import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CartBar from '~/components/CartBar';
import ProdList from '~/components/ProdList';
import { myColors, globalStyles, myFonts } from '~/constants';
import IconButton from '~/components/IconButton';
import MySearchBar from '~/components/MySearchBar';
import MyButton from '~/components/MyButton';
import { categoriesArray } from './categorias';
import MyText from '~/components/MyText';
import useRouting from '~/hooks/useRouting';
import Chip from '~/components/Chip';
import { omit, toArray } from '~/functions/converter';
import Loading from '~/components/Loading';
import HeaderContainer from '~/components/HeaderContainer';
import { ItemOrderBy } from '~/core/models';

const Search = () => {
  const { params, isReady, goBack, navigate } = useRouting();
  const query = params?.query as string | undefined;
  const marketId = params?.marketId as string | undefined;
  const orderBy = params?.orderBy as ItemOrderBy | undefined;
  const distance = params?.distance as string | undefined;
  const categories = toArray(params.category) as string[] | undefined;

  const header = (
    <HeaderContainer style={[styles.header, globalStyles.notch]}>
      <IconButton
        icon='arrow-left'
        type='back'
        onPress={() => goBack('Home')}
      />
      <MySearchBar
        defaultValue={query}
        onSubmit={(query) => {
          navigate('Search', { ...params, query });
        }}
        style={{ flex: 1 }}
      />
    </HeaderContainer>
  );

  const filterName = {
    [ItemOrderBy.Default]: '',
    [ItemOrderBy.Rating]: 'Por avaliação',
    [ItemOrderBy.DeliveryTime]: 'Por tempo de entrega',
    [ItemOrderBy.Distance]: 'Por distância',
  }[orderBy ?? ItemOrderBy.Default];

  const removeOrderBy = () => navigate('Search', omit(params, 'orderBy'));

  const removeDistance = () => navigate('Search', omit(params, 'distance'));

  const removeCategory = (category: string) => {
    if (!categories) return;

    navigate('Search', {
      ...params,
      category: categories.filter((v) => v !== category),
    });
  };

  const chipsValues = [
    ...(filterName ? ([[filterName, removeOrderBy]] as const) : []),
    ...(distance ? ([[`Até ${distance}km`, removeDistance]] as const) : []),
    ...(categories?.map(
      (c) => [categoriesArray[+c - 1], () => removeCategory(c)] as const
    ) ?? []),
  ];
  const chipsBar = chipsValues.length ? (
    chipsValues.map(([value, remove]) => (
      <Chip
        key={value}
        title={`${value}`}
        onClose={() => {
          if (chipsValues.length <= 1) return goBack();

          remove();
        }}
        style={{ marginLeft: 4 }}
      />
    ))
  ) : (
    <MyText style={styles.ofertasText}>Resultados</MyText>
  );

  const subHeader = (
    <View style={styles.subHeader}>
      <ScrollView
        horizontal
        fadingEdgeLength={10}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1, height: 44 }}
        contentContainerStyle={styles.line2}>
        {chipsBar}
      </ScrollView>
      <MyButton
        screen='Filter'
        params={{ category: categories }}
        type='clear'
        title='Filtros'
        titleStyle={{ color: myColors.grey2 }}
        icon={{ name: 'tune', color: myColors.grey2 }}
      />
    </View>
  );

  return (
    <View style={[{ backgroundColor: myColors.background, flex: 1 }]}>
      {header}
      {!isReady ? (
        <Loading />
      ) : (
        <ProdList
          refreshLess
          isSearch
          searchParams={{ query, marketId, orderBy, distance, categories }}
          header={subHeader}
        />
      )}
      <CartBar />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: myColors.background,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
    paddingRight: 16,
  },
  subHeader: {
    width: '100%',
    height: 48,
    elevation: 10,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  line2: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    marginRight: 8,
  },
  ofertasText: {
    color: myColors.primaryColor,
    fontSize: 20,
    fontFamily: myFonts.Bold,
    marginLeft: 8,
  },
});

export default Search;

/* export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const search = params?.search?.toString();
  const category = params?.category?.toString();

  const products = city ? await getProdFeed(city, {search, category}) : null;

  return {
    props: { products },
  };
}; */
