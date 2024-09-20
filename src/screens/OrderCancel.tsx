import React from "react";
import { OrderPages } from "@pages/compras/[marketId]/[orderId]";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { RadioButton } from "react-native-paper";
import { serverError } from "~/components/Errors";
import Loading from "~/components/Loading";
import MyButton from "~/components/MyButton";
import MyDivider from "~/components/MyDivider";
import MyHeader from "~/components/MyHeader";
import MyInput from "~/components/MyInput";
import MyText from "~/components/MyText";
import { myColors, myFonts, globalStyles } from "~/constants";
import { useAuthContext } from "~/contexts/AuthContext";
import { CancelReason, Order, SetState } from "~/core/models";
import { useAlertContext } from "~/contexts/AlertContext";
import { api } from "~/services/api";

const OrderCancel = ({
  onGoBack: goBack,
  ...props
}: Parameters<typeof CancelPageBody>[0] & { onGoBack: () => void }) => (
  <>
    <MyHeader title="Cancelar" onGoBack={goBack} />
    <CancelPageBody {...props} />
  </>
);

const CancelPageBody = ({
  order,
  onNavigate: navigate,
}: {
  order: Order;
  onNavigate: (page: OrderPages) => void;
}) => {
  const { alert } = useAlertContext();
  const { accessToken } = useAuthContext();
  const [isLoading, setLoading] = useState(false);
  const [reason, setReason] = useState<CancelReason>();
  const [message, setMessage] = useState("");

  if (isLoading || !accessToken) return <Loading />;

  const cancel = async () => {
    setLoading(true);
    try {
      await api.orders.cancel(accessToken, order, { reason, message });
      navigate("OrderDetails");
    } catch {
      serverError(alert);
      setLoading(false);
    }
  };

  const reasons: [CancelReason, string][] = [
    ["WRONG_PRODUCT", "Produto errado ou faltando"],
    ["WRONG_ADDRESS", "Pedido está atrasado"],
    ["WRONG_PAYMENT_METHOD", "Errei a forma de pagamento"],
    ["FORGOT_COUPON", "Endereço errado"],
    ["ORDER_BY_MISTAKE", "Pedi sem querer"],
    ["CANT_TAKE", "Esqueci do cupom"],
    ["DELIVERY_TOO_LATE", "Não vou poder pegar"],
    ["ORDER_IS_LATE", "Horário de entrega muito tarde"],
    ["OTHER", "Outro motivo"],
  ];

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 66 }}
      >
        <MyText
          style={{
            marginTop: 24,
            marginBottom: 16,
            marginLeft: 16,
            color: myColors.text4,
            fontSize: 18,
            fontFamily: myFonts.Medium,
          }}
        >
          Por que você quer cancelar seu pedido?
        </MyText>
        <RadioButton.Group
          value={reason ?? ""}
          onValueChange={setReason as SetState<string>}
        >
          {reasons.map(([value, title], i) => (
            <>
              {!!i && <MyDivider style={styles.smallDivider} />}
              <RadioButton.Item
                key={value}
                label={title}
                value={value}
                color={myColors.primaryColor}
                uncheckedColor={myColors.grey}
                labelStyle={{ color: myColors.text4 }}
              />
            </>
          ))}
        </RadioButton.Group>
        <MyInput
          value={message}
          onChangeText={setMessage}
          label="Conte o problema"
          labelStyle={{
            color: myColors.optionalInput,
            marginLeft: 8,
            marginBottom: 6,
          }}
          placeholder="Opcional"
          multiline
          maxLength={1000}
          numberOfLines={2}
          containerStyle={{ marginTop: 8 }}
          inputContainerStyle={{ borderColor: "transparent" }}
          inputStyle={{
            borderWidth: 2,
            borderRadius: 12,
            padding: 8,
            borderColor: myColors.divider3,
          }}
        />
      </ScrollView>
      <MyButton
        title="Confirmar"
        disabled={!reason}
        onPress={cancel}
        type="outline"
        buttonStyle={globalStyles.bottomButton}
      />
    </>
  );
};

const styles = StyleSheet.create({
  smallDivider: {
    backgroundColor: myColors.divider2,
    marginHorizontal: 16,
  },
});

export default OrderCancel;
