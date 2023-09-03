import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CartBar from '~/components/CartBar';
import ProdList from '~/components/ProdList';
import { myColors, globalStyles, myFonts } from '~/constants';
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
import { arrayConditional } from '~/functions/conditionals';
import { GoBackButton } from '~/components/MyHeader';

type SearchParams = {
  query?: string;
  marketId?: string;
  orderBy?: ItemOrderBy;
  distance?: string;
  category?: string;
};

const Search = () => {
  const { params, isReady, goBack, navigate } = useRouting();
  const { query, marketId, orderBy, distance, category } =
    params as SearchParams;
  const categories = toArray(category);

  const header = (
    <HeaderContainer style={[styles.header, globalStyles.notch]}>
      <GoBackButton onGoBack={() => goBack('Home')} />
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

  const chipsValues = [
    ...arrayConditional(filterName)({
      title: filterName,
      remove: () => navigate('Search', omit(params, 'orderBy')),
    }),
    ...arrayConditional(distance)({
      title: `Até ${distance}km`,
      remove: () => navigate('Search', omit(params, 'distance')),
    }),
    ...(categories?.map((c) => ({
      title: categoriesArray[+c - 1],
      remove: () => {
        if (!c) return;

        navigate('Search', {
          ...params,
          category: categories.filter((v) => v !== c),
        });
      },
    })) ?? []),
  ];
  const chipsBar = chipsValues.length ? (
    chipsValues.map(({ title, remove }) => (
      <Chip
        key={title}
        title={title}
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
