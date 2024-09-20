import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Image } from "react-native-elements/dist/image/Image";
import MyHeader from "~/components/MyHeader";
import { myColors, globalStyles, myFonts, images } from "~/constants";
import MyText from "~/components/MyText";
import Errors from "~/components/Errors";
import Loading from "~/components/Loading";
import { useAuthContext } from "~/contexts/AuthContext";
import MyButton from "~/components/MyButton";
import { usePaymentCardContext } from "~/contexts/PaymentCardContext";
import { PaymentCard } from "~/core/models";
import MyTouchable from "~/components/MyTouchable";
import IconButton from "~/components/IconButton";
import { formatCardBrand } from "~/functions/converter";
import { useCartContext } from "~/contexts/CartContext";
import Portal from "~/core/Portal";
import MyInput from "~/components/MyInput";
import { useAlertContext } from "~/contexts/AlertContext";
import CenterModal from "~/components/CenterModal";
import MyIcon from "~/components/MyIcon";

const Nothing = () => (
  <View
    style={[globalStyles.centralizer, { backgroundColor: myColors.background }]}
  >
    <MyText style={{ fontSize: 15, color: myColors.text2 }}>
      Nenhum cartão de crédito salvo ainda
    </MyText>
  </View>
);

export const PaymentMethodsBody = ({
  onPixPress,
  onCardPress,
  onAddCard,
  showPix = !!onPixPress,
}: {
  onPixPress?: () => void;
  onCardPress?: (card: PaymentCard) => void;
  onAddCard?: () => void;
  showPix?: boolean;
}) => {
  const { alert } = useAlertContext();
  const { accessToken } = useAuthContext();
  const { payment, setPayment } = useCartContext();
  const {
    paymentCards,
    loadPaymentCards,
    updatePaymentCard,
    deletePaymentCard,
  } = usePaymentCardContext();
  const [isLoading, setLoading] = useState(false);
  const [modalCardId, setModalCardId] = useState("");
  const [newNickname, setNewNickname] = useState("");

  useEffect(() => {
    if (accessToken) loadPaymentCards(accessToken);
  }, [accessToken, loadPaymentCards]);

  if (accessToken === null)
    return (
      <Errors title="Entre para ver seus cartões salvos" error="missing_auth" />
    );

  if (isLoading || !paymentCards || !accessToken) return <Loading />;

  const cardItem = ({ item: card }: { item: PaymentCard }) => {
    const brand = formatCardBrand(card);
    const name = card.nickname ?? brand;

    const cardIcon =
      {
        Mastercard: images.mastercard,
        Visa: images.visa,
        Elo: images.elo,
      }[brand] ?? undefined;

    const removeCard = () => {
      if (payment?.cardId === card.id) setPayment(null);

      alert(
        "Apagar cartão",
        `Tem certeza que deseja apagar o cartão "${name}"?`,
        { onConfirm: () => deletePaymentCard(accessToken, card.id) },
      );
    };

    return (
      <View
        style={[globalStyles.elevation3, globalStyles.darkBorder, styles.card]}
      >
        <MyTouchable
          style={{ flex: 1 }}
          onPress={onCardPress && (() => onCardPress(card))}
        >
          <View style={styles.cardNameContainer}>
            {cardIcon ? (
              <Image
                {...cardIcon}
                alt=""
                resizeMode="contain"
                containerStyle={{ width: 34, height: 34 }}
              />
            ) : (
              <MyIcon
                name="credit-card-outline"
                size={34}
                color={myColors.primaryColor}
              />
            )}
            <View style={styles.cardSubContainer}>
              <MyText style={styles.cardName}>{name}</MyText>
              <MyText style={styles.cardNumber}>{`•••• ${card.last4}`}</MyText>
            </View>
          </View>
        </MyTouchable>
        <View style={styles.itemButtonsContainer}>
          <IconButton
            icon="pencil"
            color={myColors.grey3}
            style={styles.itemButton}
            onPress={() => setModalCardId(card.id)}
          />
          <IconButton
            icon="delete"
            color={myColors.grey3}
            style={[styles.itemButton, { top: -8 }]}
            onPress={removeCard}
          />
        </View>
      </View>
    );
  };

  const saveCardUpdate = async () => {
    setLoading(true);
    setModalCardId("");
    setNewNickname("");

    await updatePaymentCard(accessToken, {
      id: modalCardId,
      nickname: newNickname,
    });

    setLoading(false);
  };

  const cancelUpdate = () => {
    setModalCardId("");
    setNewNickname("");
  };

  const updateModal = (
    <CenterModal
      state={{ isVisible: !!modalCardId, onDismiss: cancelUpdate }}
      style={{ padding: 24, alignItems: "center" }}
    >
      <MyText
        style={{
          fontSize: 20,
          color: myColors.text4_5,
          fontFamily: myFonts.Medium,
          marginBottom: 16,
          textAlign: "center",
        }}
      >
        Como quer chamar esse cartão?
      </MyText>
      <MyInput
        autoFocus
        maxLength={256}
        containerStyle={{ width: 275 }}
        inputStyle={{
          fontSize: 20,
          color: myColors.text4,
          fontFamily: myFonts.Regular,
        }}
        onChangeText={setNewNickname}
        onSubmitEditing={saveCardUpdate}
      />
      <View style={{ flexDirection: "row" }}>
        <MyButton
          title="Cancelar"
          type="outline"
          buttonStyle={{ borderWidth: 2, padding: 6, width: 106 }}
          onPress={cancelUpdate}
        />
        <MyButton
          title="Confirmar"
          disabled={!newNickname}
          buttonStyle={{ marginLeft: 16, width: 106 }}
          onPress={saveCardUpdate}
        />
      </View>
    </CenterModal>
  );

  const PixCard = () => (
    <MyTouchable
      style={[
        globalStyles.elevation3,
        globalStyles.darkBorder,
        styles.card,
        { marginBottom: 14 },
      ]}
      onPress={onPixPress && (() => onPixPress())}
    >
      <View style={styles.cardNameContainer}>
        <Image
          {...images.pix}
          alt=""
          resizeMode="contain"
          containerStyle={{ height: 34, width: 34 }}
        />
        <MyText style={[styles.cardSubContainer, styles.cardName]}>Pix</MyText>
      </View>
    </MyTouchable>
  );

  return (
    <>
      <View style={[globalStyles.container, { flex: 1, paddingTop: 2 }]}>
        {showPix && <PixCard />}
        {!paymentCards?.length ? (
          <Nothing />
        ) : (
          <FlatList
            style={{ overflow: "visible" }}
            showsVerticalScrollIndicator={false}
            data={paymentCards}
            keyExtractor={(v) => v.id}
            renderItem={cardItem}
          />
        )}
      </View>
      <MyButton
        title="Adicionar cartão de crédito"
        {...(onAddCard ? { onPress: onAddCard } : { screen: "PaymentCard" })}
        type="outline"
        buttonStyle={globalStyles.bottomButton}
      />
      <Portal>{updateModal}</Portal>
    </>
  );
};

const PaymentMethods = () => (
  <>
    <MyHeader title="Meios de pagamento" />
    <PaymentMethodsBody showPix />
  </>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    marginTop: 16,
  },
  cardNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
  },
  cardSubContainer: {
    marginLeft: 12,
  },
  cardName: {
    fontSize: 16,
    color: myColors.text4,
  },
  cardNumber: {
    marginTop: 10,
    marginRight: 48,
    fontSize: 15,
    color: myColors.text2,
  },
  itemButtonsContainer: {
    position: "absolute",
    right: 0,
    top: -2,
  },
  itemButton: {
    height: 48,
    width: 48,
  },
});

export default PaymentMethods;
