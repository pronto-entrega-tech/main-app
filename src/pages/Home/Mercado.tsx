import React, { useState, useEffect } from 'react';
import { Share, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Divider, Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { device, globalStyles, myColors } from '~/constants';
import { marketModel } from '~/components/MarketItem';
import MyTouchable from '~/components/MyTouchable';
import ProdList, { ListHeader } from '~/components/ProdList';
import requests, { getMarket } from '~/services/requests';
import { getActiveAddress } from '~/functions/dataStorage';
import Loading, { Errors, myErrors } from '~/components/Loading';
import { useProdContext2 } from '~/functions/ProdContext';
import {
  computeDistance,
  createMercItem,
  getImageUrl,
  isMarketOpen,
} from '~/functions/converter';
import MyButton from '~/components/MyButton';
import MyText from '~/components/MyText';
import Rating from '~/components/Rating';
import IconButton from '~/components/IconButton';
import MySearchbar from '~/components/MySearchBar';

function MercadoHeader({
  navigation,
  city,
  nameId,
}: {
  navigation: StackNavigationProp<any, any>;
  city: string;
  nameId: string;
}) {
  return (
    <View
      style={[
        { backgroundColor: myColors.background, paddingBottom: 12 },
        globalStyles.notch,
      ]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <IconButton
          icon='arrow-left'
          size={24}
          color={myColors.primaryColor}
          type='back'
          onPress={() => {
            if (navigation.canGoBack()) return navigation.goBack();
            navigation.navigate('ListMercados');
          }}
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
          size={24}
          color={myColors.primaryColor}
          type='prodIcons'
          onPress={() => {
            Share.share({ message: `${requests}mercado/${city}/${nameId}` });
          }}
        />
      </View>
      <View style={{ marginHorizontal: 16 }}>
        <Divider
          style={{
            backgroundColor: myColors.divider2,
            height: 1,
            marginBottom: 8,
            marginTop: -1,
          }}
        />
        <MySearchbar
          onSubmit={(search) => navigation.navigate('Search', { search })}
        />
      </View>
    </View>
  );
}

function Mercado({
  navigation,
  route: { params, name: routeName },
}: {
  navigation: StackNavigationProp<any, any>;
  route: any;
}) {
  const prodContext = useProdContext2();
  const [error, setError] = useState<myErrors>(null);
  const [tryAgain, setTryAgain] = useState(false);
  const [market, setMercItem] = useState<marketModel>(params?.market);
  const [coords, setCoords] =
    useState<{ lat: number | undefined; lon: number | undefined }>();

  useEffect(() => {
    (async () => {
      try {
        const address = await getActiveAddress();
        setCoords({ lat: address.latitude, lon: address.longitude });

        if (market) return;

        const city = params?.city || prodContext?.city;
        const marketId = params?.marketId || prodContext?.marketId;

        const { data } = await getMarket(city, marketId);

        if (!data) return setError('nothing_market');
        setMercItem(createMercItem(data));
      } catch {
        setError('server');
      }
    })();
  }, [tryAgain]);

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

  if (!market || !coords) return <Loading />;

  const distance =
    coords.lat && coords.lon
      ? computeDistance(
          [coords.lat, coords.lon],
          market.address.coords.split(',')
        )
      : undefined;
  const { isOpen, nextHour, tomorrow } = isMarketOpen(market.business_hours);

  let data: { icon: string; text: string }[] = [
    {
      icon: 'clock',
      text: `${isOpen ? 'Fecha' : 'Abre'} ás ${nextHour}${
        tomorrow ? ' de amanhã' : ''
      }`,
    },
    { icon: 'map-marker', text: `Á ${distance}km de você` },
    {
      icon: 'truck-fast',
      text: `${market.min_time}-${
        market.max_time
      }min • R$${market.fee.toString()}`,
    },
    {
      icon: 'currency-usd-circle',
      text: `Mínimo R$${market.order_min.toString()}`,
    },
  ];

  if (!distance) {
    data = data.filter((item) => item.icon !== 'map-marker');
  }

  return (
    <>
      {routeName !== 'Mercado' ? null : (
        <MercadoHeader
          navigation={navigation}
          city={market.city}
          nameId={market.market_id}
        />
      )}
      <ProdList
        navigation={navigation}
        marketless
        style={{ backgroundColor: myColors.background, paddingBottom: 74 }}
        header={({ key }: { key: number }) => (
          <>
            <View
              key={key}
              style={{
                flexDirection: 'row',
                paddingLeft: 16,
                paddingBottom: 2,
                marginTop: prodContext ? 12 : 0,
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
                      fontFamily: 'Medium',
                      padding: 6,
                      marginTop: -2,
                      width: 128,
                      textAlign: 'center',
                    }}>
                    Novo!
                  </MyText>
                )}
                <MyTouchable
                  onPress={() =>
                    navigation.navigate('MercRating', {
                      city: market.city,
                      marketId: market.market_id,
                    })
                  }
                  style={{
                    marginTop: -36,
                    borderRadius: 4,
                    width: 132,
                    height: 36,
                    marginLeft: -2,
                  }}></MyTouchable>
              </View>
              <View>
                <View style={{ flexDirection: 'row', marginLeft: 6 }}>
                  <MyButton
                    buttonStyle={{ paddingVertical: 3 }}
                    type='clear'
                    title={market.name}
                    titleStyle={{ color: myColors.text3, fontSize: 22 }}
                    iconRight
                    icon={
                      <Icon
                        name='chevron-right'
                        size={28}
                        color={myColors.text3}
                        style={{ marginLeft: -2, marginTop: 3 }}
                      />
                    }
                    onPress={() =>
                      navigation.navigate(
                        'MercInfo',
                        device.web
                          ? { city: market.city, marketId: market.market_id }
                          : { market }
                      )
                    }
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
                    <Icon
                      name={item.icon}
                      size={20}
                      color={myColors.primaryColor}
                    />
                    <MyText style={{ marginLeft: 4, color: myColors.text2 }}>
                      {item.text}
                    </MyText>
                  </View>
                ))}
              </View>
            </View>
            <ListHeader navigation={navigation} />
          </>
        )}
      />
    </>
  );
}

export default Mercado;
