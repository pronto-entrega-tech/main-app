import React, { useEffect, useRef, useState } from 'react';
import { View, Image } from 'react-native';
import { InitialState, NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { myColors, device, myTitle, images } from '~/constants';
import Header from '~/components/Header';
import Others from '~/pages/Others';
import Home from '~/pages/Home';
import Perfil from '~/pages/Perfil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '~/components/Loading';
import * as Font from 'expo-font';
import * as Linking from 'expo-linking';
import myFonts from '~/assets/fonts';
import BottomTabs from './BottomTabs';
import linking from '~/constants/routes';
import { MyProvider } from '~/functions/MyContext';
import MyToast from '~/components/MyToast';

const prefix = Linking.createURL('');
const Stack = createStackNavigator();

const NAVIGATION_PERSISTENCE_KEY = '@prontoentrega/NAVIGATION_STATE';

function App() {
  const navigationRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState<InitialState | undefined>(
    undefined
  );

  useEffect(() => {
    (async () => {
      try {
        await Font.loadAsync(myFonts);
        if (!device.web) return;

        const initialUrl = (await Linking.getInitialURL())?.replace(prefix, '');

        const savedState = await AsyncStorage?.getItem(
          NAVIGATION_PERSISTENCE_KEY
        );
        const state = savedState ? JSON.parse(savedState) : undefined;

        if (
          !(
            initialUrl == '/' ||
            initialUrl?.startsWith('/produto') ||
            initialUrl?.startsWith('/mercado?')
          )
        )
          setInitialState(state);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  if (!isReady) {
    if (device.web) return <Loading />;
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          backgroundColor: myColors.primaryColor,
        }}>
        <Image
          fadeDuration={0}
          source={images.splash}
          style={{
            width: Math.round((device.height * 1284) / 2778),
            height: device.height,
          }}
        />
      </View>
    );
  }

  return (
    <MyProvider>
      <NavigationContainer
        ref={navigationRef}
        initialState={initialState}
        onStateChange={(state) => {
          AsyncStorage?.setItem(
            NAVIGATION_PERSISTENCE_KEY,
            JSON.stringify(state)
          );
        }}
        linking={linking}
        fallback={device.web ? <Loading /> : <View />}
        theme={{
          colors: {
            primary: myColors.primaryColor,
            background: myColors.background,
          },
        }}>
        <Stack.Navigator
          screenOptions={TransitionPresets.SlideFromRightIOS}
          headerMode='screen'>
          <Stack.Screen
            name='Splash'
            component={Others.Splash}
            options={{ headerShown: false, title: myTitle }}
          />
          <Stack.Screen
            name='NewUser'
            component={Others.NewUser}
            options={{ headerShown: false, title: myTitle }}
          />
          <Stack.Screen
            name='SignIn'
            component={Others.SignIn}
            options={{ headerShown: false, title: myTitle }}
          />
          <Stack.Screen
            name='BottomTabs'
            options={{ headerShown: false, title: myTitle }}>
            {BottomTabs}
          </Stack.Screen>
          <Stack.Screen
            name='SelectAddress'
            component={Others.Address}
            initialParams={{ name: 'SelectAddress' }}
            options={{
              header: (props) => (
                <Header
                  {...props}
                  title={'Escolha um endereço'}
                  goBack={false}
                />
              ),
              title: myTitle,
            }}
          />
          <Stack.Screen
            name='Address'
            component={Others.Address}
            options={{
              header: (props) => (
                <Header {...props} title={'Endereços salvos'} />
              ),
              title: myTitle,
            }}
          />
          <Stack.Screen
            name='Product'
            component={Others.Product}
            options={{ headerShown: false, title: myTitle }}
          />
          <Stack.Screen
            name='MercInfo'
            component={Home.MercInfo}
            options={{
              header: (props) => <Header {...props} title={'Informações'} />,
              title: myTitle,
            }}
          />
          <Stack.Screen
            name='MercRating'
            component={Home.MercRating}
            options={{
              header: (props) => <Header {...props} title={'Avaliações'} />,
              title: myTitle,
            }}
          />
          <Stack.Screen
            name='Notifications'
            component={Perfil.Notifications}
            options={{
              header: (props) => <Header {...props} title={'Notificações'} />,
              title: myTitle,
            }}
          />
          <Stack.Screen
            name='Cart'
            component={Others.Cart}
            options={{ headerShown: false, title: myTitle }}
          />
          <Stack.Screen
            name='Schedule'
            component={Others.Schedule}
            options={{
              header: (props) => <Header {...props} title={'Agendameto'} />,
              title: myTitle,
            }}
          />
          <Stack.Screen
            name='CartCupons'
            component={Home.Cupons}
            options={{
              header: (props) => (
                <Home.ListMercadosHeader {...props} title={'Cupons'} />
              ),
              title: myTitle,
            }}
          />
          <Stack.Screen
            name='Payment'
            component={Others.Payment}
            options={{ headerShown: false, title: myTitle }}
          />
          <Stack.Screen
            name='PaymentInApp'
            component={Others.PaymentInApp}
            options={{
              header: (props) => (
                <Header {...props} title={'Formas de pagamento'} />
              ),
              title: myTitle,
            }}
          />
          <Stack.Screen
            name='Filter'
            component={Others.Filter}
            options={{
              header: (props) => <Header {...props} title={'Filtro'} />,
              title: myTitle,
            }}
          />
          <Stack.Screen
            name='Search'
            component={Others.Search}
            options={{ headerShown: false, title: myTitle }}
          />
          <Stack.Screen
            name='NewAddress'
            component={Others.NewAddress}
            options={{ headerShown: false, title: myTitle }}
          />
          <Stack.Screen
            name='MyProfile'
            component={Others.MyProfile}
            options={{ headerShown: false, title: myTitle }}
          />
          <Stack.Screen
            name='Sugestao'
            component={Others.Sugestao}
            options={{
              header: (props) => (
                <Header {...props} title={'Sugerir estabelecimento'} />
              ),
              title: myTitle,
            }}
          />
          <Stack.Screen
            name='UploadQuestion'
            component={Others.UploadQuestion}
            options={{
              header: (props) => (
                <Header {...props} title={'Envie sua dúvida'} />
              ),
              title: myTitle,
            }}
          />
          <Stack.Screen
            name='Devices'
            component={Others.Devices}
            options={{
              header: (props) => <Header {...props} title={'Dispositivos'} />,
              title: myTitle,
            }}
          />
        </Stack.Navigator>
        <MyToast />
      </NavigationContainer>
    </MyProvider>
  );
}

export default App;
