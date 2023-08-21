import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import MyHeader from '~/components/MyHeader';
import { WithBottomNav } from '~/components/Layout';
import Loading from '~/components/Loading';
import MyDivider from '~/components/MyDivider';
import Switch from '~/components/Switch';
import { myColors } from '~/constants';
import { getNotifConfig, saveNotifConfig } from '~/core/dataStorage';
import MyText from '~/components/MyText';

const NotifConfig = () => {
  const configBase = new Map([
    ['Notificações', true],
    ['Email', true],
    ['SMS', true],
    ['WhatsApp', true],
    ['Telegram', true],
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState(configBase);

  useEffect(() => {
    getNotifConfig().then((savedConfig) => {
      setConfig((base) => new Map([...base, ...savedConfig]));
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <Loading />;

  const ConfigSwitch = (configTitle: string) => (
    <View key={configTitle}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 16,
        }}>
        <MyText style={{ color: myColors.grey3, fontSize: 17 }}>
          {configTitle}
        </MyText>
        <Switch
          value={config.get(configTitle)}
          onValueChange={(v) => {
            const _configState = new Map([...config, [configTitle, v]]);
            setConfig(_configState);
            saveNotifConfig(_configState);
          }}
        />
      </View>
      <MyDivider style={styles.divider} />
    </View>
  );

  const configOptions = Array.from(config.keys());
  return (
    <>
      <MyHeader title='Gerenciar notificações' />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ backgroundColor: myColors.background }}>
        {configOptions.map(ConfigSwitch)}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  divider: {
    backgroundColor: myColors.divider3,
    marginHorizontal: 16,
  },
});

export default WithBottomNav(NotifConfig);
