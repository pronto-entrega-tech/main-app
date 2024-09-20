import React, { createRef, useState } from "react";
import { TextInput } from "react-native";
import MyHeader from "~/components/MyHeader";
import MyButton from "~/components/MyButton";
import { myColors, globalStyles } from "~/constants";
import { useToastContext } from "~/contexts/ToastContext";
import { reduceErrors } from "~/functions/reduceErrors";
import useRouting from "~/hooks/useRouting";
import FormContainer from "~/components/FormContainer";
import MyInput from "~/components/MyInput";

const Suggestion = () => {
  const routing = useRouting();
  const { toast } = useToastContext();
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState(false);

  const inputCity = createRef<TextInput>();
  const inputPhone = createRef<TextInput>();

  const send = () => {
    const hasError = reduceErrors([
      [!name, setNameError],
      [!city, setCityError],
    ]);
    if (hasError) return;

    toast("Sugestão enviada");
    routing.goBack();
  };

  return (
    <>
      <MyHeader title="Sugerir estabelecimento" />
      <FormContainer>
        <MyInput
          label="Nome do estabelecimento"
          errorMessage={nameError ? "Insira o nome" : ""}
          onChangeText={(v) => {
            setNameError(false);
            setName(v);
          }}
          enterKeyHint="next"
          onSubmitEditing={() => inputCity.current?.focus()}
        />
        <MyInput
          _ref={inputCity}
          label="Cidade"
          errorMessage={cityError ? "Insira a cidade" : ""}
          onChangeText={(v) => {
            setCityError(false);
            setCity(v);
          }}
          enterKeyHint="next"
          onSubmitEditing={() => inputPhone.current?.focus()}
        />
        <MyInput
          _ref={inputPhone}
          label="Telefone para contato"
          keyboardType="phone-pad"
          labelStyle={{ color: myColors.optionalInput }}
          enterKeyHint="send"
          onSubmitEditing={send}
        />
      </FormContainer>
      <MyButton
        onPress={send}
        title="Enviar"
        type="outline"
        buttonStyle={globalStyles.bottomButton}
      />
    </>
  );
};

export default Suggestion;
