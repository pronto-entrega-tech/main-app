import React, { useState, useEffect } from "react";
import { Share, StyleSheet, View } from "react-native";
import { device, myColors, myFonts } from "~/constants";
import MyTouchable from "~/components/MyTouchable";
import ProdList from "~/components/ProdList";
import Loading from "~/components/Loading";
import Errors, { MyErrors } from "~/components/Errors";
import { computeDistance, getImageUrl } from "~/functions/converter";
import { marketOpenness } from "~/functions/marketOpenness";
import { money } from "~/functions/money";
import MyButton from "~/components/MyButton";
import MyText from "~/components/MyText";
import MyIcon, { IconNames } from "~/components/MyIcon";
import Rating from "~/components/Rating";
import IconButton from "~/components/IconButton";
import MySearchBar from "~/components/MySearchBar";
import { WithBottomNav } from "~/components/Layout";
import { Urls } from "~/constants/urls";
import useRouting from "~/hooks/useRouting";
import { GetStaticPaths, GetStaticProps } from "next";
import { ListHeader } from "@pages/inicio";
import { objectConditional } from "~/functions/conditionals";
import { Market, Product } from "~/core/models";
import MyHeader from "~/components/MyHeader";
import { useAddressContext } from "~/contexts/AddressContext";
import { api } from "~/services/api";
import MyImage from "~/components/MyImage";

const useIsProductRoute = () => useRouting().screen.startsWith("Product");

type MarketFeedProps = { marketId?: string } & MarketAndProducts;

export const MarketFeed = (props: MarketFeedProps) => (
  <>
    {!useIsProductRoute() && <MarketHeader />}
    <MarketFeedBody {...props} />
  </>
);

const MarketHeader = () => {
  const { params, navigate } = useRouting();
  const { city, marketId } = params;

  const sharePage = () => {
    const url = `${Urls.WWW}/inicio/mercado/${city}/${marketId}`;

    if (!device.web) Share.share({ message: url });
    else navigator.share({ url });
  };
  const shareIcon = (
    <IconButton
      icon="share-variant"
      onPress={sharePage}
      style={{
        marginLeft: -8,
        width: 56,
        height: 56,
      }}
    />
  );

  return (
    <>
      <MyHeader title="Mercado" smallDivider rightIcon={shareIcon} />
      <View style={{ marginTop: 10, marginBottom: 8, paddingHorizontal: 16 }}>
        <MySearchBar
          onSubmit={(query) => navigate("Search", { query, marketId })}
        />
      </View>
    </>
  );
};

type MarketAndProducts = {
  market?: Market;
  products?: Product[];
};
const MarketFeedBody = (props: MarketFeedProps) => {
  const { params } = useRouting();
  const marketId = props.marketId ?? params.marketId;

  const isProductRoute = useIsProductRoute();
  const { address } = useAddressContext();
  const [error, setError] = useState<MyErrors>();
  const [tryAgain, setTryAgain] = useState(false);
  const [{ market, products }, setData] = useState<MarketAndProducts>(props);

  useEffect(() => {
    if (!marketId || market?.market_id === marketId) return;

    (async () => {
      setError(null);

      const [market, products] = await Promise.all([
        api.markets.findOne(params.city, marketId),
        api.products.findMany(params.city, { marketId }),
      ]);
      if (!products.length) return setError("nothing_market");

      setData({ market, products });
    })().catch((err) =>
      setError(api.isError("NotFound", err) ? "nothing_market" : "server")
    );
  }, [tryAgain, market, params.city, marketId]);

  if (error)
    return <Errors error={error} onPress={() => setTryAgain(!tryAgain)} />;

  if (!market || market.market_id !== marketId) return <Loading />;

  const distance =
    address?.coords && computeDistance(address?.coords, market.address.coords);

  const marketFee = money.toString(market.delivery_fee, "R$");

  const marketDetails: { icon: IconNames; text: string }[] = [
    { icon: "clock", text: marketOpenness(market) },
    ...(distance
      ? [{ icon: "map-marker", text: `Á ${distance}km de você` } as const]
      : []),
    {
      icon: "truck-fast",
      text: `${market.min_time}-${market.max_time}min • ${marketFee}`,
    },
    {
      icon: "currency-usd",
      text: `Mínimo ${money.toString(market.order_min, "R$")}`,
    },
  ];

  const marketListHeader = (
    <>
      <View
        style={[styles.headerContainer, { marginTop: isProductRoute ? 12 : 0 }]}
      >
        <View style={{ paddingTop: 2 }}>
          <MyImage
            source={getImageUrl("market", market.market_id)}
            alt=""
            thumbhash={market.thumbhash}
            style={{ borderRadius: 8 }}
            height={128}
            width={128}
          />
          {market.rating ? (
            <View style={styles.ratingContainer}>
              <Rating value={market.rating} />
            </View>
          ) : (
            <MyText style={styles.textNew}>Novo!</MyText>
          )}
          <MyTouchable
            screen="MarketRating"
            params={{
              ...objectConditional(!device.web)(market),
              city: market.city_slug,
              marketId: market.market_id,
            }}
            style={styles.ratingTouchable}
          />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", marginLeft: 5 }}>
            <MyButton
              buttonStyle={{ paddingVertical: 3 }}
              type="clear"
              title={market.name}
              titleStyle={styles.title}
              iconRight
              icon={{
                name: "chevron-right",
                size: 28,
                color: myColors.text3,
                style: { marginLeft: -2, marginTop: 3 },
              }}
              screen="MarketDetails"
              params={{
                ...objectConditional(!device.web)(market),
                city: market.city_slug,
                marketId: market.market_id,
              }}
            />
          </View>
          {marketDetails.map((item, index) => (
            <View key={index} style={styles.detailsContainer}>
              <MyIcon name={item.icon} size={20} />
              <MyText style={{ marginLeft: 4, color: myColors.text2 }}>
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
    <ProdList
      data={products}
      hideMarketLogo
      style={{ backgroundColor: myColors.background, paddingBottom: 74 }}
      header={marketListHeader}
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 2,
  },
  ratingContainer: {
    height: 34,
    padding: 6,
    marginTop: -2,
    marginLeft: -2,
  },
  textNew: {
    height: 34,
    color: myColors.rating,
    fontSize: 16,
    fontFamily: myFonts.Medium,
    padding: 6,
    marginTop: -2,
    width: 128,
    textAlign: "center",
  },
  ratingTouchable: {
    marginTop: -36,
    borderRadius: 4,
    width: 132,
    height: 36,
    marginLeft: -2,
  },
  title: {
    color: myColors.text3,
    fontSize: 22,
    fontFamily: myFonts.Medium,
  },
  detailsContainer: {
    flexDirection: "row",
    marginBottom: 4,
    marginLeft: 12,
    alignItems: "center",
  },
});

export default WithBottomNav(MarketFeed);

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { city: "jatai-go", marketId: "market_1" } }],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<MarketFeedProps> = async ({
  params,
}) => {
  const city = params?.city?.toString();
  const marketId = params?.marketId?.toString();

  const props =
    city && marketId
      ? {
          market: await api.markets.findOne(city, marketId),
          products: await api.products.findMany(city, { marketId }),
        }
      : {};

  return {
    revalidate: 60,
    props,
  };
};
