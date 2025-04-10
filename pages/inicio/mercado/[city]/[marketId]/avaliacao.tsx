import { GetStaticProps } from "next";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import MyHeader from "~/components/MyHeader";
import { WithBottomNav } from "~/components/Layout";
import MyText from "~/components/MyText";
import { api } from "~/services/api";
import { MarketRating as MarketRatingType } from "~/core/models";
import Loading from "~/components/Loading";
import Rating from "~/components/Rating";
import useRouting from "~/hooks/useRouting";
import Errors, { MyErrors } from "~/components/Errors";
import MyDivider from "~/components/MyDivider";
import { lightFormat } from "date-fns";
import globalStyles from "~/constants/globalStyles";
import myColors from "~/constants/myColors";
import myFonts from "~/constants/myFonts";

type MarketRatingProps = { market?: MarketRatingType };

const MarketRatingBody = (props: MarketRatingProps) => {
  const {
    params: { city, marketId },
  } = useRouting();
  const [market, setMarket] = useState(props.market);
  const [error, setError] = useState<MyErrors>();
  const [tryAgain, setTryAgain] = useState(false);

  useEffect(() => {
    if (market || !city || !marketId) return;
    setError(null);

    api.markets
      .reviews(city, marketId)
      .then(setMarket)
      .catch((err) =>
        setError(api.isError("NotFound", err) ? "nothing_market" : "server"),
      );
  }, [tryAgain, market, city, marketId]);

  if (error)
    return <Errors error={error} onPress={() => setTryAgain(!tryAgain)} />;

  if (!market) return <Loading />;
  if (!market.reviews.length) return <Nothing />;

  return (
    <>
      <View style={[{ backgroundColor: myColors.background }]}>
        <View style={{ alignItems: "center", padding: 16 }}>
          <MyText
            style={{
              fontFamily: myFonts.Medium,
              fontSize: 28,
              color: myColors.text2,
            }}
          >
            {`${market.rating}`.replace(".", ",")}
          </MyText>
          <Rating value={market.rating ?? 0} />
          <MyText style={{ fontSize: 15, color: myColors.text4 }}>
            {market.reviews_count_lately} avaliações recentes
          </MyText>
          <MyText style={{ color: myColors.text }}>
            {market.reviews_count_total} avaliações no total
          </MyText>
        </View>
        {market.reviews.map((r) => (
          <View key={r.order_id}>
            <MyDivider style={{ marginHorizontal: 16 }} />
            <View style={{ paddingVertical: 16, paddingHorizontal: 24 }}>
              <MyText style={{ fontSize: 15 }}>{r.customer.name}</MyText>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Rating value={r.rating} style={{ marginRight: 8 }} />
                <MyText style={{ color: myColors.text }}>
                  {lightFormat(new Date(r.created_at), "dd/mm/yy")}
                </MyText>
              </View>
              <MyText style={{ marginBottom: 4 }}>{r.message}</MyText>
              {r.response && <MyText>{r.response}</MyText>}
            </View>
          </View>
        ))}
      </View>
    </>
  );
};

const Nothing = () => (
  <View
    style={[globalStyles.centralizer, { backgroundColor: myColors.background }]}
  >
    <MyText style={{ fontSize: 15, color: myColors.text2 }}>
      Nenhuma avaliação ainda
    </MyText>
  </View>
);

const MarketRating = (props: MarketRatingProps) => (
  <>
    <MyHeader title="Avaliação" />
    <MarketRatingBody {...props} />
  </>
);

export default WithBottomNav(MarketRating);

export { getStaticPaths } from "../[marketId]";

export const getStaticProps: GetStaticProps<MarketRatingProps> = async ({
  params,
}) => {
  const city = params?.city?.toString();
  const marketId = params?.marketId?.toString();

  const props =
    city && marketId
      ? {
          market: await api.markets
            .reviews(city, marketId)
            .catch(() => undefined),
        }
      : {};

  return {
    revalidate: 60,
    props,
  };
};
