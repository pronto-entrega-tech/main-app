import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { myColors, device, globalStyles } from '~/constants';
import { saveUserStatus } from '~/core/dataStorage';
import Loading from '~/components/Loading';
import MyButton from '~/components/MyButton';

function NewUser({
  navigation,
}: {
  navigation: StackNavigationProp<any, any>;
  route: any;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (isLoading) return <Loading />;

  return (
    <View style={[styles.conteiner, globalStyles.notch]}>
      <Text style={{ fontSize: 18, color: myColors.text2, marginTop: 16 }}>
        Bem-Vindo
      </Text>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 20, color: myColors.text5 }}>
          Permitir Localização
        </Text>
        <Text style={{ fontSize: 15, color: myColors.text }}>
          Para achar as ofertas mais próximas de você
        </Text>
      </View>
      <View style={styles.bottom}>
        <MyButton
          title='Pular'
          type='outline'
          titleStyle={styles.buttonText}
          buttonStyle={styles.button}
          onPress={() => {
            saveUserStatus('returning');
            navigation.replace('SignIn');
          }}
        />
        <MyButton
          title='Permitir'
          titleStyle={styles.buttonText}
          buttonStyle={styles.button}
          onPress={async () => {
            setIsLoading(true);
            await Location.requestForegroundPermissionsAsync();
            saveUserStatus('returning');
            navigation.replace('SignIn');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conteiner: {
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
