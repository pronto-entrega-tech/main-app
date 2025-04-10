import React, { ReactNode, useCallback, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import MyButton from "~/components/MyButton";
import MyIcon, { IconNames } from "~/components/MyIcon";
import MyDivider from "~/components/MyDivider";
import { WithBottomNav } from "~/components/Layout";
import MyText from "~/components/MyText";
import useFocusEffect from "~/hooks/useFocusEffect";
import Loading from "~/components/Loading";
import { useAuthContext } from "~/contexts/AuthContext";
import { api } from "~/services/api";
import { PageTitle } from "~/components/PageTitle";
import globalStyles from "~/constants/globalStyles";
import myColors from "~/constants/myColors";
import myFonts from "~/constants/myFonts";

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

  return (
    <>
      <PageTitle title="Perfil" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={globalStyles.notch}
        contentContainerStyle={{ paddingBottom: 68 }}
      >
        <View style={styles.header}>
          <MyIcon
            name="account-circle-outline"
            color={myColors.grey4}
            size={100}
          />
          <MyText style={styles.name}>{profileName ?? "Convidado"}</MyText>
        </View>

        <Card>
          <CardItem
            top
            icon="account"
            title={isAuth ? "Meu Perfil" : "Entrar ou cadastrar-se"}
            screen={isAuth ? "MyProfile" : "SignIn"}
          />
          <CardItem
            icon="map-marker"
            title="Endereços salvos"
            screen="Addresses"
          />
          <CardItem icon="bell" title="Notificações" screen="Notifications" />
          {isAuth && (
            <CardItem
              icon="credit-card-outline"
              title="Meios de pagamento"
              screen="PaymentMethods"
            />
          )}
        </Card>

        <Card>
          <CardItem
            top
            icon="help-circle"
            title="Central de ajuda"
            screen="Help"
          />
          <CardItem icon="cog" title="Configurações" screen="Config" />
          <CardItem
            icon="store"
            title="Sugerir estabelecimento"
            screen="Suggestion"
          />
          {isAuth && (
            <CardItem
              icon="monitor-cellphone"
              title="Dispositivos conectados"
              screen="Devices"
            />
          )}
        </Card>
      </ScrollView>
    </>
  );
};

function Card({ children }: { children: ReactNode }) {
  return (
    <View
      style={[styles.card, globalStyles.elevation3, globalStyles.darkBorder]}
    >
      {children}
    </View>
  );
}

function CardItem(p: {
  icon: IconNames;
  title: string;
  screen: string;
  top?: boolean;
}) {
  return (
    <>
      {!p.top && <MyDivider style={styles.divider} />}
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
          screen={p.screen}
          title={p.title}
          icon={{
            name: p.icon,
            size: 28,
          }}
          buttonStyle={styles.button}
          titleStyle={{
            color: myColors.text2,
            fontSize: 17,
            marginLeft: 6,
          }}
          type="clear"
        />
      </View>
    </>
  );
}

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
    overflow: "hidden",
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
