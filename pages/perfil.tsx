import React, { useCallback, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import MyButton from "~/components/MyButton";
import { myColors, globalStyles, myFonts } from "~/constants";
import MyIcon from "~/components/MyIcon";
import MyDivider from "~/components/MyDivider";
import { WithBottomNav } from "~/components/Layout";
import MyText from "~/components/MyText";
import useFocusEffect from "~/hooks/useFocusEffect";
import { arrayConditional } from "~/functions/conditionals";
import Loading from "~/components/Loading";
import { useAuthContext } from "~/contexts/AuthContext";
import { api } from "~/services/api";

const Profile = () => {
  const [profileName, setProfileName] = useState<string>();
  const { isAuth, accessToken } = useAuthContext();

  useFocusEffect(
    useCallback(() => {
      if (accessToken)
        api.customers
          .find(accessToken)
          .then(({ name }) => setProfileName(name));
    }, [accessToken]),
  );

  if (isAuth === undefined || (isAuth && !profileName)) return <Loading />;

  const card1 = [
    {
      icon: "account",
      title: isAuth ? "Meu Perfil" : "Entrar ou cadastrar-se",
      screen: isAuth ? "MyProfile" : "SignIn",
    },
    {
      icon: "map-marker",
      title: "Endereços salvos",
      screen: "Addresses",
    },
    {
      icon: "bell",
      title: "Notificações",
      screen: "Notifications",
    },
    ...arrayConditional(isAuth)({
      icon: "credit-card-outline",
      title: "Meios de pagamento",
      screen: "PaymentMethods",
    } as const),
  ] as const;
  const card2 = [
    {
      icon: "help-circle",
      title: "Central de ajuda",
      screen: "Help",
    },
    {
      icon: "cog",
      title: "Configurações",
      screen: "Config",
    },
    {
      icon: "store",
      title: "Sugerir estabelecimento",
      screen: "Suggestion",
    },
    ...arrayConditional(isAuth)({
      icon: "monitor-cellphone",
      title: "Dispositivos conectados",
      screen: "Devices",
    } as const),
  ] as const;

  const cards = [card1, card2].map((row, index) => (
    <View
      key={index}
      style={[styles.card, globalStyles.elevation3, globalStyles.darkBorder]}
    >
      {row.map((item, index) => (
        <View key={index}>
          {index !== 0 && <MyDivider style={styles.divider} />}
          <View style={{ justifyContent: "center" }}>
            <MyIcon
              style={{
                position: "absolute",
                alignSelf: "flex-end",
                right: 4,
              }}
              name="chevron-right"
              size={32}
              color={myColors.grey2}
            />
            <MyButton
              screen={item.screen}
              title={item.title}
              icon={{
                name: item.icon,
                size: 28,
              }}
              buttonStyle={[
                styles.button,
                index === 0
                  ? styles.top
                  : index === row.length - 1
                    ? styles.bottom
                    : styles.mid,
              ]}
              titleStyle={{
                color: myColors.text2,
                fontSize: 17,
                marginLeft: 6,
              }}
              type="clear"
            />
          </View>
        </View>
      ))}
    </View>
  ));

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={globalStyles.notch}
      contentContainerStyle={{ paddingBottom: 68 }}
    >
      <>
        <View style={styles.header}>
          <MyIcon
            name="account-circle-outline"
            color={myColors.grey4}
            size={100}
          />
          <MyText style={styles.name}>{profileName ?? "Convidado"}</MyText>
        </View>
        {cards}
      </>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 30,
    paddingBottom: 22,
    paddingTop: 18,
  },
  name: {
    fontSize: 22,
    color: myColors.grey4,
    fontFamily: myFonts.Bold,
    marginLeft: 16,
    flexShrink: 1,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  top: {
    borderRadius: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  mid: {
    borderRadius: 0,
  },
  bottom: {
    borderRadius: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  divider: {
    backgroundColor: myColors.divider3,
    marginHorizontal: 8,
  },
  button: {
    justifyContent: "flex-start",
    paddingLeft: 10,
    paddingVertical: 9,
  },
});

export default WithBottomNav(Profile);
