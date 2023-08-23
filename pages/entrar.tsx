import React, { useCallback, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { ResponseType } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
/* import * as Facebook from 'expo-auth-session/providers/facebook'; */
import { myColors, globalStyles, images, device, myFonts } from '~/constants';
import MyButton from '~/components/MyButton';
import Loading from '~/components/Loading';
import BottomModal from '~/components/BottomModal';
import { useModalState } from '~/hooks/useModalState';
import MyText from '~/components/MyText';
import useRouting from '~/hooks/useRouting';
import { createURL } from 'expo-linking';
import { GoogleClientId } from '~/constants/ids';
import { useAuthContext } from '~/contexts/AuthContext';
import { objectConditional } from '~/functions/conditionals';
import { api } from '~/services/api';
import { useUpdateAddress } from '~/hooks/useAddress';
import useMyContext from '~/core/MyContext';

WebBrowser.maybeCompleteAuthSession();

const SignIn = () => {
  const routing = useRouting();
  const { alert } = useMyContext();
  const { isAuth, signIn } = useAuthContext();
  const updateAddress = useUpdateAddress();
  const [isLoading, setIsLoading] = useState(false);
  const [modalState, openModal, closeModal] = useModalState();
  const [, , promptAsync] = Google.useAuthRequest({
    expoClientId: GoogleClientId.expo,
    androidClientId: GoogleClientId.android,
    iosClientId: GoogleClientId.ios,
    webClientId: GoogleClientId.web,
    responseType: ResponseType.IdToken,
    ...objectConditional(device.web)({
      redirectUri: createURL('/entrar'),
    }),
  });

  const authIsWipAlert = useCallback(() => {
    alert('Esse demo não tem log-in', 'Entre como convidado');
  }, [alert]);

  const next = useCallback(async () => {
    if (!routing.params.newUser) return routing.goBack();

    const success = await updateAddress();

    routing.replace(success ? 'Home' : 'SelectAddress');
  }, [routing, updateAddress]);

  const googleButton = (
    <MyButton
      title='Entrar com o Google'
      type='outline'
      image={
        <Image
          {...images.google}
          style={{ height: 42, width: 42, position: 'absolute', left: 7 }}
        />
      }
      buttonStyle={[
        styles.button,
        { backgroundColor: 'white', borderColor: myColors.divider2 },
      ]}
      titleStyle={{ fontFamily: myFonts.Medium, color: myColors.text2 }}
      onPress={async () => {
        authIsWipAlert();
        /* setIsLoading(true);

        const promptRes = await promptAsync();

        if (promptRes.type !== 'success') return setIsLoading(false);

        const authRes = await api.auth.social(
          'GOOGLE',
          promptRes.params.id_token,
        );

        signIn({
          accessToken: authRes.access_token,
          refreshToken: authRes.refresh_token,
        });

        next(); */
      }}
    />
  );

  const facebookButton = (
    <MyButton
      title='Entrar com o Facebook'
      image={
        <Image
          {...images.facebook}
          style={{ width: 28, height: 28, position: 'absolute', left: 16 }}
        />
      }
      buttonStyle={[styles.button, { backgroundColor: '#1877f2' }]}
      onPress={() => {
        closeModal();
        authIsWipAlert();
      }}
    />
  );

  const appleButton = (
    <MyButton
      title='Entrar com a Apple'
      image={
        <Image
          {...images.apple}
          style={{ height: 38, width: 38, position: 'absolute', left: 12 }}
        />
      }
      buttonStyle={[styles.button, { backgroundColor: 'black' }]}
      titleStyle={{ fontFamily: myFonts.Medium }}
      onPress={() => {
        closeModal();
        authIsWipAlert();
      }}
    />
  );

  const emailButton = (
    <MyButton
      title='Email'
      type='outline'
      titleStyle={{ color: myColors.text2 }}
      buttonStyle={[
        styles.button,
        { paddingVertical: 14, borderColor: myColors.grey_1 },
      ]}
      onPress={() => {
        closeModal();
        authIsWipAlert();
        /* routing.navigate('EmailSignIn'); */
      }}
    />
  );

  const buttons = isLoading ? (
    <Loading />
  ) : (
    <>
      <MyText
        style={{
          fontSize: 17,
          color: myColors.text2,
          marginVertical: 16,
          textAlign: 'center',
        }}>
        Como deseja entrar?
      </MyText>
      {googleButton}
      {device.web ? (
        <>
          {facebookButton}
          {appleButton}
          {emailButton}
        </>
      ) : (
        <>
          <MyButton
            title='Outras opções'
            type='outline'
            buttonStyle={{
              height: 50,
              width: '100%',
              marginBottom: 24,
              paddingVertical: 13,
              borderColor: myColors.divider3,
            }}
            titleStyle={{ color: myColors.text_1 }}
            onPress={openModal}
          />
          {!isAuth && (
            <MyButton
              title='Entrar como convidado'
              type='clear'
              buttonStyle={{ padding: 14 }}
              titleStyle={{ color: myColors.grey2 }}
              onPress={() => {
                setIsLoading(true);
                next();
              }}
            />
          )}
        </>
      )}
    </>
  );

  return (
    <View style={device.web ? { height: 630 } : styles.container}>
      <View style={[styles.container, globalStyles.notch]}>
        <Image {...images.pineapple} style={styles.pineapple} />
        <Image {...images.tomato} style={styles.tomato} />
        <Image {...images.broccoli} style={styles.broccoli} />
        <Image {...images.logo} style={styles.logo} />
        <View style={styles.bottomContainer}>
          <MyText
            style={{
              fontSize: 22,
              color: myColors.text4,
              marginBottom: 16,
              fontFamily: myFonts.Medium,
              textAlign: 'center',
            }}>
            {'Entre para conhecer\nas melhores promoções!'}
          </MyText>
          <View
            style={{
              height: device.web ? 268 : 212,
              width: '100%',
              alignItems: 'center',
              paddingHorizontal: 24,
            }}>
            {buttons}
          </View>
        </View>
      </View>
      {!device.web && (
        <BottomModal
          state={modalState}
          style={{ paddingBottom: 32, paddingTop: 28 }}>
          <MyText
            style={{
              fontSize: 18,
              color: myColors.text4_5,
              marginBottom: 28,
              textAlign: 'center',
            }}>
            Como deseja entrar?
          </MyText>
          {facebookButton}
          {appleButton}
          {emailButton}
        </BottomModal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    width: '100%',
    maxWidth: 600,
    marginBottom: 16,
    paddingVertical: 14,
  },
  bottomContainer: {
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    bottom: device.iPhoneNotch ? 90 : 40,
  },
});

export default SignIn;
