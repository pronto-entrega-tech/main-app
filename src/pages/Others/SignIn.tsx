import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { myColors, globalStyles, images, device } from '../../constants';
import MyButton from '../../components/MyButton';
import { getLocation } from './Splash.native';
import Loading from '../../components/Loading';
import useMyContext from '../../functions/MyContext';
import BottomModal from '../../components/BottomModal';
import { getUserStatus, saveUserStatus } from '../../functions/dataStorage';

function SignIn({
  navigation,
  route,
}: {
  navigation: StackNavigationProp<any, any>;
  route: any;
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isLogged, setIsLogged] = React.useState(false);
  const { setIsGuest } = useMyContext();

  React.useEffect(() => {
    getUserStatus().then((status) => setIsLogged(status == 'returning&logged'));
  }, []);

  const next = async (isGuest = false) => {
    saveUserStatus('returning&logged');
    await setIsGuest(isGuest);

    if (route.params == 'c') return navigation.goBack();

    const got = await getLocation();

    if (got) return navigation.replace('BottomTabs', { screen: 'Home' });

    navigation.replace('SelectAddress');
  };

  const GoogleButton = () => {
    return (
      <MyButton
        title='Entrar com o Google'
        type='outline'
        icon={
          <Image
            source={images.google}
            style={{ height: 42, width: 42, position: 'absolute', left: 7 }}
          />
        }
        buttonStyle={[
          styles.button,
          { backgroundColor: 'white', borderColor: myColors.divider2 },
        ]}
        titleStyle={{ fontFamily: 'Medium', color: myColors.text2 }}
        onPress={() => {
          setIsLoading(true);
          setIsModalVisible(false);
          setTimeout(next, 500);
        }}
      />
    );
  };

  const AppleButton = () => {
    return (
      <MyButton
        title='Entrar com a Apple'
        icon={
          <Image
            source={images.apple}
            style={{ height: 38, width: 38, position: 'absolute', left: 12 }}
          />
        }
        buttonStyle={[styles.button, { backgroundColor: 'black' }]}
        titleStyle={{ fontFamily: 'Medium' }}
        onPress={() => {
          setIsModalVisible(false);
          alert('Ainda não');
        }}
      />
    );
  };

  const FacebookButton = () => {
    return (
      <MyButton
        title='Entrar com o Facebook'
        icon={
          <Image
            source={images.facebook}
            style={{ width: 28, height: 28, position: 'absolute', left: 16 }}
          />
        }
        buttonStyle={[styles.button, { backgroundColor: '#1877f2' }]}
        onPress={() => {
          setIsModalVisible(false);
          alert('Ainda não');
        }}
      />
    );
  };

  const EmailButton = () => {
    return (
      <MyButton
        title='Email'
        type='outline'
        titleStyle={{ color: myColors.text2 }}
        buttonStyle={[
          styles.button,
          {
            paddingVertical: 14,
            borderColor: myColors.grey_1,
          },
        ]}
        onPress={() => {
          setIsModalVisible(false);
          alert('Ainda não');
        }}
      />
    );
  };

  const SignUpButtons = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          width: '100%',
        }}>
        <MyButton
          title='Celular'
          type='outline'
          titleStyle={{ color: myColors.text2 }}
          buttonStyle={{
            width: '42.5%',
            paddingVertical: 14,
            borderColor: myColors.grey_1,
          }}
          onPress={() => {
            setIsModalVisible(false);
            alert('Ainda não');
          }}
        />
        <MyButton
          title='Email'
          type='outline'
          titleStyle={{ color: myColors.text2 }}
          buttonStyle={{
            width: '42.5%',
            paddingVertical: 14,
            borderColor: myColors.grey_1,
          }}
          onPress={() => {
            setIsModalVisible(false);
            alert('Ainda não');
          }}
        />
      </View>
    );
  };

  const Buttons = () => {
    if (isLoading) return <Loading />;

    return (
      <>
        <Text
          style={{
            fontSize: 17,
            color: myColors.text2,
            marginBottom: 16,
            fontFamily: 'Regular',
          }}>
          Como deseja entrar?
        </Text>
        <GoogleButton />
        {device.web ? (
          <>
            <FacebookButton />
            <AppleButton />
            <EmailButton />
          </>
        ) : (
          <>
            <MyButton
              title='Outras opções'
              type='outline'
              buttonStyle={{
                width: '90%',
                marginBottom: 24,
                paddingVertical: 13,
                borderColor: myColors.divider3,
              }}
              titleStyle={{ color: myColors.text_1 }}
              onPress={() => setIsModalVisible(true)}
            />
            {!isLogged ? (
              <MyButton
                title='Entrar como convidado'
                type='clear'
                buttonStyle={{ padding: 14 }}
                titleStyle={{ color: myColors.grey2 }}
                onPress={() => {
                  setIsLoading(true);
                  next(true);
                }}
              />
            ) : null}
          </>
        )}
      </>
    );
  };

  return (
    <View style={device.web ? { height: 630 } : styles.conteiner}>
      <View style={[styles.conteiner, globalStyles.notch]}>
        <Image source={images.pineapple} style={styles.pineapple} />
        <Image source={images.tomato} style={styles.tomato} />
        <Image source={images.broccoli} style={styles.broccoli} />
        <Image source={images.logo} style={styles.logo} />
        <View style={styles.bottomConteiner}>
          <Text
            style={{
              fontSize: 22,
              color: myColors.text4,
              marginBottom: 24,
              fontFamily: 'Medium',
              textAlign: 'center',
            }}>
            {'Entre para conhecer\nas melhores promoções!'}
          </Text>
          <View
            style={{
              height: device.web ? 268 : 212,
              width: '100%',
              alignItems: 'center',
            }}>
            <Buttons />
          </View>
        </View>
      </View>
      {!device.web ? (
        <BottomModal
          isVisible={isModalVisible}
          onDismiss={() => setIsModalVisible(false)}
          style={{ alignItems: 'center', paddingBottom: 32, paddingTop: 28 }}>
          <Text
            style={{
              fontSize: 18,
              color: myColors.text4_5,
              marginBottom: 28,
              fontFamily: 'Regular',
            }}>
            Como deseja entrar?
          </Text>
          <FacebookButton />
          <AppleButton />
          <EmailButton />
        </BottomModal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  conteiner: {
    flex: 1,
  },
  pineapple: {
    position: 'absolute',
    alignSelf: 'flex-start',
    marginLeft: 25,
    top: -50,
    width: 200,
    height: 160,
  },
  tomato: {
    alignSelf: 'flex-end',
    position: 'absolute',
    marginTop: 50,
    width: 60,
    height: 120,
  },
  broccoli: {
    position: 'absolute',
    left: -65,
    marginTop: 180,
    width: 130,
    height: 130,
  },
  logo: {
    alignSelf: 'center',
    marginTop: 130,
    width: 150,
    height: 100,
  },
  button: {
    height: 50,
    width: '90%',
    marginBottom: 16,
    paddingVertical: 14,
  },
  bottomConteiner: {
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    bottom: device.iPhoneNotch ? 90 : 40,
  },
});

export default SignIn;
