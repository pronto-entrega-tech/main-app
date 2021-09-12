import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { Divider } from 'react-native-elements';
import IconButton from '~/components/IconButton';
import { myColors, device, globalStyles } from '~/constants';
import MercItem, { marketModel } from '~/components/MarketItem';
import { StackNavigationProp } from '@react-navigation/stack';
import { getActiveAddress, getCity } from '~/functions/dataStorage';
import { getMarketFeed } from '~/services/requests';
import Loading, { Errors } from '~/components/Loading';
import { createMercList } from '~/functions/converter';

export function ListMercadosHeader({
  navigation,
  title,
}: {
  navigation: StackNavigationProp<any, any>;
  title: string;
}) {
  return (
    <View style={[styles.header, globalStyles.notch]}>
      <IconButton
        icon='arrow-left'
        size={24}
        color={myColors.primaryColor}
        type='back'
        onPress={() => {
          if (navigation.getState().routeNames[1] === 'ListMercados')
            return navigation.navigate('Home');

          navigation.goBack();
        }}
      />
      <Text style={styles.textHeader}>{title}</Text>
      <Divider
        style={{
          backgroundColor: myColors.divider3,
          height: 1,
          marginHorizontal: 16,
          marginTop: -1,
        }}
      />
    </View>
  );
}

function ListMercados({
  navigation,
}: {
  navigation: StackNavigationProp<any, any>;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<
    'server' | 'connection' | 'nothing' | null
  >(null);
  const [tryAgain, setTryAgain] = useState(false);
  const [city, setCity] = useState('');
  const [mercList, setMercList] = useState<marketModel[]>();
  const [coords, setCoords] =
    useState<{ lat: number | undefined; lon: number | undefined }>();

  useEffect(() => {
    getCity().then(async (city) => {
      setCity(city);
      try {
        const { data } = await getMarketFeed(city);
        if ((data as any[]).length === 0) return setError('nothing');
        setMercList(createMercList(data));
        setIsLoading(false);
      } catch {
        setError('server');
      }
    });
    getActiveAddress().then(({ latitude, longitude }) =>
      setCoords({ lat: latitude, lon: longitude })
    );
  }, []);

  useEffect(() => {
    if (city && mercList && coords) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [city, mercList, coords]);

  if (error)
    return (
      <Errors
        error={error}
        onPress={() => {
          setError(null);
          setTryAgain(!tryAgain);
        }}
      />
    );

  if (isLoading || !coords) return <Loading />;

  return (
    <FlatList
      style={{ backgroundColor: myColors.background }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
      showsVerticalScrollIndicator={false}
      data={mercList}
      keyExtractor={({ market_id: key }) => key.toString()}
      renderItem={({ item: market }: { item: marketModel }) => (
        <MercItem
          coords={coords}
          item={market}
          onPress={() =>
            navigation.navigate(
              'Mercado',
              device.web
                ? { city: market.city, marketId: market.market_id }
                : { market }
            )
          }
        />
      )}
    />
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

export default ListMercados;
