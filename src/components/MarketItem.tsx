import React from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "react-native-elements/dist/image/Image";
import { Coords, Market } from "~/core/models";
import { computeDistance, getImageUrl } from "~/functions/converter";
import { marketOpenness } from "~/functions/marketOpenness";
import { money } from "~/functions/money";
import MyText from "./MyText";
import MyTouchable from "./MyTouchable";
import Rating from "./Rating";
import device from "~/constants/device";
import globalStyles from "~/constants/globalStyles";
import myColors from "~/constants/myColors";
import myFonts from "~/constants/myFonts";

const MarketItem = (props: { market: Market; coords?: Coords }) => {
  const { market, coords } = props;
  const openness = marketOpenness(market);
  const distance = coords && computeDistance(coords, market.address.coords);

  return (
    <MyTouchable
      style={[styles.card, globalStyles.elevation4, globalStyles.darkBorder]}
      screen="Market"
      params={{ city: market.city_slug, marketId: market.market_id }}
    >
      <Image
        source={{ uri: getImageUrl("market", market.market_id) }}
        alt=""
        containerStyle={styles.image}
      />
      <View style={{ marginLeft: 10, marginTop: -5, justifyContent: "center" }}>
        <View style={{ flexDirection: "row" }}>
          <MyText style={styles.title}>{market.name}</MyText>
          {market.rating ? (
            <Rating
              value={market.rating}
              size="small"
              style={{ alignSelf: "center" }}
            />
          ) : (
            <MyText style={styles.new}>Novo!</MyText>
          )}
        </View>
        <MyText style={styles.text1}>{openness}</MyText>
        <MyText style={styles.text2}>
          {distance && `Á ${distance}km • `}
          {`${market.min_time}-${market.max_time}min • `}
          {money.toString(market.delivery_fee, "R$")}
        </MyText>
      </View>
    </MyTouchable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    height: 90,
    borderRadius: 8,
    marginTop: 16,
  },
  image: {
    height: 90,
    width: 90,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    margin: device.web ? -1 : 0,
  },
  title: {
    fontSize: 16,
    marginRight: 4,
    color: myColors.text6,
  },
  new: {
    alignSelf: "flex-end",
    fontSize: 13,
    marginBottom: 1,
    marginLeft: 4,
    color: myColors.rating,
    fontFamily: myFonts.Medium,
  },
  openText: {
    color: myColors.text5,
  },
  text1: {
    marginTop: 4,
    marginBottom: 2,
    color: myColors.text5,
  },
  text2: {
    color: myColors.text3,
  },
});

export default MarketItem;
