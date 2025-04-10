import React from "react";
import { View } from "react-native";
import { WithBottomNav } from "~/components/Layout";
import MyHeader from "~/components/MyHeader";
import MyText from "~/components/MyText";
import globalStyles from "~/constants/globalStyles";
import myColors from "~/constants/myColors";

const Cupons = () => (
  <>
    <MyHeader title="Cupons" smallDivider />
    <View style={globalStyles.centralizer}>
      <MyText style={{ fontSize: 15, color: myColors.text2 }}>
        Nenhum cupom ainda
      </MyText>
    </View>
  </>
);

// to the route outside Home
export { Cupons };

export default WithBottomNav(Cupons);
