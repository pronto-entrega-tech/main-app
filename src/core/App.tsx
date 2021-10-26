import React from 'react';
import { View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {
  getForegroundPermissionsAsync,
  hasServicesEnabledAsync,
} from 'expo-location';
import { loadAsync } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { myColors, images, fonts } from '~/constants';
import { myScreenOptions } from '~/constants/others';
import Loading from '~/components/Loading';
import linking from '~/constants/routes';
import MyToast from '~/components/MyToast';
import { MyProvider } from '~/core/MyContext';
import BottomTabs from './BottomTabs';
import {
  getActiveAddressIndex,
  getUserStatus,
  saveActiveAddress,
} from '~/core/dataStorage';
import { Cupons } from '@pages/inicio/cupons';
import SignIn from '@pages/entrar';
import Address, { getAddress } from '@pages/endereco';
import ProductTabs from '~/screens/ProductTabs';
import NewUser from '~/screens/NewUser';
import Cart from '@pages/carrinho';
import Schedule from '@pages/agendamento';
import PaymentTabs from '~/screens/PaymentTabs';
import PaymentMethods from '@pages/meios-de-pagamento';
import Filter from '@pages/filtro';
import Search from '@pages/pesquisa';
import NewAddress from '@pages/editar-endereco';
import MyProfile from '@pages/meu-perfil';
import Suggestion from '@pages/sugestao';
import UploadQuestion from '@pages/mandar-pergunta';
import Devices from '@pages/dispositivos';

export async function getLocation() {
  const { status } = await getForegroundPermissionsAsync();
  if (status !== 'granted') return false;

  const enabled = await hasServicesEnabledAsync();
  if (!enabled) return false;

  const address = await getAddress();

  if (address === false) return false;

  saveActiveAddress(address);
  return true;
}

const Stack = createStackNavigator();

export default function App() {
  const [initialScreen, setInitialScreen] = React.useState('NewUser');
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        SplashScreen.preventAutoHideAsync();

        const [status] = await Promise.all([getUserStatus(), loadAsync(fonts)]);

        if (!status) return setInitialScreen('NewUser');

        if (status === 'returning') return setInitialScreen('SignIn');

        const index = await getActiveAddressIndex();
        if (index !== -1) return setInitialScreen('BottomTabs');

        const got = await getLocation();
        setInitialScreen(got ? 'BottomTabs' : 'SelectAddress');
      } catch (err) {
        console.error(err);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  function Splash({
    navigation,
  }: {
    navigation: StackNavigationProp<any, any>;
  }) {
    const onLayoutRootView = React.useCallback(async () => {
      SplashScreen.hideAsync();
      navigation.replace(initialScreen);
    }, [navigation]);

    return (
      <View
        onLayout={onLayoutRootView}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          backgroundColor: myColors.primaryColor,
        }}>
        <Image
          {...images.splash}
          fadeDuration={0}
          style={{
            aspectRatio: 0.462,
            height: '100%',
          }}
        />
      </View>
    );
  }

  if (!isReady) return null;

  return (
    <MyProvider>
      <NavigationContainer
        linking={linking}
        fallback={<Loading />}
        theme={{
          dark: false,
          colors: {
            primary: myColors.primaryColor,
            background: myColors.background,
            card: 'white',
            text: myColors.text,
            border: myColors.primaryColor,
            notification: 'gray',
          },
        }}>
        <Stack.Navigator screenOptions={myScreenOptions}>
          <Stack.Screen name='Splash' component={Splash} />
          <Stack.Screen name='NewUser' component={NewUser} />
          <Stack.Screen name='SignIn' component={SignIn} />
          <Stack.Screen name='BottomTabs' component={BottomTabs} />
          <Stack.Screen name='SelectAddress' component={Address} />
          <Stack.Screen name='Address' component={Address} />
          <Stack.Screen name='ProductTabs' component={ProductTabs} />
          <Stack.Screen name='Cart' component={Cart} />
          <Stack.Screen name='Schedule' component={Schedule} />
          <Stack.Screen name='Cupons' component={Cupons} />
          <Stack.Screen name='PaymentTabs' component={PaymentTabs} />
          <Stack.Screen name='PaymentInApp' component={PaymentMethods} />
          <Stack.Screen name='Filter' component={Filter} />
          <Stack.Screen name='Search' component={Search} />
          <Stack.Screen name='NewAddress' component={NewAddress} />
          <Stack.Screen name='MyProfile' component={MyProfile} />
          <Stack.Screen name='Suggestion' component={Suggestion} />
          <Stack.Screen name='UploadQuestion' component={UploadQuestion} />
          <Stack.Screen name='Devices' component={Devices} />
        </Stack.Navigator>
        <MyToast />
      </NavigationContainer>
    </MyProvider>
  );
}
