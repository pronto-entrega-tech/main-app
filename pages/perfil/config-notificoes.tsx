import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Header from '~/components/Header';
import { WithBottomNav } from '~/components/Layout';
import Loading from '~/components/Loading';
import MyDivider from '~/components/MyDivider';
import Switch from '~/components/Switch';
import { myColors } from '~/constants';
import { getConfigNoti, saveConfigNoti } from '~/core/dataStorage';

function ConfigNoti() {
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
    getConfigNoti().then((savedConfig) => {
      setConfig((base) => new Map([...base, ...savedConfig]));
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <Loading />;

  function ConfigSwitch(configTitle: string) {
    return (
      <View key={configTitle}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
          }}>
          <Text style={{ color: myColors.grey3, fontSize: 17 }}>
            {configTitle}
          </Text>
          <Switch
            value={config.get(configTitle)}
            onValueChange={(v) => {
              const _configState = new Map([...config, [configTitle, v]]);
              setConfig(_configState);
              saveConfigNoti(_configState);
            }}
            color={myColors.colorAccent}
          />
        </View>
        <MyDivider style={styles.divider} />
      </View>
    );
  }

  const configOptions = Array.from(config.keys());
  return (
    <>
      <Header title={'Gerenciar notificações'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ backgroundColor: myColors.background }}>
        {configOptions.map(ConfigSwitch)}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  divider: {
    backgroundColor: myColors.divider3,
    marginHorizontal: 16,
  },
});

export default WithBottomNav(ConfigNoti);
