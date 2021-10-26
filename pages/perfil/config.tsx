import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { myColors, globalStyles, AppInfo } from '~/constants';
import { saveOrdersList, saveUserStatus } from '~/core/dataStorage';
import useMyContext from '~/core/MyContext';
import MyButton from '~/components/MyButton';
import MyDivider from '~/components/MyDivider';
import MyIcon from '~/components/MyIcon';
import useRouting from '~/hooks/useRouting';
import Header from '~/components/Header';
import { WithBottomNav } from '~/components/Layout';

function Config() {
  const routing = useRouting();
  const { isGuest, setIsGuest, toast } = useMyContext();

  const Remove = async () => {
    await saveOrdersList([]);
    toast('Apagado');
  };

  const LogOut = () => {
    saveUserStatus('returning');
    setIsGuest(true);
    routing.replace({
      screen: 'SignIn',
      path: '/entrar',
    });
  };

  const optionsBase = [
    { title: 'Gerenciar notificações', path: '/perfil/config-notificoes' },
    { title: 'Apagar histórico de pesquisa', onPress: Remove },
    { title: 'Politicas de privacidade' },
    { title: 'Termos de uso' },
    { title: 'Fale conosco' },
  ];
  const options = isGuest
    ? optionsBase
    : [...optionsBase, { title: 'Sair da conta', onPress: LogOut }];

  return (
    <>
      <Header title={'Configurações'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 58 }}>
        <View
          style={[
            styles.card,
            globalStyles.elevation3,
            globalStyles.darkBorder,
          ]}>
          {options.map((option, index) => (
            <View key={index}>
              {index !== 0 && <MyDivider style={styles.divider} />}
              <View style={{ justifyContent: 'center' }}>
                <MyIcon
                  style={{ position: 'absolute', alignSelf: 'flex-end' }}
                  name='chevron-right'
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
                  type='clear'
                />
              </View>
            </View>
          ))}
        </View>
        <Text style={styles.versionText}>
          Versão {AppInfo.version} ({AppInfo.android.versionCode})
        </Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    height: 48,
  },
  headerDivider: {
    marginTop: 47,
    backgroundColor: myColors.divider3,
    height: 1,
    marginHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
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
    fontWeight: 'bold',
    alignSelf: 'center',
    position: 'absolute',
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
