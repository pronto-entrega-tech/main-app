import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import { Market, weekDayArray, weekDayNames } from "~/core/models";
import Loading from "~/components/Loading";
import Errors, { MyErrors } from "~/components/Errors";
import MyText from "~/components/MyText";
import { myColors, myFonts } from "~/constants";
import { documentMask } from "~/functions/converter";
import { WithBottomNav } from "~/components/Layout";
import MyDivider from "~/components/MyDivider";
import MyHeader from "~/components/MyHeader";
import useRouting from "~/hooks/useRouting";
import { GetStaticProps } from "next";
import Chip from "~/components/Chip";
import { api } from "~/services/api";
import { paymentImages } from "~/constants/images";

type MarketDetailsProps = { market?: Market };

const MarketDetails = (props: MarketDetailsProps) => (
  <>
    <MyHeader title="Informações" />
    <MarketDetailsBody {...props} />
  </>
);

const MarketDetailsBody = (props: MarketDetailsProps) => {
  const { params } = useRouting();
  const [error, setError] = useState<MyErrors>(null);
  const [tryAgain, setTryAgain] = useState(false);
  const [market, setMarket] = useState(props.market);

  useEffect(() => {
    if (market) return;
    setError(null);

    api.markets
      .findOne(params.city, params.marketId)
      .then(setMarket)
      .catch((err) =>
        setError(api.isError("NotFound", err) ? "nothing_market" : "server")
      );
  }, [tryAgain, market, params.city, params.marketId]);

  if (error)
    return <Errors error={error} onPress={() => setTryAgain(!tryAgain)} />;

  if (!market) return <Loading />;

  const payDelivery = market.payments_accepted.map((title) => ({
    icon: paymentImages[title.replace(/.* /, "")],
    title,
  }));

  const close = "Fechado";
  const time = weekDayNames.map((day) => ({ day, hour: close }));

  market.business_hours.forEach(({ days, open_time, close_time }) => {
    days.forEach((day) => {
      const index = weekDayArray.indexOf(day);
      const oldHour = time[index].hour;
      const newHour = `${open_time} às ${close_time}`;

      time[index].hour =
        oldHour === close ? newHour : `${oldHour} - ${newHour}`;
    });
  });
  const { street, number, district, city, state } = market.address;
  const document = documentMask(market.document);
  const otherInfo = `${street}, ${number}\n${district}\n${city}, ${state}\n\nCNPJ ${document}`;

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {market.info && <MyText style={styles.text}>{market.info}</MyText>}
        <MyText style={styles.title}>Horário de entrega</MyText>
        {time.map((item) => {
          const today = new Date().getDay();
          const todayStyle = item.day === weekDayNames[today] && {
            fontFamily: myFonts.Medium,
          };

          return (
            <View
              key={item.day}
              style={{ marginHorizontal: 16, marginBottom: 10 }}
            >
              <MyText style={[todayStyle, styles.time]}>{item.day}</MyText>
              <MyText
                style={[
                  todayStyle,
                  styles.time,
                  { position: "absolute", marginLeft: 80 },
                ]}
              >
                {item.hour}
              </MyText>
            </View>
          );
        })}
        <MyDivider />
        <MyText style={styles.title}>Pagamento na entrega</MyText>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginHorizontal: 8,
            marginBottom: 12,
          }}
        >
          {payDelivery.map((item) => (
            <Chip
              key={item.title}
              title={item.title}
              icon={
                <Image
                  {...item.icon}
                  alt=""
                  style={{ height: 24, width: 24 }}
                />
              }
              style={{ margin: 4, padding: 6 }}
            />
          ))}
        </View>
        <MyDivider />
        <MyText style={styles.info}>{otherInfo}</MyText>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: myColors.background,
    paddingBottom: 64,
    paddingTop: 8,
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

export { getStaticPaths } from "../[marketId]";

export const getStaticProps: GetStaticProps<MarketDetailsProps> = async ({
  params,
}) => {
  const city = params?.city?.toString();
  const marketId = params?.marketId?.toString();

  const props =
    city && marketId
      ? { market: await api.markets.findOne(city, marketId) }
      : {};

  return {
    revalidate: 60,
    props,
  };
};
