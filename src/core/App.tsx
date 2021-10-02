import React from 'react';
import { View } from 'react-native';
import {
  InitialState,
  NavigationState,
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import loadable from '@loadable/component';
import { myColors, device, myTitle } from '~/constants';
import Header from '~/components/Header';
import Others from '~/pages/Others';
import Home from '~/pages/Home';
import Perfil from '~/pages/Perfil';
import Loading from '~/components/Loading';
import linking from '~/constants/routes';
import { MyProvider } from '~/functions/MyContext';
import MyToast from '~/components/MyToast';
const BottomTabs = loadable(() => import('./BottomTabs'));

const Stack = createStackNavigator();

interface AppProp {
  navigationRef: React.Ref<NavigationContainerRef>;
  initialState?: InitialState;
  onStateChange: (state?: NavigationState) => void;
}
export function App({ navigationRef, initialState, onStateChange }: AppProp) {
  return (
    <MyProvider>
      <NavigationContainer
        ref={navigationRef}
        initialState={initialState}
        onStateChange={onStateChange}
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
            component={BottomTabs}
            options={{ headerShown: false, title: myTitle }}
          />
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
