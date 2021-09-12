import { useFocusEffect } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { Divider, Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MyButton from '~/components/MyButton';
import { myColors, images, globalStyles } from '~/constants';
import { getProfile } from '~/functions/dataStorage';
import useMyContext from '~/functions/MyContext';
import { profileModel } from '../Others/MyProfile';

function Perfil({ navigation }: { navigation: StackNavigationProp<any, any> }) {
  const [profile, setProfile] = React.useState<profileModel>();
  const { isGuest } = useMyContext();

  useFocusEffect(
    React.useCallback(() => {
      getProfile().then((profile) => {
        setProfile(profile);
      });
    }, [])
  );

  const data1: { icon: string; title: string; navigate: string }[] = [
    {
      icon: 'account',
      title: isGuest ? 'Entrar ou cadastrar-se' : 'Meu Perfil',
      navigate: isGuest ? 'SignIn' : 'MyProfile',
    },
    { icon: 'map-marker', title: 'Endereços salvos', navigate: 'Address' },
    { icon: 'bell', title: 'Notificações', navigate: 'Notifications' },
    {
      icon: 'credit-card-outline',
      title: 'Formas de pagamento',
      navigate: 'PaymentInApp',
    },
  ];
  const data2: { icon: string; title: string; navigate: string }[] = [
    { icon: 'help-circle', title: 'Central de ajuda', navigate: 'Help' },
    { icon: 'cog', title: 'Configurações', navigate: 'Config' },
    {
      icon: 'store',
      title: 'Sugerir estabelecimento',
      navigate: 'Sugestao',
    },
    {
      icon: 'monitor-cellphone',
      title: 'Dispositivos conectados',
      navigate: 'Devices',
    },
  ];
  const data: { icon: string; title: string; navigate: string }[][] = isGuest
    ? [
        data1.filter((item) => item.navigate !== 'PaymentInApp'),
        data2.filter((item) => item.navigate !== 'Devices'),
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
          <Image
            placeholderStyle={{ backgroundColor: '#FFF' }}
            containerStyle={{ height: 100, width: 100, borderRadius: 100 }}
            source={images.account}
          />
          <Text style={styles.name}>
            {profile?.name ? profile.name : 'Convidado'}
          </Text>
        </View>
        {data.map((data, index) => (
          <View
            key={index}
            style={[
              styles.card,
              globalStyles.elevation3,
              globalStyles.darkBoader,
            ]}>
            {data.map((item, index) => (
              <View key={index}>
                {index !== 0 ? <Divider style={styles.divider} /> : null}
                <View style={{ justifyContent: 'center' }}>
                  <Icon
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
                    onPress={() => navigation.navigate(item.navigate)}
                    title={item.title}
                    icon={
                      <Icon
                        name={item.icon}
                        size={28}
                        color={myColors.primaryColor}
                      />
                    }
                    buttonStyle={[
                      styles.button,
                      index == 0
                        ? styles.top
                        : index == data.length - 1
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
    fontWeight: 'bold',
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
    height: 1,
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

export default Perfil;
