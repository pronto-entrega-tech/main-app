import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { myColors, device, globalStyles } from '~/constants';
import { saveIsNewUser } from '~/core/dataStorage';
import Loading from '~/components/Loading';
import MyButton from '~/components/MyButton';
import useRouting from '~/hooks/useRouting';
import MyText from '~/components/MyText';

const NewUser = () => {
  const { replace } = useRouting();
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) return <Loading />;

  const next = () => {
    saveIsNewUser(false);
    replace('SignIn', { newUser: true });
  };

  return (
    <View style={[styles.container, globalStyles.notch]}>
      <MyText style={{ fontSize: 18, color: myColors.text2, marginTop: 16 }}>
        Bem-Vindo
      </MyText>
      <View style={{ alignItems: 'center' }}>
        <MyText style={{ fontSize: 20, color: myColors.text5 }}>
          Permitir Localização
        </MyText>
        <MyText style={{ fontSize: 15, color: myColors.text }}>
          Para achar as ofertas mais próximas de você
        </MyText>
      </View>
      <View style={styles.bottom}>
        <MyButton
          title='Pular'
          type='outline'
          titleStyle={styles.buttonText}
          buttonStyle={styles.button}
          onPress={next}
        />
        <MyButton
          title='Permitir'
          titleStyle={styles.buttonText}
          buttonStyle={styles.button}
          onPress={async () => {
            setIsLoading(true);
            await Location.requestForegroundPermissionsAsync();
            next();
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  bottom: {
    marginBottom: device.iPhoneNotch ? 40 : 8,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  buttonText: {
    fontSize: 18,
  },
  button: {
    width: '42%',
    paddingVertical: 12,
  },
});

export default NewUser;
