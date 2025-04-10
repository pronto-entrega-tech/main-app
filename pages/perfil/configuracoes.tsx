import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import MyButton from "~/components/MyButton";
import MyDivider from "~/components/MyDivider";
import MyIcon from "~/components/MyIcon";
import useRouting from "~/hooks/useRouting";
import MyHeader from "~/components/MyHeader";
import { WithBottomNav } from "~/components/Layout";
import MyText from "~/components/MyText";
import { useAuthContext } from "~/contexts/AuthContext";
import globalStyles from "~/constants/globalStyles";
import myColors from "~/constants/myColors";
import myFonts from "~/constants/myFonts";
import appInfo from "~/constants/appInfo";
import { useAlertContext } from "~/contexts/AlertContext";

const Config = () => {
  const { alert } = useAlertContext();
  const { replace } = useRouting();
  const { isAuth, signOut } = useAuthContext();

  const signOutAndLeave = async () => {
    await signOut();
    replace("SignIn");
  };

  return (
    <>
      <MyHeader title="Configurações" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 58 }}
      >
        <View
          style={[
            styles.card,
            globalStyles.elevation3,
            globalStyles.darkBorder,
          ]}
        >
          <Tile title="Gerenciar notificações" screen="NotifConfig" />
          <Tile title="Políticas de privacidade" onPress={() => alert("WIP")} />
          <Tile title="Termos de uso" onPress={() => alert("WIP")} />
          {isAuth && <Tile title="Sair da conta" onPress={signOutAndLeave} />}
        </View>

        <MyText style={styles.versionText}>
          Versão {appInfo.version} ({appInfo.android.versionCode})
        </MyText>
      </ScrollView>
    </>
  );
};

function Tile({
  top,
  title,
  ...props
}: {
  top?: boolean;
  title: string;
} & ({ screen: string } | { onPress: () => void })) {
  return (
    <View>
      {!top && <MyDivider style={styles.divider} />}
      <View style={{ justifyContent: "center" }}>
        <MyIcon
          style={{ position: "absolute", alignSelf: "flex-end" }}
          name="chevron-right"
          size={32}
          color={myColors.grey2}
        />
        <MyButton
          title={title}
          {...props}
          titleStyle={{ color: myColors.text, fontSize: 17 }}
          type="clear"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: "center",
    height: 48,
  },
  headerDivider: {
    marginTop: 47,
    backgroundColor: myColors.divider3,
    height: 1,
    marginHorizontal: 16,
  },
  card: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  divider: {
    backgroundColor: myColors.divider3,
    height: 1,
    marginHorizontal: 8,
  },
  textHeader: {
    color: myColors.primaryColor,
    fontSize: 20,
    fontFamily: myFonts.Bold,
    alignSelf: "center",
    position: "absolute",
  },
  versionText: {
    marginLeft: 16,
    color: myColors.text2,
    fontSize: 15,
  },
  top: {
    borderRadius: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  bottom: {
    borderRadius: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
});

export default WithBottomNav(Config);
