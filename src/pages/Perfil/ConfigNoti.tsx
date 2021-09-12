import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Divider } from 'react-native-elements';
import { Switch } from 'react-native-paper';
import { myColors } from '~/constants';

interface configModel {
  text: string;
  navigate: string;
  isEnabled: boolean;
  setIsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

function ConfigNoti() {
  const [isEnabled1, setIsEnabled1] = useState(true);
  const [isEnabled2, setIsEnabled2] = useState(true);
  const [isEnabled3, setIsEnabled3] = useState(true);
  const [isEnabled4, setIsEnabled4] = useState(true);
  const [isEnabled5, setIsEnabled5] = useState(true);
  const data: configModel[] = [
    {
      text: 'Notificações',
      navigate: 'ConfigNotificoes',
      isEnabled: isEnabled1,
      setIsEnabled: setIsEnabled1,
    },
    {
      text: 'Email',
      navigate: 'ConfigNotificoes',
      isEnabled: isEnabled2,
      setIsEnabled: setIsEnabled2,
    },
    {
      text: 'SMS',
      navigate: 'ConfigNotificoes',
      isEnabled: isEnabled3,
      setIsEnabled: setIsEnabled3,
    },
    {
      text: 'WhatsApp',
      navigate: 'ConfigNotificoes',
      isEnabled: isEnabled4,
      setIsEnabled: setIsEnabled4,
    },
    {
      text: 'Telegram',
      navigate: 'ConfigNotificoes',
      isEnabled: isEnabled5,
      setIsEnabled: setIsEnabled5,
    },
  ];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ backgroundColor: myColors.background }}>
      {data.map((item, index) => (
        <View key={index}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 16,
            }}>
            <Text style={{ color: myColors.grey3, fontSize: 17 }}>
              {item.text}
            </Text>
            <Switch
              color={myColors.colorAccent}
              onValueChange={(value) => item.setIsEnabled(value)}
              value={item.isEnabled}
            />
          </View>
          <Divider style={styles.divider} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  divider: {
    backgroundColor: myColors.divider3,
    height: 1,
    marginHorizontal: 16,
  },
});

export default ConfigNoti;
