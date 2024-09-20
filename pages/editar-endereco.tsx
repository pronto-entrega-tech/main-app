import React, { useState, useEffect, createRef } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { geocodeAsync } from "expo-location";
import Loading from "~/components/Loading";
import MyButton from "~/components/MyButton";
import MyPicker from "~/components/MyPicker";
import { myColors, device, myFonts, globalStyles } from "~/constants";
import { useToastContext } from "~/contexts/ToastContext";
import useRouting from "~/hooks/useRouting";
import { reduceErrors } from "~/functions/reduceErrors";
import { Address } from "~/core/models";
import MyHeader from "~/components/MyHeader";
import { useAddressContext } from "~/contexts/AddressContext";
import { useAuthContext } from "~/contexts/AuthContext";
import MyInput from "~/components/MyInput";
import FormContainer from "~/components/FormContainer";
import { api } from "~/services/api";

const blankAddress = (): Address => ({
  id: "",
  street: "",
  number: "",
  district: "",
  city: "Jataí",
  state: "GO",
});

const NewAddress = () => {
  const { toast } = useToastContext();
  const { params, navigate, goBack } = useRouting();
  const { isAuth, accessToken } = useAuthContext();
  const { addresses, loadAddresses, createAddress, updateAddress } =
    useAddressContext();
  const [isLoading, setLoading] = useState(false);
  /* const [{ address, addressIndex = 0 }, setAddress] = useState<{
    address?: Address;
    addressIndex?: number;
  }>({}); */
  const [streetError, setStreetError] = useState(false);
  const [numberError, setNumberError] = useState(false);
  const [districtError, setDistrictError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [stateError, setStateError] = useState(false);

  const inputStreet = createRef<TextInput>();
  const inputNumber = createRef<TextInput>();
  const inputDistrict = createRef<TextInput>();

  const addressId = params.i;
  const isNew = addressId === undefined;

  const getAddressAndIndex = () => {
    if (!addresses) return;

    const i = addresses.findIndex((a) => a.id === addressId);
    return {
      address: addresses[i] ?? blankAddress(),
      addressIndex: i > 0 ? i : 0,
    };
  };
  const { address, addressIndex = 0 } = getAddressAndIndex() ?? {};

  useEffect(() => {
    if (isAuth === false) navigate("SignIn");
    if (!accessToken) return;

    if (!addresses) loadAddresses(accessToken);
  }, [isAuth, accessToken, addressId, addresses, loadAddresses, navigate]);

  if (!address || !accessToken || isLoading)
    return <Loading title={isLoading ? "Salvando endereço..." : undefined} />;

  const saveAddress = async () => {
    const wrongValues = [undefined, "", "-"];
    const errs = (
      [
        [address.street, setStreetError],
        [address.number, setNumberError],
        [address.district, setDistrictError],
        [address.city, setCityError],
        [address.state, setStateError],
      ] as const
    ).map(([v, f]) => [wrongValues.includes(v), f] as const);

    const hasError = reduceErrors(errs);
    if (hasError) return;

    setLoading(true);

    const a = address;
    const stringAddress = `${a.street},${a.number},${a.district},${a.city},${a.state}`;

    if (device.web) {
      const { lat, lng } = await api.location.geocode(stringAddress);
      address.coords = { lat, lng };
    } else {
      const [{ latitude, longitude }] = await geocodeAsync(stringAddress);
      address.coords = { lat: latitude, lng: longitude };
    }

    const _address: Address = {
      ...address,
      nickname: address.nickname || null,
      complement: address.complement || null,
    };

    isNew
      ? await createAddress(accessToken, _address)
      : await updateAddress(accessToken, _address);

    toast("Endereço salvo");
    goBack();
  };

  return (
    <>
      <MyHeader title={isNew ? "Novo endereço" : "Editar endereço"} />
      <FormContainer>
        <MyInput
          label="Apelido do endereço"
          labelStyle={{ color: myColors.optionalInput }}
          placeholder={!device.web ? `Endereço ${addressIndex + 1}` : ""}
          onChangeText={(text) => (address.nickname = text)}
          defaultValue={address.nickname ?? undefined}
          enterKeyHint="next"
          onSubmitEditing={() => inputStreet.current?.focus()}
        />
        <MyInput
          _ref={inputStreet}
          label="Rua"
          errorMessage={streetError ? "Insira uma rua" : ""}
          onChangeText={(text) => {
            address.street = text;
            setStreetError(false);
          }}
          defaultValue={address.street}
          autoComplete={"address-line1"}
          textContentType="streetAddressLine1"
          enterKeyHint="next"
          onSubmitEditing={() => inputNumber.current?.focus()}
        />
        <MyInput
          _ref={inputNumber}
          label="Número"
          errorMessage={numberError ? "Insira um número" : ""}
          onChangeText={(text) => {
            address.number = text;
            setNumberError(false);
          }}
          defaultValue={address.number}
          keyboardType="numeric"
          autoComplete={"address-line2"}
          textContentType="streetAddressLine2"
          enterKeyHint="next"
          onSubmitEditing={() => inputDistrict.current?.focus()}
        />
        <MyInput
          _ref={inputDistrict}
          label="Bairro"
          errorMessage={districtError ? "Insira um bairro" : ""}
          onChangeText={(text) => {
            address.district = text;
            setDistrictError(false);
          }}
          defaultValue={address.district}
          textContentType="sublocality"
        />
        <View style={{ flexDirection: "row" }}>
          <MyPicker
            label="Cidade"
            style={{ flex: 2 }}
            errorMessage={cityError ? "Insira uma cidade" : ""}
            items={["Jataí", "Rio verde"]}
            selectedValue={address.city}
            onValueChange={(v) => {
              address.city = v;
              setCityError(false);
            }}
          />
          <MyPicker
            label="Estado"
            style={{ flex: 1 }}
            errorMessage={stateError ? "Insira um estado" : ""}
            items={["GO"]}
            selectedValue={address.state}
            onValueChange={(v) => {
              address.state = v;
              setStateError(false);
            }}
          />
        </View>
        <MyInput
          label="Complemento"
          labelStyle={{ color: myColors.optionalInput }}
          inputContainerStyle={styles.inputLine}
          onChangeText={(text) => (address.complement = text)}
          defaultValue={address.complement ?? undefined}
          textContentType="location"
        />
      </FormContainer>
      <MyButton
        title="Salvar endereço"
        onPress={saveAddress}
        type="outline"
        buttonStyle={globalStyles.bottomButton}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: myColors.background,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 66,
  },
  label: {
    color: myColors.primaryColor,
    marginBottom: 0,
    marginLeft: 10,
    alignSelf: "flex-start",
    fontSize: 16,
    fontFamily: myFonts.Bold,
  },
  inputLine: { borderBottomColor: "#aaa" },
});

export default NewAddress;
