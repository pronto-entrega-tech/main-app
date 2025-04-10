import React, { createRef, useRef, useState } from "react";
import { TextInput, View } from "react-native";
import MyHeader from "~/components/MyHeader";
import Errors from "~/components/Errors";
import Loading from "~/components/Loading";
import { useAuthContext } from "~/contexts/AuthContext";
import MyButton from "~/components/MyButton";
import useRouting from "~/hooks/useRouting";
import { usePaymentCardContext } from "~/contexts/PaymentCardContext";
import { CreatePaymentCard } from "~/core/models";
import MyInput from "~/components/MyInput";
import FormContainer from "~/components/FormContainer";
import { digitsMask } from "~/functions/converter";
import { reduceErrors } from "~/functions/reduceErrors";
import device from "~/constants/device";
import globalStyles from "~/constants/globalStyles";
import myColors from "~/constants/myColors";

const dateMask = (raw: string) => digitsMask(raw, [[2, "/"]]);

const cardNumberMask = (raw: string) =>
  digitsMask(raw, [
    [4, " "],
    [9, " "],
    [14, " "],
  ]);

const PaymentCard = () => (
  <>
    <MyHeader title="Cartão de crédito" />
    <PaymentCardBody />
  </>
);

export const PaymentCardBody = ({
  onDismiss: dismiss,
}: {
  onDismiss?: () => void;
}) => {
  const { goBack } = useRouting();
  const { accessToken } = useAuthContext();
  const { createPaymentCard } = usePaymentCardContext();
  const [isLoading, setLoading] = useState(false);
  const [savingError, setSavingError] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiration, setExpiration] = useState("");
  const [numberError, setNumberError] = useState(false);
  const [expirationError, setExpirationError] = useState(false);
  const [cvvError, setCvvError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const card = useRef({} as CreatePaymentCard);

  const inputExpiration = createRef<TextInput>();
  const inputCvv = createRef<TextInput>();
  const inputName = createRef<TextInput>();

  if (isLoading || accessToken === undefined) return <Loading />;

  if (savingError)
    return <Errors error="saving" onPress={() => setSavingError(false)} />;

  if (!accessToken)
    return <Errors title="Entre para salvar um cartão" error="missing_auth" />;

  const save = async () => {
    const { current: _card } = card;

    const hasError = reduceErrors([
      [_card.number.length < 16, setNumberError],
      [_card.expiryMonth.length < 2, setExpirationError],
      [_card.expiryYear.length < 4, setExpirationError],
      [_card.cvv.length < 3, setCvvError],
      [!_card.holderName, setNameError],
    ]);
    if (hasError) return;

    setLoading(true);
    try {
      await createPaymentCard(accessToken, _card);
      dismiss ? dismiss() : goBack("PaymentMethods");
    } catch {
      setSavingError(true);
      setLoading(false);
    }
  };

  const form = (
    <FormContainer>
      <MyInput
        label="Número do cartão"
        errorMessage={numberError ? "Insira o número" : ""}
        maxLength={19}
        value={cardNumber}
        onChangeText={(v) => {
          setNumberError(false);
          setCardNumber(cardNumberMask(v));
          card.current.number = v.replace(/\D/g, "");
        }}
        keyboardType="numeric"
        autoComplete="cc-number"
        textContentType="creditCardNumber"
        enterKeyHint="next"
        onSubmitEditing={() => inputExpiration.current?.focus()}
      />
      <View style={{ flexDirection: "row" }}>
        <MyInput
          _ref={inputExpiration}
          label="Validade"
          errorMessage={expirationError ? "Insira a validade" : ""}
          maxLength={5}
          value={expiration}
          onChangeText={(v) => {
            setExpirationError(false);
            setExpiration(dateMask(v));
            const [month, year = ""] = v.split("/");
            card.current.expiryMonth = month;
            card.current.expiryYear = `20${year}`;
          }}
          keyboardType="numeric"
          autoComplete="cc-exp"
          enterKeyHint="next"
          onSubmitEditing={() => inputCvv.current?.focus()}
          containerStyle={{ flex: 1 }}
        />
        <MyInput
          _ref={inputCvv}
          label="CVV"
          errorMessage={cvvError ? "Insira o CVV" : ""}
          maxLength={4}
          onChangeText={(v) => {
            setCvvError(false);
            card.current.cvv = v;
          }}
          keyboardType="numeric"
          autoComplete="cc-csc"
          enterKeyHint="next"
          onSubmitEditing={() => inputName.current?.focus()}
          containerStyle={{ flex: 1 }}
        />
      </View>
      <MyInput
        _ref={inputName}
        label="Nome do titular"
        errorMessage={nameError ? "Insira o nome" : ""}
        maxLength={256}
        onChangeText={(v) => {
          setNameError(false);
          card.current.holderName = v;
        }}
        autoComplete={device.web ? "cc-name" : "name"}
      />
      <MyInput
        label="Apelido do cartão (opcional)"
        labelStyle={{ color: myColors.optionalInput }}
        maxLength={256}
        onChangeText={(v) => {
          card.current.nickname = v;
        }}
      />
    </FormContainer>
  );

  return (
    <>
      {form}
      <MyButton
        title="Salvar"
        onPress={save}
        type="outline"
        buttonStyle={globalStyles.bottomButton}
      />
    </>
  );
};

export default PaymentCard;
