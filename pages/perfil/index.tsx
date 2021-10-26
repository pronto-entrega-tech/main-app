import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import MyButton from '~/components/MyButton';
import { myColors, globalStyles } from '~/constants';
import { getProfile } from '~/core/dataStorage';
import useMyContext from '~/core/MyContext';
import MyIcon from '~/components/MyIcon';
import MyDivider from '~/components/MyDivider';
import { WithBottomNav } from '~/components/Layout';
import MyText from '~/components/MyText';
import useFocusEffect from '~/hooks/useFocusEffect';
import { Profile as ProfileModel } from '@pages/meu-perfil';

function Profile() {
  const [profile, setProfile] = React.useState<ProfileModel>();
  const { isGuest } = useMyContext();

  useFocusEffect(
    React.useCallback(() => {
      getProfile().then(setProfile);
    }, [])
  );

  const data1 = [
    {
      icon: 'account',
      title: isGuest ? 'Entrar ou cadastrar-se' : 'Meu Perfil',
      path: isGuest ? '/entrar' : '/meu-perfil',
    },
    {
      icon: 'map-marker',
      title: 'Endereços salvos',
      path: '/endereco',
    },
    {
      icon: 'bell',
      title: 'Notificações',
      path: '/perfil/notificacoes',
    },
    {
      icon: 'credit-card-outline',
      title: 'Meios de pagamento',
      path: '/meios-de-pagamento',
    },
  ] as const;
  const data2 = [
    {
      icon: 'help-circle',
      title: 'Central de ajuda',
      path: '/perfil/ajuda',
    },
    {
      icon: 'cog',
      title: 'Configurações',
      path: '/perfil/config',
    },
    {
      icon: 'store',
      title: 'Sugerir estabelecimento',
      path: '/sugestao',
    },
    {
      icon: 'monitor-cellphone',
      title: 'Dispositivos conectados',
      path: '/dispositivos',
    },
  ] as const;
  const data = isGuest
    ? [
        data1.filter((item) => item.path !== '/meios-de-pagamento'),
        data2.filter((item) => item.path !== '/dispositivos'),
      ]
    : [data1, data2];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={globalStyles.notch}
      contentContainerStyle={{ paddingBottom: 68 }}>
      <>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 30,
            marginBottom: 22,
            marginTop: 18,
          }}>
          <MyIcon
            name='account-circle-outline'
            color={myColors.grey4}
            size={100}
          />
          <MyText style={styles.name}>{profile?.name ?? 'Convidado'}</MyText>
        </View>
        {data.map((data, index) => (
          <View
            key={index}
            style={[
              styles.card,
              globalStyles.elevation3,
              globalStyles.darkBorder,
            ]}>
            {data.map((item, index) => (
              <View key={index}>
                {index !== 0 && <MyDivider style={styles.divider} />}
                <View style={{ justifyContent: 'center' }}>
                  <MyIcon
                    style={{
                      position: 'absolute',
                      alignSelf: 'flex-end',
                      right: 4,
                    }}
                    name='chevron-right'
                    size={32}
                    color={myColors.grey2}
                  />
                  <MyButton
                    path={item.path}
                    title={item.title}
                    icon={{
                      name: item.icon,
                      size: 28,
                      color: myColors.primaryColor,
                    }}
                    buttonStyle={[
                      styles.button,
                      index === 0
                        ? styles.top
                        : index === data.length - 1
                        ? styles.bottom
                        : { borderRadius: 0 },
                    ]}
                    titleStyle={{
                      color: myColors.text2,
                      fontSize: 17,
                      marginLeft: 6,
                    }}
                    type='clear'
                  />
                </View>
              </View>
            ))}
          </View>
        ))}
      </>
    </ScrollView>
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
  name: {
    fontSize: 22,
    color: myColors.grey4,
    fontFamily: 'Bold',
    marginLeft: 16,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
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
  divider: {
    backgroundColor: myColors.divider3,
    marginHorizontal: 8,
  },
  textHeader: {
    color: myColors.primaryColor,
    fontSize: 18,
    alignSelf: 'center',
    position: 'absolute',
  },
  button: {
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingVertical: 9,
  },
});

export default WithBottomNav(Profile);
