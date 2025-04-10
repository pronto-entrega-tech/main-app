import React from "react";
import { View } from "react-native";
import MyHeader from "~/components/MyHeader";
import { WithBottomNav } from "~/components/Layout";
import MyText from "~/components/MyText";
import globalStyles from "~/constants/globalStyles";
import myColors from "~/constants/myColors";

const Notifications = () => (
  <>
    <MyHeader title="Notificações" />
    <View
      style={[
        globalStyles.centralizer,
        { backgroundColor: myColors.background },
      ]}
    >
      <MyText style={{ fontSize: 15, color: myColors.text2 }}>
        Nenhuma notificação ainda
      </MyText>
    </View>
  </>
);

export default WithBottomNav(Notifications);
