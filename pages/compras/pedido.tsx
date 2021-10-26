import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { myColors, images } from '~/constants';
import LinearProgress from 'react-native-elements/dist/linearProgress/LinearProgress';
import { Image } from 'react-native-elements/dist/image/Image';
import { getOrdersList } from '~/core/dataStorage';
import { getImageUrl } from '~/functions/converter';
import { WithBottomNav } from '~/components/Layout';
import MyDivider from '~/components/MyDivider';
import MyText from '~/components/MyText';
import MyIcon from '~/components/MyIcon';
import Header from '~/components/Header';
import Loading from '~/components/Loading';
import useRouting from '~/hooks/useRouting';

export interface Order {
  marketName: string;
  marketId: string;
  orderMarketId: number;
  prodList: ProductOrder[];
  deliveryTime: string;
  scheduled: boolean;
  date: string;
  subtotal: string;
  discount: string;
  deliveryFee: string;
  total: string;
  address: string;
  payment: string;
}
export interface ProductOrder {
  quantity: string;
  description: string;
  price: string;
  weight: string;
}

function Order() {
  const { params } = useRouting();
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<Order>();
  const orderIndex = params.order as number;

  useEffect(() => {
    setIsLoading(true);
    getOrdersList().then((list) => {
      setOrder(list[orderIndex]);
      setIsLoading(false);
    });
  }, [orderIndex]);

  if (isLoading || !order) return <Loading />;

  const pay = order.payment;
  const iconPaymento = pay.includes('Dinheiro')
    ? images.cash
    : images.creditCard;

  const header = (
    <View>
      <Header title='Detalhes do pedido' />
      <View style={{ marginHorizontal: 16, marginVertical: 12 }}>
        <MyText style={styles.previsionMyText}>
          {order.scheduled ? 'Agendado para' : 'Previsão de entrega'}
        </MyText>
        <MyText style={styles.previsionTime}>{order.deliveryTime}</MyText>
      </View>
      <View style={{ flexDirection: 'row', marginHorizontal: 16 }}>
        <LinearProgress
          color={myColors.colorAccent}
          style={{ flex: 1, marginRight: 0 }}
        />
        <LinearProgress
          variant='determinate'
          color={myColors.divider3}
          style={{ flex: 4, marginLeft: 8 }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 16,
          height: 40,
          alignItems: 'center',
        }}>
        <MyIcon name='circle' color='green' size={8} />
        <MyText style={styles.steps}>Aguardado confirmação do mercado</MyText>
      </View>
      <MyDivider style={styles.divider} />
      <View style={styles.mercConteiner}>
        <Image
          source={{ uri: getImageUrl('market', order.marketId) }}
          placeholderStyle={{ backgroundColor: '#FFF' }}
          containerStyle={{ height: 65, width: 65 }}
        />
        <MyText style={styles.mercName}>{order.marketName}</MyText>
      </View>
      <View style={styles.infoConteiner}>
        <MyText style={styles.Mytext}>Realizado {order.date}</MyText>
        <MyText style={styles.Mytext}>
          Pedido {order.orderMarketId.toString().padStart(3, '0')}
        </MyText>
      </View>
      <MyDivider style={styles.divider} />
      <View style={{ marginHorizontal: 16, marginVertical: 12 }}>
        <MyText style={styles.Mytext}>Endereço de entrega</MyText>
        <MyText style={styles.address}>{order.address}</MyText>
      </View>
      <MyDivider style={styles.divider} />
      <View style={styles.paymentConteiner}>
        <MyText style={styles.Mytext}>Pagar na entrega</MyText>
        <MyText style={styles.paymentMyText}>{order.payment}</MyText>
        <Image
          {...iconPaymento}
          resizeMode='contain'
          containerStyle={{
            position: 'absolute',
            right: 0,
            width: 28,
            height: 28,
          }}
          childrenContainerStyle={{ top: 2 }}
        />
      </View>
      <MyDivider style={styles.divider} />
      <View style={styles.priceConteiner}>
        <MyText style={styles.priceMyText}>Subtotal</MyText>
        <MyText style={styles.priceMyText}>R${order.subtotal}</MyText>
      </View>
      <View style={styles.priceConteiner}>
        <MyText style={styles.priceMyText}>Economizado</MyText>
        <MyText style={styles.priceMyText}>R${order.discount}</MyText>
      </View>
      <View style={styles.priceConteiner}>
        <MyText style={styles.priceMyText}>Taxa de entrega</MyText>
        <MyText
          style={[
            styles.priceMyText,
            order.deliveryFee === '0,00' && { color: '#10b500' },
          ]}>
          {order.deliveryFee === '0,00' ? 'Grátis' : `R$${order.deliveryFee}`}
        </MyText>
      </View>
      <MyDivider
        style={{ backgroundColor: myColors.divider3, marginHorizontal: 16 }}
      />
      <View style={styles.priceTotalConteiner}>
        <MyText style={styles.priceTotalMyText}>Total</MyText>
        <MyText style={styles.priceTotalMyText}>R${order.total}</MyText>
      </View>
      <MyDivider style={styles.divider} />
    </View>
  );

  const _renderItem = ({ item }: { item: ProductOrder }) => (
    <>
      <View
        style={{
          flexDirection: 'row',
          paddingTop: 10,
          paddingHorizontal: 16,
          alignItems: 'center',
        }}>
        <MyText style={styles.quantity}>1x</MyText>
        <View style={{ marginLeft: 18 }}>
          <MyText style={styles.description}>{item.description}</MyText>
          <MyText style={styles.price}>R${item.price}</MyText>
          <MyText style={styles.weight}>{item.weight}</MyText>
        </View>
      </View>
      <MyDivider
        style={{
          marginHorizontal: 12,
          marginTop: 12,
          backgroundColor: myColors.divider3,
        }}
      />
    </>
  );

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 50 }}
      data={order.prodList}
      keyExtractor={(v) => v.description}
      ListHeaderComponent={header}
      renderItem={_renderItem}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 2,
  },
  Mytext: {
    fontFamily: 'Regular',
    color: myColors.text4,
    fontSize: 16,
  },
  previsionMyText: {
    fontFamily: 'Regular',
    color: myColors.text3,
  },
  previsionTime: {
    fontFamily: 'Medium',
    color: myColors.text3,
    fontSize: 24,
  },
  steps: {
    marginLeft: 8,
    fontFamily: 'Medium',
    color: myColors.text2,
    fontSize: 14,
  },
  mercName: {
    marginLeft: 14,
    fontFamily: 'Medium',
    color: myColors.text3,
    fontSize: 24,
  },
  mercConteiner: {
    flexDirection: 'row',
    marginVertical: 12,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  infoConteiner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginHorizontal: 16,
  },
  address: {
    fontFamily: 'Condensed',
    color: myColors.text5,
    fontSize: 16,
  },
  paymentConteiner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
  },
  paymentMyText: {
    fontFamily: 'Regular',
    color: myColors.text5,
    fontSize: 16,
    marginRight: 34,
  },
  priceConteiner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 6,
  },
  priceTotalConteiner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  priceMyText: {
    fontSize: 16,
    color: myColors.text4,
  },
  priceTotalMyText: {
    fontSize: 20,
    color: myColors.text5,
  },
  quantity: {
    fontFamily: 'Medium',
    color: myColors.text3,
    fontSize: 16,
  },
  description: {
    fontFamily: 'Condensed',
    color: myColors.text4,
    fontSize: 14,
  },
  price: {
    fontFamily: 'Medium',
    color: myColors.text3,
    fontSize: 16,
    marginTop: 4,
  },
  weight: {
    fontFamily: 'Regular',
    color: myColors.text4,
    fontSize: 14,
    marginTop: 2,
  },
});

export default WithBottomNav(Order);
