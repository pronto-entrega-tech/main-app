import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { myColors, globalStyles, AppInfo, myFonts } from "~/constants";
import MyButton from "~/components/MyButton";
import MyDivider from "~/components/MyDivider";
import MyIcon from "~/components/MyIcon";
import useRouting from "~/hooks/useRouting";
import MyHeader from "~/components/MyHeader";
import { WithBottomNav } from "~/components/Layout";
import { arrayConditional } from "~/functions/conditionals";
import MyText from "~/components/MyText";
import { useAuthContext } from "~/contexts/AuthContext";

const Config = () => {
  const { replace } = useRouting();
  const { isAuth, signOut } = useAuthContext();

  const signOutAndLeave = async () => {
    await signOut();
    replace("SignIn");
  };

  const options = [
    { title: "Gerenciar notificações", screen: "NotifConfig" },
    { title: "Políticas de privacidade" },
    { title: "Termos de uso" },
    ...arrayConditional(isAuth)({
      title: "Sair da conta",
      onPress: signOutAndLeave,
    }),
  ];

  const optionItems = options.map((option, index) => (
    <View key={index}>
      {index !== 0 && <MyDivider style={styles.divider} />}
      <View style={{ justifyContent: "center" }}>
        <MyIcon
          style={{ position: "absolute", alignSelf: "flex-end" }}
          name="chevron-right"
          size={32}
          color={myColors.grey2}
        />
        <MyButton
          {...option}
          buttonStyle={
            index === 0
              ? styles.top
              : index === options.length - 1
                ? styles.bottom
                : { borderRadius: 0 }
          }
          titleStyle={{ color: myColors.text, fontSize: 17 }}
          type="clear"
        />
      </View>
    </View>
  ));

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
          {optionItems}
        </View>
        <MyText style={styles.versionText}>
          Versão {AppInfo.version} ({AppInfo.android.versionCode})
        </MyText>
      </ScrollView>
    </>
  );
};

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
