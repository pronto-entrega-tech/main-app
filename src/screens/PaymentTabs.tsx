import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { KeyboardAvoidingView, View } from "react-native";
import MyHeader from "~/components/MyHeader";
import { PaymentOnApp } from "@pages/pagamento";
import Portal from "~/components/Portal";
import PaymentOnDelivery from "./PaymentOnDelivery";
import device, { appOrSite, notchHeight } from "~/constants/device";
import useRouting from "~/hooks/useRouting";
import { myTitle } from "~/constants/appInfo";
import myColors from "~/constants/myColors";

const Tab = createMaterialTopTabNavigator();

const PaymentTabs = () => {
  const { params } = useRouting();

  const paymentTabs = (
    <Portal.Host>
      <View
        style={{
          height: notchHeight,
          backgroundColor: myColors.background,
        }}
      />
      <MyHeader title="Pagamento" dividerLess notchLess />
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={{
            title: myTitle,
            tabBarActiveTintColor: myColors.text3,
            tabBarIndicatorStyle: { backgroundColor: myColors.primaryColor },
          }}
        >
          <Tab.Screen
            name="PaymentInApp"
            options={{ tabBarLabel: `Pagar pelo ${appOrSite}` }}
            component={PaymentOnApp}
            initialParams={params.params}
          />
          <Tab.Screen
            name="PaymentOnDelivery"
            options={{ tabBarLabel: "Pagar na entrega" }}
            component={PaymentOnDelivery}
            initialParams={params.params}
          />
        </Tab.Navigator>
      </View>
    </Portal.Host>
  );

  if (device.iOS)
    return (
      <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
        {paymentTabs}
      </KeyboardAvoidingView>
    );

  return paymentTabs;
};

export default PaymentTabs;
