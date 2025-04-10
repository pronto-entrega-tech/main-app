import React from "react";
import { View, StyleSheet, Image } from "react-native";
import MyButton from "~/components/MyButton";
import MyText from "~/components/MyText";
import useRouting from "~/hooks/useRouting";
import {
  saveActiveAddress,
  saveActiveAddressId,
} from "~/services/localStorage";
import { Address } from "~/core/models";
import { useMediaQuery } from "~/hooks/useMediaQuery";
import globalStyles from "~/constants/globalStyles";
import images from "~/constants/images";
import myColors from "~/constants/myColors";
import myFonts from "~/constants/myFonts";

const saveCity = async (p: { city: string; state: string }) => {
  const address: Address = {
    id: "",
    nickname: "",
    street: "",
    number: "",
    district: "",
    city: p.city,
    state: p.state,
  };
  await Promise.all([saveActiveAddressId(null), saveActiveAddress(address)]);
};

const cities = [{ city: "Jataí", state: "GO" }];

const Main = () => {
  const routing = useRouting();
  const { isTablet } = useMediaQuery();

  const titleSize = { fontSize: isTablet ? 20 : 18 };
  const title = { fontSize: isTablet ? 32 : 28 };
  const subtitle = { fontSize: isTablet ? 22 : 20 };

  return (
    <View style={{ backgroundColor: myColors.background }}>
      <View style={{ backgroundColor: "#f8f8f8" }}>
        <MyButton
          title="Entrar"
          type="clear"
          titleStyle={titleSize}
          buttonStyle={styles.loginButton}
          screen="SignIn"
        />
        <Image {...images.pineapple} style={styles.pineapple} alt="" />
        <Image {...images.tomato} style={styles.tomato} alt="" />
        <Image {...images.broccoli} style={styles.broccoli} alt="" />
        <Image
          {...images.logo}
          style={styles.logo}
          alt="Logo do ProntoEntrega"
        />
        <MyText style={[styles.title, title]}>
          Faça suas compras sem sair de casa
        </MyText>
        <MyText style={[styles.subtitle, subtitle]}>
          Veja mercados perto de você
        </MyText>
        <MyButton
          title="Insira seu endereço"
          titleStyle={titleSize}
          buttonStyle={[styles.button, globalStyles.elevation4]}
          icon={{
            name: "map-marker",
            color: myColors.background,
            style: { marginRight: 3 },
          }}
          screen="SelectAddress"
        />
      </View>
      <MyText style={[styles.cityText, titleSize]}>Escolha uma cidade</MyText>
      {cities.map((item) => (
        <MyButton
          key={item.city}
          title={item.city}
          type="clear"
          titleStyle={titleSize}
          buttonStyle={styles.cityButton}
          onPress={async () => {
            await saveCity(item);
            routing.navigate("Home");
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  titleLoginButton: {
    fontSize: 18,
  },
  titleButton: {
    fontSize: 18,
  },
  loginButton: {
    position: "absolute",
    alignSelf: "flex-end",
    marginRight: 8,
    marginTop: 8,
  },
  pineapple: {
    position: "absolute",
    alignSelf: "flex-start",
    marginLeft: 25,
    top: -50,
    width: 170,
    height: 160,
  },
  tomato: {
    alignSelf: "flex-end",
    position: "absolute",
    marginTop: 50,
    width: 60,
    height: 120,
  },
  broccoli: {
    position: "absolute",
    left: -65,
    marginTop: 180,
    width: 130,
    height: 130,
  },
  logo: {
    alignSelf: "center",
    marginTop: 120,
    width: 160,
    height: 160,
  },
  title: {
    minHeight: 50,
    marginTop: 28,
    alignSelf: "center",
    textAlign: "center",
    color: myColors.text4,
    marginHorizontal: 36,
    lineHeight: 34,
    fontFamily: myFonts.Medium,
  },
  subtitle: {
    marginTop: 14,
    alignSelf: "center",
    textAlign: "center",
    color: myColors.text4,
    marginHorizontal: 32,
  },
  button: {
    alignSelf: "center",
    width: "90%",
    maxWidth: 600,
    height: 52,
    marginTop: 30,
    marginBottom: 18,
  },
  cityText: {
    marginTop: 16,
    marginLeft: "5%",
    fontWeight: "500",
    color: myColors.text4,
  },
  cityButton: {
    left: -8,
    marginLeft: "5%",
    alignSelf: "flex-start",
  },
});

export default Main;
