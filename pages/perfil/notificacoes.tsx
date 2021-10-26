import React from 'react';
import { View, Text } from 'react-native';
import Header from '~/components/Header';
import { WithBottomNav } from '~/components/Layout';
import { globalStyles, myColors } from '~/constants';

function Notifications() {
  return (
    <>
      <Header title={'Notificações'} />
      <View
        style={[
          globalStyles.centralizer,
          {
            backgroundColor: myColors.background,
          },
        ]}>
        <Text style={{ fontSize: 15, color: myColors.text2 }}>
          Nenhuma notificação ainda
        </Text>
      </View>
    </>
  );
}

export default WithBottomNav(Notifications);
