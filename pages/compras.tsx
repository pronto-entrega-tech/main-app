import React, { useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Image } from "react-native-elements/dist/image/Image";
import MyHeader from "~/components/MyHeader";
import { WithBottomNav } from "~/components/Layout";
import Loading from "~/components/Loading";
import MyDivider from "~/components/MyDivider";
import MyText from "~/components/MyText";
import MyTouchable from "~/components/MyTouchable";
import {
  canReview,
  formatDeliveryTime,
  getImageUrl,
  validateOrder,
} from "~/functions/converter";
import { Order } from "~/core/models";
import { useOrderContext } from "~/contexts/OrderContext";
import { useAuthContext } from "~/contexts/AuthContext";
import { io } from "socket.io-client";
import Rating from "~/components/Rating";
import Errors from "~/components/Errors";
import { Urls } from "~/constants/urls";
import { lightFormat } from "date-fns";
import globalStyles from "~/constants/globalStyles";
import myColors from "~/constants/myColors";
import myFonts from "~/constants/myFonts";

const isCompleted = (order: Order) =>
  ["COMPLETING", "COMPLETED"].includes(order.status);
const isCanceled = (order: Order) =>
  ["CANCELING", "CANCELED"].includes(order.status);

const OrdersBody = () => {
  const { accessToken } = useAuthContext();
  const { orders, loadOrders, setOrders } = useOrderContext();

  useEffect(() => {
    if (accessToken) loadOrders(accessToken);
  }, [accessToken, loadOrders]);

  useEffect(() => {
    const activeOrders = orders?.filter(
      (o) => !isCompleted(o) && !isCanceled(o),
    );
    if (!accessToken || !activeOrders?.length) return;

    const socket = io(Urls.API_WS, {
      transports: ["websocket"],
      auth: { token: accessToken },
    });

    socket.on("orders", (newOrder: Partial<Order>) => {
      const getNew = (o: Order) => validateOrder({ ...(o ?? {}), ...newOrder });

      setOrders((orders) =>
        orders?.map((o) => (o.order_id === newOrder.order_id ? getNew(o) : o)),
      );
    });

    activeOrders.forEach(({ order_id, market_id }) => {
      socket.emit("orders", { order_id, market_id });
    });

    return () => {
      socket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, !orders, setOrders]);

  if (accessToken === null)
    return <Errors error="missing_auth" title="Entre para ver seus pedidos" />;

  if (!orders) return <Loading />;

  const OrderItem = ({ item }: { item: Order }) => {
    const statusMsg = isCompleted(item)
      ? "Pedido concluído"
      : isCanceled(item)
        ? "Pedido cancelado"
        : "Pedido em andamento";

    const timeMsg = isCompleted(item)
      ? "Concluído em"
      : isCanceled(item)
        ? "Cancelado em"
        : item.is_scheduled
          ? "Agendado para"
          : "Previsão de entrega";

    const time =
      isCompleted(item) || isCanceled(item)
        ? item.finished_at
          ? lightFormat(item.finished_at, "dd/MM/yy")
          : ""
        : formatDeliveryTime(item);

    return (
      <MyTouchable
        screen="OrderDetails"
        params={{ marketId: item.market_id, orderId: item.order_id }}
        style={[styles.card, globalStyles.elevation3, globalStyles.darkBorder]}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            source={{ uri: getImageUrl("market", item.market_id) }}
            alt=""
            placeholderStyle={{ backgroundColor: "white" }}
            containerStyle={{ borderRadius: 8, height: 50, width: 50 }}
          />
          <View style={{ marginLeft: 16 }}>
            <MyText style={styles.marketName}>{item.market.name}</MyText>
            <MyText style={styles.orderText}>
              {statusMsg} • {item.market_order_id.padStart(3, "0")}
            </MyText>
            {item.review ? (
              <Rating value={item.review.rating} />
            ) : isCompleted(item) && canReview(item) ? (
              <MyText style={styles.orderText}>Avalie o pedido</MyText>
            ) : null}
          </View>
        </View>
        <MyDivider
          style={{ marginHorizontal: -4, marginTop: 10, marginBottom: 6 }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <MyText style={styles.previsionText}>{timeMsg}</MyText>
          <MyText style={styles.previsionTime}>{time}</MyText>
        </View>
      </MyTouchable>
    );
  };

  return !orders.length ? (
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <MyText style={{ fontSize: 15, color: myColors.text2 }}>
        Nenhum pedido realizado ainda
      </MyText>
    </View>
  ) : (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={orders}
      contentContainerStyle={{ paddingBottom: 50 }}
      keyExtractor={(v) => v.order_id}
      renderItem={OrderItem}
    />
  );
};

const Orders = () => (
  <>
    <MyHeader title="Compras" goBackLess smallDivider />
    <OrdersBody />
  </>
);

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#aaa",
    justifyContent: "center",
    height: 48,
  },
  textHeader: {
    color: myColors.primaryColor,
    fontSize: 18,
    alignSelf: "center",
    position: "absolute",
    fontFamily: myFonts.Regular,
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
    backgroundColor: "white",
    borderRadius: 10,
  },
  marketName: {
    marginTop: 2,
    fontSize: 16,
    color: myColors.text5,
    fontFamily: myFonts.Regular,
  },
  orderText: {
    marginTop: 2,
    fontSize: 15,
    color: myColors.text3,
    fontFamily: myFonts.Regular,
  },
  previsionText: {
    fontSize: 15,
    color: myColors.text4,
    fontFamily: myFonts.Regular,
  },
  previsionTime: {
    fontSize: 18,
    color: myColors.text3,
    fontFamily: myFonts.Medium,
  },
});

export default WithBottomNav(Orders);
