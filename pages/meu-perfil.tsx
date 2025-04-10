import React, { createRef, useEffect, useState } from "react";
import MyHeader from "~/components/MyHeader";
import { KeyboardAvoidingView, TextInput } from "react-native";
import { useToastContext } from "~/contexts/ToastContext";
import Loading from "~/components/Loading";
import MyButton from "~/components/MyButton";
import useRouting from "~/hooks/useRouting";
import { range } from "~/functions/range";
import { digitsMask } from "~/functions/converter";
import { useAuthContext } from "~/contexts/AuthContext";
import FormContainer from "~/components/FormContainer";
import MyInput from "~/components/MyInput";
import { api } from "~/services/api";
import device from "~/constants/device";
import globalStyles from "~/constants/globalStyles";
import myColors from "~/constants/myColors";

const onlyDigits = (s: string) => s.replace(/\D/g, "");

const cpfValidation = (raw: string) => {
  const v = onlyDigits(raw);

  // all same or sequential digits
  const knowInvalid = /^(\d)\1+$|01234567890/g;

  if (v.length !== 11 || knowInvalid.test(v)) return false;

  const verify = (pos: number) => {
    const sum = range(0, 8 + pos).reduce(
      (sum, i) => sum + +v[i] * (10 + pos - i),
      0,
    );
    const remainder = 11 - (sum % 11);
    const checkDigit = remainder > 9 ? 0 : remainder;

    return checkDigit === +v[9 + pos];
  };

  return verify(0) && verify(1);
};

const cpfMask = (raw: string) =>
  digitsMask(raw, [
    [3, "."],
    [7, "."],
    [11, "-"],
  ]);

const phoneMask = (raw: string) =>
  digitsMask(raw, [
    [0, "("],
    [3, ") "],
    [6, " "],
    [11, "-"],
  ]);

const MyProfile = () => {
  const { navigate, goBack } = useRouting();
  const { toast } = useToastContext();
  const { isAuth, accessToken } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState<string>();
  const [document, setDocument] = useState("");
  const [phone, setPhone] = useState("");
  const [nameError, setNameError] = useState(false);
  const [isCpfValid, setCpfValid] = useState(false);

  useEffect(() => {
    if (isAuth === false) return navigate("Profile");

    if (accessToken)
      api.customers.find(accessToken).then((profile) => {
        setName(profile.name);
        setDocument(profile.document ?? "");
        setPhone(profile.phone ?? "");

        setIsLoading(false);
      });
  }, [isAuth, accessToken, navigate]);

  const inputEmail = createRef<TextInput>();
  const inputCPF = createRef<TextInput>();
  const inputPhone = createRef<TextInput>();

  if (isLoading || !accessToken || !name) return <Loading />;

  const page = (
    <>
      <MyHeader title="Meu Perfil" />
      <FormContainer>
        <MyInput
          label="Nome Completo"
          placeholder="Seu nome"
          defaultValue={name}
          errorMessage={nameError ? "Insira seu nome" : ""}
          autoComplete="name"
          textContentType="name"
          onChangeText={(t) => {
            setName(t);
            setNameError(!t);
          }}
          enterKeyHint="next"
          onSubmitEditing={() => inputEmail.current?.focus()}
        />
        <MyInput
          _ref={inputCPF}
          label="CPF"
          placeholder="000.000.000-00"
          errorMessage={
            document.length === 14 && !isCpfValid ? "CPF inválido" : ""
          }
          keyboardType="numeric"
          labelStyle={{ color: myColors.optionalInput }}
          maxLength={14}
          value={cpfMask(document)}
          onChangeText={(v) => {
            setDocument(v);
            setCpfValid(cpfValidation(v));
          }}
          enterKeyHint="next"
          onSubmitEditing={() => inputPhone.current?.focus()}
        />
        <MyInput
          _ref={inputPhone}
          label="Número de celular"
          placeholder="(00) 0 0000-0000"
          keyboardType="phone-pad"
          labelStyle={{ color: myColors.optionalInput }}
          autoComplete="tel"
          textContentType="telephoneNumber"
          maxLength={16}
          value={phoneMask(phone)}
          onChangeText={(v) => {
            setPhone(v);
          }}
        />
      </FormContainer>
      <MyButton
        title="Atualizar perfil"
        type="outline"
        buttonStyle={globalStyles.bottomButton}
        disabled={nameError}
        onPress={() => {
          setIsLoading(true);

          api.customers
            .update(accessToken, {
              name,
              document: document || undefined,
              phone: phone || undefined,
            })
            .then(() => {
              toast("Perfil atualizado");
              goBack("Profile");
            });
        }}
      />
    </>
  );

  if (device.web) return page;

  return (
    <KeyboardAvoidingView
      behavior="height"
      style={{ marginBottom: device.iPhoneNotch ? 28 : 0, flex: 1 }}
    >
      {page}
    </KeyboardAvoidingView>
  );
};

export default MyProfile;
