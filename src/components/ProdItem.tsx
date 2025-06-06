import React from "react";
import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { getImageUrl } from "~/functions/converter";
import { calcPrices, money } from "~/functions/money";
import IconButton from "./IconButton";
import MyTouchable from "./MyTouchable";
import MyText from "./MyText";
import AnimatedText from "./AnimatedText";
import MyIcon from "./MyIcon";
import { Product } from "~/core/models";
import { MotiView } from "moti";
import MyImage from "./MyImage";
import { useCartContext, useCartContextSelector } from "~/contexts/CartContext";
import device from "~/constants/device";
import globalStyles from "~/constants/globalStyles";
import myColors from "~/constants/myColors";
import myFonts from "~/constants/myFonts";

const ProdItem = (props: {
  item: Product;
  isFavorite?: boolean;
  style?: StyleProp<ViewStyle>;
  showsMarketLogo: boolean;
}) => {
  const { item, style = {}, showsMarketLogo } = props;
  const { price, previous_price, discountText } = calcPrices(item);

  return (
    <View
      style={[
        styles.card,
        globalStyles.elevation4,
        globalStyles.darkBorder,
        style,
      ]}
    >
      <MyTouchable
        style={{ flex: 1 }}
        screen="Product"
        params={{ city: item.city_slug, itemId: item.item_id }}
      >
        <View style={styles.top}>
          {item.images_names ? (
            <MyImage
              thumbhash={item.thumbhash}
              source={getImageUrl("product", item.images_names[0])}
              alt=""
              style={styles.image}
              height={70}
              width={70}
            />
          ) : (
            <MyIcon
              name="cart-outline"
              color={myColors.grey2}
              size={70}
              style={styles.image}
            />
          )}
          {showsMarketLogo && (
            <View style={styles.marketLogoContainer}>
              <MyImage
                thumbhash={item.market_thumbhash}
                source={getImageUrl("market", item.market_id)}
                alt=""
                /* contentFit='contain' */
                style={styles.marketLogo}
                height={28}
                width={28}
              />
            </View>
          )}
        </View>
        <View style={styles.container}>
          <MyText style={styles.priceText}>
            {money.toString(price, "R$")}
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
          <MyText numberOfLines={2} style={styles.nameText}>
            {item.name} {item.brand}
          </MyText>
          <MyText numberOfLines={1} style={styles.quantityText}>
            {item.quantity}
          </MyText>
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

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    height: 185,
    borderRadius: 10,
    backgroundColor: "white",
  },
  top: {
    alignItems: "center",
  },
  placeholderColor: {
    backgroundColor: "transparent",
  },
  marketLogoContainer: {
    top: 8,
    left: 6,
    position: "absolute",
    alignSelf: "flex-end",
  },
  marketLogo: {
    height: 28,
    width: 28,
    borderRadius: 40,
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
    fontFamily: myFonts.Bold,
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
  image: {
    marginTop: 10,
    marginBottom: 8,
    height: 70,
    width: 70,
  },
  container: {
    marginTop: 20,
    marginHorizontal: 8,
  },
  priceText: {
    color: myColors.text3,
    marginTop: -22,
    marginBottom: 1,
    fontSize: 18,
    fontFamily: myFonts.Medium,
  },
  oldPriceRow: {
    marginTop: -1,
    flexDirection: "row",
    alignItems: "center",
  },
  offTextBox: {
    paddingVertical: device.web ? 2 : 1,
    paddingHorizontal: 3,
    backgroundColor: myColors.primaryColor,
    borderRadius: 6,
  },
  offText: {
    fontSize: 11,
    color: "white",
    fontFamily: myFonts.Bold,
  },
  oldPriceText: {
    textDecorationLine: "line-through",
    color: myColors.grey2,
    fontSize: 13,
    marginLeft: 4,
  },
  nameText: {
    maxHeight: 40,
    includeFontPadding: false,
    color: myColors.grey3,
    marginTop: 2,
    fontFamily: myFonts.Condensed,
  },
  quantityText: {
    includeFontPadding: false,
    color: myColors.grey2,
  },
});

export default ProdItem;
