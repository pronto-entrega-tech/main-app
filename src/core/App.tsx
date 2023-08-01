import React, { useCallback, useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { myColors, images, fonts, globalStyles, device } from '~/constants';
import { myScreenOptions } from '~/constants/others';
import Loading from '~/components/Loading';
import linking from '~/constants/routes';
import MyToast from '~/components/MyToast';
import BottomTabs from './BottomTabs';
import { getActiveAddressId, getIsNewUser } from '~/core/dataStorage';
import { Cupons } from '@pages/inicio/cupons';
import SignIn from '@pages/entrar';
import Addresses from '@pages/endereco';
import ProductTabs from '~/screens/ProductTabs';
import MarketRating from '@pages/inicio/mercado/[city]/[marketId]/avaliacao';
import MarketDetails from '@pages/inicio/mercado/[city]/[marketId]/detalhes';
import NewUser from '~/screens/NewUser';
import Cart from '@pages/carrinho';
import Schedule from '@pages/agendamento';
import PaymentTabs from '~/screens/PaymentTabs';
import PaymentMethods from '@pages/meios-de-pagamento';
import Filter from '@pages/filtro';
import Search from '@pages/pesquisa';
import EditAddress from '@pages/editar-endereco';
import MyProfile from '@pages/meu-perfil';
import Suggestion from '@pages/sugestao';
import UploadQuestion from '@pages/mandar-pergunta';
import Devices from '@pages/dispositivos';
import { AppContexts } from './AppContexts';
import { useAuthContext } from '~/contexts/AuthContext';
import PaymentCard from '@pages/meios-de-pagamento/cartao';
import EmailSignIn from '@pages/entrar/email';
import MyAlert from '~/components/MyAlert';
import { useUpdateAddress } from '~/hooks/useAddress';

SplashScreen.preventAutoHideAsync();

if (!device.web)
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

const Stack = createStackNavigator();

const App = () => {
  const { isAuth } = useAuthContext();
  const updateAddress = useUpdateAddress();
  const [initialScreen, setInitialScreen] = useState('NewUser');
  const [fontsLoaded] = useFonts(fonts);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isReady || isAuth === undefined) return;

    (async () => {
      try {
        if (!isAuth) {
          const isNew = await getIsNewUser();

          return setInitialScreen(isNew ? 'NewUser' : 'SignIn');
        }

        const id = await getActiveAddressId();
        if (id) return setInitialScreen('BottomTabs');

        const success = await updateAddress();
        setInitialScreen(success ? 'BottomTabs' : 'SelectAddress');
      } catch (err) {
        console.error(err);
      } finally {
        setIsReady(true);
      }
    })();
  }, [isReady, isAuth, updateAddress]);

  const Splash = ({
    navigation: { replace },
  }: {
    navigation: StackNavigationProp<any, any>;
  }) => {
    const onLayoutRootView = useCallback(async () => {
      SplashScreen.hideAsync();

      replace(initialScreen, {
        newUser: initialScreen === 'SignIn',
      });
    }, [replace]);

    return (
      <View
        onLayout={onLayoutRootView}
        style={[
          globalStyles.centralizer,
          { backgroundColor: myColors.primaryColor },
        ]}>
        <Image
          {...images.splash}
          fadeDuration={0}
          style={{ aspectRatio: 0.462, height: '100%' }}
        />
      </View>
    );
  };

  if (!isReady || !fontsLoaded) return null;

  return (
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
        <Stack.Screen name='EmailSignIn' component={EmailSignIn} />
        <Stack.Screen name='BottomTabs' component={BottomTabs} />
        <Stack.Screen name='SelectAddress' component={Addresses} />
        <Stack.Screen name='Addresses' component={Addresses} />
        <Stack.Screen name='EditAddress' component={EditAddress} />
        <Stack.Screen name='Product' component={ProductTabs} />
        <Stack.Screen name='MarketDetails' component={MarketDetails} />
        <Stack.Screen name='MarketRating' component={MarketRating} />
        <Stack.Screen name='Cart' component={Cart} />
        <Stack.Screen name='Schedule' component={Schedule} />
        <Stack.Screen name='Cupons' component={Cupons} />
        <Stack.Screen name='Payment' component={PaymentTabs} />
        <Stack.Screen name='PaymentMethods' component={PaymentMethods} />
        <Stack.Screen name='PaymentCard' component={PaymentCard} />
        <Stack.Screen name='Filter' component={Filter} />
        <Stack.Screen name='Search' component={Search} />
        <Stack.Screen name='MyProfile' component={MyProfile} />
        <Stack.Screen name='Suggestion' component={Suggestion} />
        <Stack.Screen name='UploadQuestion' component={UploadQuestion} />
        <Stack.Screen name='Devices' component={Devices} />
      </Stack.Navigator>
      <MyAlert />
      <MyToast />
    </NavigationContainer>
  );
};

const AppRoot = () => (
  <AppContexts>
    <App />
  </AppContexts>
);

export default AppRoot;
