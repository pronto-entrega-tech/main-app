import { useFocusEffect } from 'expo-next-react-navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Image } from 'react-native-elements/dist/image/Image';
import Header3 from '~/components/Header3';
import { WithBottomNav } from '~/components/Layout';
import Loading from '~/components/Loading';
import MyDivider from '~/components/MyDivider';
import MyText from '~/components/MyText';
import MyTouchable from '~/components/MyTouchable';
import { myColors, globalStyles } from '~/constants';
import { getImageUrl } from '~/functions/converter';
import { getOrdersList } from '~/core/dataStorage';
import useRouting from '~/hooks/useRouting';
import { Order } from './pedido';

function Shopping() {
  const routing = useRouting();
  /* const [isLoading, setIsLoading] = useState(true); */
  const [ordersList, setOrdersList] = useState<Order[]>();

  useFocusEffect(
    useCallback(() => {
      getOrdersList().then(setOrdersList);
    }, [])
  );

  /* useEffect(() => {
    setIsLoading(!ordersList);
  }, [ordersList]); */

  const render_item = ({ item }: { item: Order }) => {
    return (
      <MyTouchable
        path='/compras/pedido'
        params={{
          order: ordersList?.indexOf(item),
        }}
        style={[styles.card, globalStyles.elevation3, globalStyles.darkBorder]}>
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={{ uri: getImageUrl('market', item.marketId) }}
            placeholderStyle={{ backgroundColor: '#FFF' }}
            containerStyle={{ height: 50, width: 50, borderRadius: 25 }}
          />
          <View style={{ marginLeft: 16 }}>
            <MyText style={styles.mercName}>{item.marketName}</MyText>
            <MyText style={styles.orderText}>
              Pedido em Andamento •{' '}
              {item.orderMarketId.toString().padStart(3, '0')}
            </MyText>
          </View>
        </View>
        <MyDivider
          style={{ marginHorizontal: -4, marginTop: 10, marginBottom: 6 }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <MyText style={styles.previsionText}>
            {item.scheduled ? 'Agendado para' : 'Previsão de entrega'}
          </MyText>
          <MyText style={styles.previsionTime}>{item.deliveryTime}</MyText>
        </View>
      </MyTouchable>
    );
  };

  if (/* isLoading ||  */ !ordersList) return <Loading />;

  return (
    <>
      <Header3 title='Compras' />
      {!ordersList.length ? (
        <View
          style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <MyText style={{ fontSize: 15, color: myColors.text2 }}>
            Nenhum pedido realizado ainda
          </MyText>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={ordersList}
          contentContainerStyle={{ paddingBottom: 50 }}
          keyExtractor={({ orderMarketId: pedido }) => pedido.toString()}
          renderItem={render_item}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#aaa',
    justifyContent: 'center',
    height: 48,
  },
  textHeader: {
    color: myColors.primaryColor,
    fontSize: 18,
    alignSelf: 'center',
    position: 'absolute',
    fontFamily: 'Regular',
  },
  headerDivider: {
    marginTop: 47,
    backgroundColor: myColors.divider3,
    height: 1,
    marginHorizontal: 16,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  mercName: {
    marginTop: 2,
    fontSize: 16,
    color: myColors.text5,
    fontFamily: 'Regular',
  },
  orderText: {
    marginTop: 2,
    fontSize: 15,
    color: myColors.text3,
    fontFamily: 'Regular',
  },
  previsionText: {
    fontSize: 15,
    color: myColors.text4,
    fontFamily: 'Regular',
  },
  previsionTime: {
    fontSize: 18,
    color: myColors.text3,
    fontFamily: 'Medium',
  },
});

export default WithBottomNav(Shopping);
