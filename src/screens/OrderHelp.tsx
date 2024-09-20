import React from "react";
import { OrderPages } from "@pages/compras/[marketId]/[orderId]";
import { StyleSheet } from "react-native";
import MyDivider from "~/components/MyDivider";
import MyHeader from "~/components/MyHeader";
import MyIcon from "~/components/MyIcon";
import MyText from "~/components/MyText";
import MyTouchable from "~/components/MyTouchable";
import { myColors, myFonts } from "~/constants";
import { Order } from "~/core/models";

const isCompleted = (order: Order) =>
  ["COMPLETING", "COMPLETED"].includes(order.status);
const isCanceled = (order: Order) =>
  ["CANCELING", "CANCELED"].includes(order.status);

const OrderHelp = ({
  order,
  onNavigate: navigate,
  onGoBack: goBack,
}: {
  order: Order;
  onNavigate: (page: OrderPages) => void;
  onGoBack: () => void;
}) => {
  return (
    <>
      <MyHeader title="Ajuda" onGoBack={goBack} />
      {!isCompleted(order) && !isCanceled(order) ? (
        <>
          <MyText
            style={{
              marginVertical: 24,
              marginLeft: 16,
              color: myColors.text3,
              fontSize: 18,
              fontFamily: myFonts.Medium,
            }}
          >
            Como podemos ajudar?
          </MyText>
          <MyDivider style={styles.smallDivider} />
          <MyTouchable
            onPress={() => navigate("OrderCancel")}
            style={{
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <MyText style={styles.text}>Cancelar pedido</MyText>
            <MyIcon name="chevron-right" size={32} color={myColors.grey2} />
          </MyTouchable>
          <MyDivider style={styles.smallDivider} />
        </>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  smallDivider: {
    backgroundColor: myColors.divider2,
    marginHorizontal: 16,
  },
  text: {
    color: myColors.text4,
    fontSize: 16,
  },
});

export default OrderHelp;
