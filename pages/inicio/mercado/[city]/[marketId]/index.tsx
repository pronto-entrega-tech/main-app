import React, { useState, useEffect } from 'react';
import { Share, View } from 'react-native';
import { Image } from 'react-native-elements/dist/image/Image';
import { device, globalStyles, myColors, myFonts } from '~/constants';
import { Market } from '~/components/MarketItem';
import MyTouchable from '~/components/MyTouchable';
import ProdList from '~/components/ProdList';
import { getMarket, getProdFeedByMarket } from '~/services/requests';
import { getActiveAddress } from '~/core/dataStorage';
import Loading, { Errors, myErrors } from '~/components/Loading';
import {
  computeDistance,
  getImageUrl,
  isMarketOpen,
  moneyToString,
} from '~/functions/converter';
import MyButton from '~/components/MyButton';
import MyText from '~/components/MyText';
import MyIcon, { IconNames } from '~/components/MyIcon';
import Rating from '~/components/Rating';
import IconButton from '~/components/IconButton';
import MySearchbar from '~/components/MySearchBar';
import { WithBottomNav } from '~/components/Layout';
import MyDivider from '~/components/MyDivider';
import { WWW } from '~/constants/url';
import useRouting from '~/hooks/useRouting';
import { Product } from '~/components/ProdItem';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ListHeader } from '@pages/inicio';
import { RouteProp } from '@react-navigation/core';

function MarketHeader() {
  const routing = useRouting();
  return (
    <View
      style={[
        { backgroundColor: myColors.background, paddingBottom: 12 },
        globalStyles.notch,
      ]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <IconButton
          icon='arrow-left'
          type='back'
          onPress={() => routing.goBack('/lista-mercado')}
        />
        <MyText
          style={{
            color: myColors.primaryColor,
            fontSize: 20,
            fontWeight: 'bold',
            alignSelf: 'center',
          }}>
          Mercado
        </MyText>
        <IconButton
          icon='share-variant'
          type='prodIcons'
          onPress={() => {
            if (!device.web) {
              Share.share({
                message: WWW + routing.pathname,
              });
            } else {
              navigator.share({
                url: WWW + routing.pathname,
              });
            }
          }}
        />
      </View>
      <View style={{ marginHorizontal: 16 }}>
        <MyDivider
          style={{
            backgroundColor: myColors.divider2,
            marginBottom: 8,
            marginTop: -1,
          }}
        />
        <MySearchbar
          onSubmit={(search) => routing.navigate('/pesquisa', { search })}
        />
      </View>
    </View>
  );
}

function MarketFeed(props: {
  market?: Market;
  products?: Product[];
  route?: RouteProp<any>;
}) {
  const { params, pathname: pathnameFromRouting } = useRouting();
  const pathname = props.route?.params?.path || pathnameFromRouting; // `||` to filter empty string
  const [error, setError] = useState<myErrors>(null);
  const [tryAgain, setTryAgain] = useState(false);
  const [market, setMarket] = useState(props.market);
  const [products, setProducts] = useState(props.products);
  const [coords, setCoords] = useState<{ lat?: number; lon?: number }>({});

  useEffect(() => {
    getActiveAddress().then((address) => {
      if (address) setCoords({ lat: address.latitude, lon: address.longitude });
    });

    if (market && products) return;
    (async () => {
      try {
        const promises = [
          getMarket(params.city, params.marketId),
          getProdFeedByMarket(params.city, params.marketId),
        ] as const;

        const [market, products] = await Promise.all(promises);
        if (!market || !products) return setError('nothing_market');

        setMarket(market);
        setProducts(products);
      } catch {
        setError('server');
      }
    })();
  }, [tryAgain, market, products, params.city, params.marketId]);

  const isProductPath = pathname.startsWith('/produto');
  const Header = !isProductPath && <MarketHeader />;

  if (error)
    return (
      <>
        {Header}
        <Errors
          error={error}
          onPress={() => {
            setError(null);
            setTryAgain(!tryAgain);
          }}
        />
      </>
    );

  if (!market) return <Loading />;

  const distance =
    coords.lat && coords.lon
      ? computeDistance(
          [coords.lat, coords.lon],
          market.address.coords.split(',')
        )
      : undefined;
  const { isOpen, nextHour, tomorrow } = isMarketOpen(market.business_hours);

  let data: { icon: IconNames; text: string }[] = [
    {
      icon: 'clock',
      text: `${isOpen ? 'Fecha' : 'Abre'} ás ${nextHour}${
        tomorrow && ' de amanhã'
      }`,
    },
    { icon: 'map-marker', text: `Á ${distance}km de você` },
    {
      icon: 'truck-fast',
      text: `${market.min_time}-${market.max_time}min • ${moneyToString(
        market.fee,
        'R$'
      )}`,
    },
    {
      icon: 'currency-usd-circle',
      text: `Mínimo ${moneyToString(market.order_min, 'R$')}`,
    },
  ];

  if (!distance) {
    data = data.filter((item) => item.icon !== 'map-marker');
  }

  const MarketListHeader = (
    <>
      <View
        style={{
          flexDirection: 'row',
          paddingLeft: 16,
          paddingBottom: 2,
          marginTop: isProductPath ? 12 : 0,
        }}>
        <View style={{ paddingTop: 2 }}>
          <Image
            containerStyle={{ borderRadius: 8, height: 128, width: 128 }}
            source={{
              uri: getImageUrl('market', market.market_id),
            }}
          />
          {market.rating ? (
            <View
              style={{
                height: 34,
                padding: 6,
                marginTop: -2,
                marginLeft: -2,
              }}>
              <Rating value={market.rating} size={'medium'} />
            </View>
          ) : (
            <MyText
              style={{
                height: 34,
                color: myColors.rating,
                fontSize: 16,
                fontFamily: myFonts.Medium,
                padding: 6,
                marginTop: -2,
                width: 128,
                textAlign: 'center',
              }}>
              Novo!
            </MyText>
          )}
          <MyTouchable
            path={`/inicio/mercado/${market.city}/${market.market_id}/avaliacao`}
            params={!device.web ? { market } : {}}
            style={{
              marginTop: -36,
              borderRadius: 4,
              width: 132,
              height: 36,
              marginLeft: -2,
            }}
          />
        </View>
        <View>
          <View style={{ flexDirection: 'row', marginLeft: 6 }}>
            <MyButton
              buttonStyle={{ paddingVertical: 3 }}
              type='clear'
              title={market.name}
              titleStyle={{
                color: myColors.text3,
                fontSize: 22,
                fontFamily: myFonts.Medium,
              }}
              iconRight
              icon={{
                name: 'chevron-right',
                size: 28,
                color: myColors.text3,
                style: { marginLeft: -2, marginTop: 3 },
              }}
              path={`/inicio/mercado/${market.city}/${market.market_id}/detalhes`}
              params={!device.web ? { market } : {}}
            />
          </View>
          {data.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                marginBottom: 4,
                marginLeft: 12,
                alignItems: 'center',
              }}>
              <MyIcon name={item.icon} size={20} />
              <MyText
                style={{
                  marginLeft: 4,
                  color: myColors.text2,
                }}>
                {item.text}
              </MyText>
            </View>
          ))}
        </View>
      </View>
      <ListHeader />
    </>
  );

  return (
    <>
      {Header}
      <ProdList
        data={products}
        hideMarketLogo
        style={{ backgroundColor: myColors.background, paddingBottom: 74 }}
        header={MarketListHeader}
      />
    </>
  );
}

export default WithBottomNav(MarketFeed);

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { city: 'jatai-go', marketId: '1' } }],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const city = params?.city?.toString();
  const marketId = params?.marketId?.toString();

  const props =
    city && marketId
      ? {
          market: await getMarket(city, marketId),
          products: await getProdFeedByMarket(city, marketId),
        }
      : {};

  return {
    revalidate: 60,
    props,
  };
};
