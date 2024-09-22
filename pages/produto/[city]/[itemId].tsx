import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import IconButton from "~/components/IconButton";
import ProdListHorizontal from "~/components/ProdListHorizontal";
import { myColors, device, myFonts, globalStyles } from "~/constants";
import { getImageUrl } from "~/functions/converter";
import { calcPrices, money } from "~/functions/money";
import MyIcon from "~/components/MyIcon";
import MyDivider from "~/components/MyDivider";
import useRouting from "~/hooks/useRouting";
import Loading from "~/components/Loading";
import Errors, { MyErrors } from "~/components/Errors";
import { GetStaticPaths, GetStaticProps } from "next";
import AnimatedText from "~/components/AnimatedText";
import { MarketFeed } from "@pages/inicio/mercado/[city]/[marketId]";
import ProductHeader from "~/components/ProductHeader";
import { SinglePageTabs } from "~/components/SinglePageTabs";
import CartBar from "~/components/CartBar";
import { Product } from "~/core/models";
import MyText from "~/components/MyText";
import { api } from "~/services/api";
import { useCartContext, useCartContextSelector } from "~/contexts/CartContext";
import { UseStore, useAtom } from "~/functions/stores";
import MyImage from "~/components/MyImage";

type ProductDetailsProps = { setMarketId?: (v: string) => void };

const ProductDetailsHeader = ({ setMarketId }: ProductDetailsProps) => {
  const { params } = useRouting();
  const [error, setError] = useState<MyErrors>(null);
  const [tryAgain, setTryAgain] = useState(false);
  const [product, setProduct] = useState<Product>();

  useEffect(() => {
    if (product?.item_id === params.itemId) return;

    const { city, itemId } = params;
    if (!city || !itemId) return setError("nothing_product");

    (async () => {
      try {
        setError(null);

        const prod = await api.products.findOne(city, itemId);
        if (!prod) return setError("nothing_product");

        setProduct(prod);
        setMarketId?.(prod.market_id);
      } catch {
        setError("server");
      }
    })();
  }, [tryAgain, product, params, setMarketId]);

  if (error)
    return <Errors error={error} onPress={() => setTryAgain(!tryAgain)} />;

  if (!product || product.item_id !== params.itemId) return <Loading />;

  const { price, previous_price, discountText } = calcPrices(product);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 13,
          paddingTop: 6,
          paddingBottom: 10,
        }}
      >
        <View style={{ flex: 1, flexDirection: "column" }}>
          <MyText numberOfLines={3} style={styles.prodText}>
            {product.name} {product.brand}
          </MyText>
          {discountText && (
            <View style={styles.oldPriceContainer}>
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
          <MyText style={styles.quantityText}>{product.quantity}</MyText>
        </View>

        <View>
          {product.images_names ? (
            <MyImage
              source={getImageUrl("product", product.images_names[0])}
              alt=""
              thumbhash={product.thumbhash}
              style={styles.image}
              height={140}
              width={140}
            />
          ) : (
            <MyIcon
              name="cart-outline"
              color={myColors.grey2}
              size={140}
              style={styles.image}
            />
          )}

          <QuantityButton product={product} />
        </View>
      </View>
      <KitItems product={product} />

      <MyDivider style={{ height: 2 }} />
      <MyText style={styles.ofertasText}>Compare ofertas</MyText>
    </>
  );
};

const QuantityButton = ({ product }: { product: Product }) => {
  const { addProduct, removeProduct } = useCartContext();
  const quantity = useCartContextSelector(
    (v) => v.shoppingList?.get(product.item_id)?.quantity ?? 0,
  );

  return (
    <View style={styles.containerAdd}>
      <IconButton
        onPressIn={() => removeProduct(product)}
        disabled={!quantity}
        icon="minus"
        style={[
          styles.buttonAdd,
          globalStyles.elevation4,
          globalStyles.darkBorder,
        ]}
        hitSlop={{ top: 9, bottom: 9, left: 12, right: 12 }}
      />
      <AnimatedText style={styles.centerNumText} animateZero>
        {quantity}
      </AnimatedText>
      <IconButton
        onPressIn={() => addProduct(product)}
        icon="plus"
        style={[
          styles.buttonAdd,
          globalStyles.elevation4,
          globalStyles.darkBorder,
        ]}
        hitSlop={{ top: 9, bottom: 9, left: 12, right: 12 }}
      />
    </View>
  );
};

export const ProductDetails = (props: ProductDetailsProps) => (
  <View style={{ backgroundColor: myColors.background, flex: 1 }}>
    <ProdListHorizontal header={<ProductDetailsHeader {...props} />} />
  </View>
);

const KitItems = ({ product }: { product: Product }) => {
  const items = product.details.toReversed().map(({ name, quantity }, i) => (
    <MyText
      key={i}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 14,
        color: myColors.text4,
      }}
    >
      {quantity}x {name}
    </MyText>
  ));

  return (
    <>
      <MyDivider style={{ height: 1 }} />
      {items}
    </>
  );
};

const ProductTabs = () => {
  const $marketId = useAtom<string>();

  return (
    <>
      <SinglePageTabs
        header={<ProductHeader />}
        tabs={[
          {
            title: "Produto",
            element: <ProductDetails setMarketId={$marketId.set} />,
          },
          {
            title: "Mercado",
            element: (
              <UseStore store={$marketId}>
                {(marketId) => <MarketFeed marketId={marketId} />}
              </UseStore>
            ),
          },
        ]}
      />
      <CartBar />
    </>
  );
};

const textLinePad = device.android ? -2 : 1;
const styles = StyleSheet.create({
  placeholderColor: {
    backgroundColor: "transparent",
  },
  image: {
    marginTop: 10,
    height: 140,
    width: 140,
    marginHorizontal: 4,
  },
  prodText: {
    color: myColors.grey3,
    fontSize: 20,
    marginTop: 8,
    marginBottom: 8,
    fontFamily: myFonts.Condensed,
    position: "absolute",
  },
  oldPriceContainer: {
    flexDirection: "row",
    position: "absolute",
    alignItems: "center",
    marginTop: 80,
  },
  oldPriceText: {
    textDecorationLine: "line-through",
    color: myColors.grey2,
    fontSize: 18,
    fontFamily: myFonts.Regular,
    marginLeft: 8,
  },
  offTextBox: {
    paddingVertical: 5,
    paddingHorizontal: 4,
    backgroundColor: myColors.primaryColor,
    borderRadius: 8,
  },
  offText: {
    color: "#FFF",
    fontFamily: myFonts.Bold,
    fontSize: 15,
  },
  priceText: {
    color: myColors.text3,
    marginTop: 112 + textLinePad,
    fontSize: 27,
    fontFamily: myFonts.Medium,
  },
  brandText: {
    color: myColors.grey2,
    fontFamily: myFonts.Regular,
    fontSize: 19,
  },
  quantityText: {
    marginTop: 4 + textLinePad,
    color: myColors.grey2,
    fontFamily: myFonts.Regular,
    fontSize: 19,
  },
  containerAdd: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 6,
    paddingHorizontal: 14,
  },
  buttonAdd: {
    width: 34,
    height: 30,
    backgroundColor: "#fff",
  },
  centerNumText: {
    fontSize: 17,
    color: myColors.text3,
    fontFamily: myFonts.Medium,
    textAlign: "center",
  },
  ofertasText: {
    marginLeft: 16,
    marginVertical: 12,
    color: myColors.text3,
    fontSize: 16,
    fontFamily: myFonts.Regular,
  },
});

export default ProductTabs;

/* export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { city: 'jatai-go', itemId: '1' } }],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<ProductDetailsProps> = async ({
  params,
}) => {
  const getProps = async () => {
    if (!params) return;

    const city = params.city;
    const itemId = params.itemId;
    if (typeof city !== 'string' || typeof itemId !== 'string') return;

    return { product: await api.products.findOne(city, itemId) };
  };

  return {
    revalidate: 60,
    props: (await getProps()) ?? {},
  };
}; */
