import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { weekDayArray } from '~/core/models';
import Loading, { Errors, myErrors } from '~/components/Loading';
import { Market } from '~/components/MarketItem';
import MyText from '~/components/MyText';
import { images, myColors, myFonts } from '~/constants';
import { documentMask } from '~/functions/converter';
import { getMarket } from '~/services/requests';
import { WithBottomNav } from '~/components/Layout';
import MyDivider from '~/components/MyDivider';
import Header from '~/components/Header';
import useRouting from '~/hooks/useRouting';
import { GetStaticPaths, GetStaticProps } from 'next';
import Chip from '~/components/Chip';

function MarketDetails(props: { market?: Market }) {
  const { params } = useRouting();
  const [error, setError] = useState<myErrors>(null);
  const [tryAgain, setTryAgain] = useState(false);
  const [market, setMarket] = useState(props.market);

  useEffect(() => {
    if (market) return;
    (async () => {
      try {
        const resMarket = await getMarket(params.city, params.marketId);
        if (!resMarket) setError('nothing_market');

        setMarket(resMarket);
      } catch {
        setError('server');
      }
    })();
  }, [market, params.city, params.marketId]);

  const _Header = <Header title={'Informações'} />;

  if (error)
    return (
      <>
        {_Header}
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

  function weekdayName(day: string) {
    switch (day) {
      case 'SUN':
        return 'Domingo';
      case 'MON':
        return 'Segunda';
      case 'TUE':
        return 'Terça';
      case 'WED':
        return 'Quarta';
      case 'THU':
        return 'Quinta';
      case 'FRI':
        return 'Sexta';
      case 'SAT':
        return 'Sábado';
      default:
        return '';
    }
  }

  function getHour(open: number, close: number) {
    const openHour = open.toString().padStart(2, '0');
    const closeHour = open.toString().padStart(2, '0');
    return `${openHour}:00 às ${closeHour}:00`;
  }

  const payDelivery = [
    { icon: images.cash, title: 'Dinheiro' },
    { icon: images.pix, title: 'Pix' },
    { icon: images.mastercard, title: 'Mastercard' },
    { icon: images.mastercard, title: 'Mastercard Débito' },
    { icon: images.visa, title: 'Visa' },
    { icon: images.visa, title: 'Visa Débito' },
    { icon: images.elo, title: 'Elo' },
    { icon: images.elo, title: 'Elo Débito' },
  ];

  const CLOSE = 'Fechado';
  const time = [
    { day: 'Domingo', hour: CLOSE },
    { day: 'Segunda', hour: CLOSE },
    { day: 'Terça', hour: CLOSE },
    { day: 'Quarta', hour: CLOSE },
    { day: 'Quinta', hour: CLOSE },
    { day: 'Sexta', hour: CLOSE },
    { day: 'Sábado', hour: CLOSE },
  ];
  market.business_hours.forEach(({ days, hours }) => {
    days.forEach((v) => {
      const a = [] as string[];
      hours.forEach(({ open_time, close_time }) => {
        a.push(`${open_time} às ${close_time}`);
      });
      time[weekDayArray.indexOf(v)] = {
        day: weekdayName(v),
        hour: a.join(' - '),
      };
    });
  });
  const { street, number, district, city, state } = market.address;
  const document = documentMask(market.document);
  const otherInfo = `${street}, ${number}\n${district}\n${city}, ${state}\n\nCNPJ ${document}`;

  return (
    <>
      {_Header}
      <ScrollView
        showsVerticalScrollIndicator={false}
        /* style={{ height: device.height - (device.web ? 56 : 0) }} */
        contentContainerStyle={{
          backgroundColor: myColors.background,
          paddingBottom: 64,
          paddingTop: 8,
        }}>
        {market.info && <MyText style={styles.text}>{market.info}</MyText>}
        <MyText style={styles.title}>Horário de entrega</MyText>
        {time.map((item) => (
          <View
            key={item.day}
            style={{ marginHorizontal: 16, marginBottom: 10 }}>
            <MyText style={styles.time}>{item.day}</MyText>
            <MyText
              style={[styles.time, { position: 'absolute', marginLeft: 80 }]}>
              {item.hour}
            </MyText>
          </View>
        ))}
        <MyDivider />
        <MyText style={styles.title}>Pagamento na entrega</MyText>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingHorizontal: 8,
            paddingBottom: 12,
          }}>
          {payDelivery.map((item, index) => {
            return (
              <Chip
                key={index}
                title={item.title}
                icon={
                  <Image {...item.icon} style={{ height: 24, width: 24 }} />
                }
                style={{
                  margin: 4,
                  padding: 6,
                }}
              />
            );
          })}
        </View>
        <MyDivider />
        <MyText style={styles.info}>{otherInfo}</MyText>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: myColors.text4,
    marginHorizontal: 16,
  },
  title: {
    marginLeft: 16,
    marginVertical: 12,
    fontSize: 19,
    color: myColors.text4_5,
    fontFamily: myFonts.Medium,
  },
  time: {
    fontSize: 16,
    color: myColors.text4,
  },
  info: {
    fontSize: 16,
    color: myColors.text4,
    marginTop: 16,
    marginHorizontal: 16,
  },
});

export default WithBottomNav(MarketDetails);

export { getStaticPaths } from './index';

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const city = params?.city?.toString();
  const marketId = params?.marketId?.toString();

  const props =
    city && marketId
      ? {
          market: await getMarket(city, marketId),
        }
      : {};

  return {
    revalidate: 60,
    props,
  };
};
