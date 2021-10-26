import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'react-native-elements/dist/image/Image';
import useMyContext from '~/core/MyContext';
import { useProdContext } from '~/core/ProdContext';
import IconButton from '~/components/IconButton';
import ProdListHorizontal from '~/components/ProdListHorizontal';
import { myColors, device } from '~/constants';
import { calcOff, getImageUrl, moneyToString } from '~/functions/converter';
import MyIcon from '~/components/MyIcon';
import MyDivider from '~/components/MyDivider';
import { WithProductTabBar } from '~/components/Layout';
import { Product } from '~/components/ProdItem';
import useRouting from '~/hooks/useRouting';
import Loading, { Errors, myErrors } from '~/components/Loading';
import { getProd } from '~/services/requests';
import { GetStaticPaths, GetStaticProps } from 'next';
import AnimatedText from '~/components/AnimatedText';

function ProductDetails(props: { product?: Product }) {
  const { product: productFromProps } = props;
  const { params } = useRouting();
  /* const { product: productFromParams } = params; */
  const [error, setError] = React.useState<myErrors>(null);
  const [tryAgain, setTryAgain] = React.useState(false);
  const [product, setProduct] = React.useState(
    productFromProps /*  ?? productFromParams */
  );
  const { shoppingList, onPressAdd, onPressRemove } = useMyContext();

  React.useEffect(() => {
    if (product) return;
    (async () => {
      try {
        const { city, marketId, prodId } = params;
        if (!(city && marketId && prodId)) return setError('nothing_product');

        const prod = await getProd(city, marketId, prodId);
        if (!prod) return setError('nothing_product');

        setProduct(prod);
      } catch {
        setError('server');
      }
    })();
  }, [tryAgain, product, params]);

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

  if (!product) return <Loading />;
  const quantity = shoppingList.get(product.prod_id)?.quantity;
  const off = calcOff(product);

  const MyHeader = (
    <>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 13,
          paddingTop: 6,
          paddingBottom: 10,
        }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <Text ellipsizeMode='tail' numberOfLines={3} style={styles.prodText}>
            {product.name} {product.brand}
          </Text>
          {off && (
            <View style={styles.oldPriceConteiner}>
              <View style={styles.offTextBox}>
                <Text style={styles.offText}>-{off}%</Text>
              </View>
              <Text style={styles.oldPriceText}>
                {moneyToString(product.previous_price, 'R$')}
              </Text>
            </View>
          )}
          <Text style={styles.priceText}>
            {moneyToString(product.price, 'R$')}
          </Text>
          <Text style={styles.quantityText}>{product.quantity}</Text>
        </View>

        <View style={{ flexDirection: 'column' }}>
          {product.images_names ? (
            <Image
              placeholderStyle={{ backgroundColor: 'white' }}
              PlaceholderContent={
                <MyIcon name='cart-outline' color={myColors.grey2} size={140} />
              }
              source={{
                uri: getImageUrl('product', product.images_names[0]),
              }}
              style={styles.image}
            />
          ) : (
            <MyIcon
              name='cart-outline'
              color={myColors.rating}
              size={140}
              style={styles.image}
            />
          )}

          <View style={styles.containerAdd}>
            <IconButton
              icon='minus'
              size={24}
              color={myColors.primaryColor}
              type='addLarge'
              onPress={() => onPressRemove(product)}
            />
            <AnimatedText style={styles.centerNumText} animateZero>
              {quantity ?? 0}
            </AnimatedText>
            <IconButton
              icon='plus'
              type='addLarge'
              onPress={() => onPressAdd(product)}
            />
          </View>
        </View>
      </View>

      <MyDivider style={{ height: 2 }} />
      <Text style={styles.ofertasText}>Compare ofertas</Text>
    </>
  );

  return (
    <View style={{ backgroundColor: myColors.background, flex: 1 }}>
      <ProdListHorizontal header={MyHeader} />
    </View>
  );
}

const textLinePad = device.android ? -2 : 1;
const styles = StyleSheet.create({
  placeholderColor: {
    backgroundColor: 'transparent',
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
    fontFamily: 'Condensed',
    position: 'absolute',
  },
  oldPriceConteiner: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    marginTop: 80,
  },
  oldPriceText: {
    textDecorationLine: 'line-through',
    color: myColors.grey2,
    fontSize: 18,
    fontFamily: 'Regular',
    marginLeft: 8,
  },
  offTextBox: {
    paddingVertical: 5,
    paddingHorizontal: 4,
    backgroundColor: myColors.primaryColor,
    borderRadius: 8,
  },
  offText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  priceText: {
    color: myColors.text3,
    marginTop: 112 + textLinePad,
    fontSize: 27,
    fontFamily: 'Medium',
  },
  brandText: {
    color: myColors.grey2,
    fontFamily: 'Regular',
    fontSize: 19,
  },
  quantityText: {
    marginTop: 4 + textLinePad,
    color: myColors.grey2,
    fontFamily: 'Regular',
    fontSize: 19,
  },
  containerAdd: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  centerNumText: {
    fontSize: 17,
    color: myColors.text3,
    fontFamily: 'Medium',
  },
  ofertasText: {
    marginLeft: 16,
    marginVertical: 12,
    color: myColors.text3,
    fontSize: 16,
    fontFamily: 'Regular',
  },
});

export default WithProductTabBar(ProductDetails);

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { city: 'jatai-go', marketId: '1', prodId: '1' } }],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const city = params?.city?.toString();
  const marketId = params?.marketId?.toString();
  const prodId = params?.prodId?.toString();

  const props =
    city && marketId && prodId
      ? {
          products: await getProd(city, marketId, prodId),
        }
      : {};

  return {
    revalidate: 60,
    props,
  };
};
