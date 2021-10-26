import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import IconButton from '~/components/IconButton';
import { myColors, globalStyles } from '~/constants';
import MercItem, { Market } from '~/components/MarketItem';
import { getActiveAddress } from '~/core/dataStorage';
import { getMarketFeed } from '~/services/requests';
import Loading, { Errors, myErrors } from '~/components/Loading';
import { toCityState } from '~/functions/converter';
import MyDivider from '~/components/MyDivider';
import { WithBottomNav } from '~/components/Layout';
import useRouting from '~/hooks/useRouting';

export function ListMercadosHeader({ title }: { title: string }) {
  const routing = useRouting();
  return (
    <View style={[styles.header, globalStyles.notch]}>
      <IconButton
        icon='arrow-left'
        type='back'
        onPress={() => {
          if (
            routing.pathname.includes('lista-mercados') ||
            !routing.canGoBack()
          )
            return routing.navigate('/inicio');

          routing.goBack();
        }}
      />
      <Text style={styles.textHeader}>{title}</Text>
      <MyDivider
        style={{
          backgroundColor: myColors.divider3,
          marginHorizontal: 16,
          marginTop: -1,
        }}
      />
    </View>
  );
}

function ListMarket() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<myErrors>(null);
  const [tryAgain, setTryAgain] = useState(false);
  const [city, setCity] = useState('');
  const [marketList, setMarketList] = useState<Market[]>();
  const [coords, setCoords] = useState<{ lat?: number; lon?: number }>({});

  useEffect(() => {
    getActiveAddress().then(async (address) => {
      try {
        if (!address) return setError('nothing_market');
        const city = toCityState(address);
        setCity(city);
        setCoords({ lat: address.latitude, lon: address.longitude });

        const marketFeed = await getMarketFeed(city);
        if (!marketFeed.length) return setError('nothing_feed');
        setMarketList(marketFeed);
      } catch {
        setError('server');
      }
    });
  }, []);

  useEffect(() => {
    setIsLoading(!(city && marketList && coords));
  }, [city, marketList, coords]);

  if (error)
    return (
      <>
        <ListMercadosHeader title='Mercados' />
        <Errors
          error={error}
          onPress={() => {
            setError(null);
            setTryAgain(!tryAgain);
          }}
        />
      </>
    );

  if (isLoading) return <Loading />;

  const _renderItem = ({ item: market }: { item: Market }) => (
    <MercItem coords={coords} market={market} />
  );

  return (
    <>
      <ListMercadosHeader title='Mercados' />
      <FlatList
        style={{ backgroundColor: myColors.background }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        data={marketList}
        keyExtractor={({ market_id }) => market_id}
        renderItem={_renderItem}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: myColors.background,
    justifyContent: 'center',
  },
  textHeader: {
    color: myColors.primaryColor,
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    position: 'absolute',
  },
});

export default WithBottomNav(ListMarket);
