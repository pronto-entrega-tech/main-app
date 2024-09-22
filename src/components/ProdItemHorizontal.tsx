import React from "react";
import { View, StyleSheet } from "react-native";
import { myColors, device, globalStyles, myFonts } from "~/constants";
import { getImageUrl } from "~/functions/converter";
import { calcPrices, money } from "~/functions/money";
import IconButton from "./IconButton";
import MyIcon from "./MyIcon";
import MyTouchable from "./MyTouchable";
import AnimatedText from "./AnimatedText";
import { objectConditional } from "~/functions/conditionals";
import { Product } from "~/core/models";
import MyText from "./MyText";
import { MotiView } from "moti";
import MyImage from "./MyImage";
import { useCartContext, useCartContextSelector } from "~/contexts/CartContext";

const ProdItemHorizontal = (props: {
  item: Product;
  showsMarketLogo: boolean;
  isFavorite?: boolean;
}) => {
  const { item, showsMarketLogo } = props;
  const { price, previous_price, discountText } = calcPrices(item);

  const path = `/produto/${item.city_slug}/${item.item_id}`;
  const pathParam = objectConditional(!device.web)({ path }); // pathname inside tabs are undefined

  return (
    <View
      style={[globalStyles.elevation4, globalStyles.darkBorder, styles.card]}
    >
      <MyTouchable
        style={{ flex: 1 }}
        screen="Product"
        params={{ city: item.city_slug, itemId: item.item_id, ...pathParam }}
      >
        <View style={styles.container}>
          <View style={styles.containerImage}>
            {item.images_names ? (
              <MyImage
                thumbhash={item.thumbhash}
                source={getImageUrl("product", item.images_names[0])}
                alt=""
                style={styles.image}
                height={80}
                width={80}
              />
            ) : (
              <MyIcon
                name="cart-outline"
                color={myColors.grey2}
                size={80}
                style={styles.image}
              />
            )}
          </View>
          <View style={styles.containerText}>
            <MyText numberOfLines={1} style={styles.prodText}>
              {item.name} {item.brand}
            </MyText>
            {discountText && (
              <View style={styles.oldPriceRow}>
                <View style={styles.offTextBox}>
                  <MyText style={styles.offText}>{discountText}</MyText>
                </View>
                <MyText style={styles.oldPriceText}>
                  {money.toString(previous_price, "R$")}
                </MyText>
              </View>
            )}
            <MyText style={styles.priceText}>
              {money.toString(price, "R$")}
            </MyText>
            <MyText style={styles.quantityText}>{item.quantity}</MyText>
          </View>
          <View style={styles.marketContainer}>
            {showsMarketLogo && (
              <MyImage
                thumbhash={item.market_thumbhash}
                source={getImageUrl("market", item.market_id)}
                alt=""
                style={styles.marketImage}
                height={34}
                width={34}
              />
            )}
          </View>
        </View>
      </MyTouchable>

      <QuantityButton item={item} />
    </View>
  );
};

function QuantityButton({ item }: { item: Product }) {
  const { addProduct, removeProduct } = useCartContext();
  const quantity = useCartContextSelector(
    (v) => v.shoppingList?.get(item.item_id)?.quantity ?? 0,
  );

  return (
    <MotiView
      transition={{ type: "timing", duration: 200 }}
      animate={{ width: quantity === 0 ? 32 : 32 * 2 + 16 }}
      style={[
        globalStyles.elevation4,
        globalStyles.darkBorder,
        styles.addBar,
        { height: 32 },
      ]}
    >
      <IconButton
        onPress={() => addProduct(item)}
        icon="plus"
        style={styles.add}
        hitSlop={{ top: 9, bottom: 9, left: 9, right: 9 }}
      />
      {quantity !== 0 && (
        <>
          <AnimatedText style={styles.centerNumText} distance={10}>
            {quantity}
          </AnimatedText>
          <IconButton
            onPress={() => removeProduct(item)}
            icon="minus"
            style={[styles.add, styles.remove]}
            hitSlop={{ top: 9, bottom: 9, left: 9, right: 9 }}
          />
        </>
      )}
    </MotiView>
  );
}

const textLinePad = device.android ? -2 : 1;
const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    height: 104,
    marginHorizontal: 8,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "white",
  },
  container: {
    flexDirection: "row",
    paddingLeft: 16,
  },

  addBar: {
    backgroundColor: "white",
    borderRadius: 30,
    position: "absolute",
    top: 6,
    right: 6,
    flexDirection: "row-reverse",
    alignItems: "center",
    overflow: "hidden",
  },
  centerNumText: {
    fontSize: 15,
    color: myColors.text3,
    fontFamily: myFonts.Medium,
    left: device.web ? 34 : 30,
    position: "absolute",
    textAlign: "center",
  },
  add: {
    width: 32,
    height: 32,
  },
  remove: {
    position: "absolute",
    right: 48,
  },

  containerAdd: {
    position: "absolute",
    justifyContent: "space-between",
    alignItems: "center",
    height: 104,
    paddingVertical: 8,
    paddingLeft: 4,
    zIndex: 2,
  },
  buttonAdd: {
    width: 26,
    height: 26,
    backgroundColor: "#fff",
  },
  containerImage: {
    marginLeft: -6,
    alignItems: "center",
  },
  image: {
    marginVertical: 12,
    marginHorizontal: 2,
    height: 80,
    width: 80,
  },
  fav: {
    position: "absolute",
    alignSelf: "flex-end",
    top: -3,
    right: -10,
  },
  containerText: {
    marginHorizontal: 8,
  },
  prodText: {
    height: 20,
    color: myColors.grey3,
    marginTop: 12,
    width: device.width - 160,
    fontFamily: myFonts.Condensed,
  },
  oldPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 30,
  },
  offTextBox: {
    paddingVertical: 1,
    paddingHorizontal: 3,
    backgroundColor: myColors.primaryColor,
    borderRadius: 6,
  },
  offText: {
    color: "white",
    fontFamily: myFonts.Bold,
    fontSize: 12,
  },
  oldPriceText: {
    textDecorationLine: "line-through",
    color: myColors.grey2,
    fontSize: 13,
    fontFamily: myFonts.Regular,
    marginLeft: 4,
  },
  priceText: {
    color: myColors.text3,
    marginTop: 18 + textLinePad,
    fontSize: 20,
    fontFamily: myFonts.Medium,
  },
  quantityText: {
    marginTop: textLinePad,
    color: myColors.grey2,
    fontFamily: myFonts.Regular,
  },
  marketContainer: {
    position: "absolute",
    right: 6,
    top: 56,
  },
  marketImage: {
    marginRight: 0,
    height: 34,
    width: 34,
    borderRadius: 34,
  },
});

export default ProdItemHorizontal;
