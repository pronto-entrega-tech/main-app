import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { myColors } from '~/constants';
import MarketItem from '~/components/MarketItem';
import { Coords, Market } from '~/core/models';
import Loading from '~/components/Loading';
import Errors, { MyErrors } from '~/components/Errors';
import { getLatLong, toCityState } from '~/functions/converter';
import { WithBottomNav } from '~/components/Layout';
import MyHeader from '~/components/MyHeader';
import { useAddressContext } from '~/contexts/AddressContext';
import { api } from '~/services/api';

const MarketList = () => (
  <>
    <MyHeader title='Mercados' smallDivider />
    <MarketListBody />
  </>
);

const MarketListBody = () => {
  const { address } = useAddressContext();
  const [error, setError] = useState<MyErrors>(null);
  const [tryAgain, setTryAgain] = useState(false);
  const [data, setData] = useState<{ markets: Market[]; coords?: Coords }>();

  useEffect(() => {
    (async () => {
      setError(null);

      if (address === null) return setError('missing_address');
      if (!address) return;

      const city = toCityState(address);
      const markets = await api.markets.findMany(city, {
        latLong: getLatLong(address),
      });

      if (!markets.length) return setError('nothing_feed');

      setData({
        markets,
        coords: address.coords,
      });
    })().catch(() => setError('server'));
  }, [tryAgain, address]);

  if (!data && error)
    return <Errors error={error} onPress={() => setTryAgain(!tryAgain)} />;

  if (!data) return <Loading />;

  const _MarketItem = ({ item: market }: { item: Market }) => (
    <MarketItem coords={data.coords} market={market} />
  );

  return (
    <FlatList
      style={{ backgroundColor: myColors.background }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
      showsVerticalScrollIndicator={false}
      data={data.markets}
      keyExtractor={(v) => v.market_id}
      renderItem={_MarketItem}
    />
  );
};

export default WithBottomNav(MarketList);
