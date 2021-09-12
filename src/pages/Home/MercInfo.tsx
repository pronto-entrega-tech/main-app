import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Divider, Image } from 'react-native-elements';
import { Chip } from 'react-native-paper';
import { weekDayArray } from '~/core/models';
import { getCity } from '~/functions/dataStorage';
import Loading from '~/components/Loading';
import { marketModel } from '~/components/MarketItem';
import MyText from '~/components/MyText';
import { device, images, myColors } from '~/constants';
import { createMercItem, documentMask } from '~/functions/converter';
import requests, { getMarket } from '~/services/requests';

function MercInfo({ route: { params } }: { route: any }) {
  const [market, setMarket] = React.useState<marketModel>(params.market);

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
    return `${open.toString().padStart(2, '0')}:00 às ${close
      .toString()
      .padStart(2, '0')}:00`;
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

  React.useEffect(() => {
    (async () => {
      if (!device.web) return;
      try {
        const { data } = await getMarket(params.city, params.marketId);
        setMarket(createMercItem(data));
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  if (!market) return <Loading />;

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
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ height: device.height - (device.web ? 56 : 0) }}
      contentContainerStyle={{
        backgroundColor: myColors.background,
        paddingBottom: 64,
        paddingTop: 8,
      }}>
      {!market.info ? null : <MyText style={styles.text}>{market.info}</MyText>}
      <MyText style={styles.title}>Horário de entrega</MyText>
      {time.map((item) => (
        <View key={item.day} style={{ marginHorizontal: 16, marginBottom: 10 }}>
          <MyText style={styles.time}>{item.day}</MyText>
          <MyText
            style={[styles.time, { position: 'absolute', marginLeft: 80 }]}>
            {item.hour}
          </MyText>
        </View>
      ))}
      <Divider style={styles.divider} />
      <MyText style={styles.title}>Pagamento na entrega</MyText>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          paddingHorizontal: 8,
          paddingBottom: 12,
        }}>
        {payDelivery.map((item, i) => {
          return (
            <Chip
              key={i}
              textStyle={{ fontFamily: 'Regular' }}
              avatar={
                <Image
                  source={item.icon}
                  containerStyle={{ height: 24, width: 24 }}
                />
              }
              style={{ margin: 4, padding: 2 }}>
              {item.title}
            </Chip>
          );
        })}
      </View>
      <Divider style={styles.divider} />
      <MyText style={styles.info}>{otherInfo}</MyText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: myColors.divider,
  },
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
    fontFamily: 'Medium',
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

export default MercInfo;
