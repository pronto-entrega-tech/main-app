import React from 'react';
import { View, Text } from 'react-native';
import { WithPaymentTabBar } from '~/components/Layout';
import { globalStyles, myColors } from '~/constants';

function PaymentInApp() {
  return (
    <>
      <View
        style={[
          globalStyles.centralizer,
          {
            backgroundColor: myColors.background,
          },
        ]}>
        <Text style={{ fontSize: 15, color: myColors.text2 }}>
          Nenhum meio de pagamento ainda
        </Text>
      </View>
    </>
  );
}

export { PaymentInApp };
export default WithPaymentTabBar(PaymentInApp);
