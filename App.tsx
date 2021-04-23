import React, { useEffect, useRef, useState } from 'react';
import { View, Image } from 'react-native';
import { InitialState, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { myColors, device, myTitle, images } from './src/constants'
import Header from './src/components/Header';
import Header2 from './src/components/Header2';
import Splash from './src/pages/Others/Splash';
import NewUser from './src/pages/Others/NewUser';
import Others from './src/pages/Others';
import Home from './src/pages/Home';
import Perfil from './src/pages/Perfil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from './src/components/Loading';
import * as Font from 'expo-font';
import * as Linking from 'expo-linking';
import myFonts from './src/assets/fonts'
import BottomTabs from './src/pages/Others/BottomTabs';
import linking from './src/constants/routes';
import { MyProvider } from './src/functions/MyContext';
import MyToast from './src/components/MyToast';

const prefix = Linking.createURL('');
const Stack = createStackNavigator();

const NAVIGATION_PERSISTENCE_KEY = '@poupapreco/NAVIGATION_STATE';

function App() {
  const navigationRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState<InitialState | undefined>();
  
  useEffect(() => {
    (async () => {
      try {
        const initialUrl = (await Linking.getInitialURL())?.replace(prefix, '');
        
        const savedState = await AsyncStorage?.getItem(NAVIGATION_PERSISTENCE_KEY);
        const state = savedState ? JSON.parse(savedState) : undefined;

        if (!(initialUrl?.startsWith('/produto') || initialUrl?.startsWith('/mercado')))
        setInitialState(state);

        await Font.loadAsync(myFonts);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  if (!isReady) {
    if (device.web) return <Loading />
    return (
      <View style={{
        justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: myColors.primaryColor}}>
        <Image fadeDuration={0} source={images.splash} style={{
          width: Math.round((device.height * 1284) / 2778), height: device.height}} />
      </View>
    )
  }
  
  return (
    <MyProvider>
      <NavigationContainer
        ref={navigationRef}
        initialState={initialState}
        onStateChange={(state) => {
          AsyncStorage?.setItem(NAVIGATION_PERSISTENCE_KEY, JSON.stringify(state))
        }}
        linking={linking}
        fallback={device.web ? <Loading /> : <View/>}
        theme={{colors: {primary: myColors.primaryColor, background: myColors.background}}}>
        <Stack.Navigator
          screenOptions={TransitionPresets.SlideFromRightIOS}
          headerMode='screen'>
          <Stack.Screen
            name='Splash'
            component={Splash}
            options={{headerShown: false, title: myTitle}}/>
          <Stack.Screen
            name='NewUser'
            component={NewUser}
            options={{headerShown: false, title: myTitle }}/>
          <Stack.Screen
            name='BottomTabs'
            options={{headerShown: false, title: myTitle}}>
              {BottomTabs}
            </Stack.Screen>
          <Stack.Screen
            name='SelectAddress'
            component={Others.Address}
            initialParams={{name: 'SelectAddress'}}
            options={{header: props => <Header {...props} title={'Escolha um endereço'} goBack={false} />, title: myTitle }}/>
          <Stack.Screen
            name='Address'
            component={Others.Address}
            options={{header: props => <Header {...props} title={'Endereços salvos'} />, title: myTitle }}/>
          <Stack.Screen
            name='Product'
            component={Others.Product}
            options={{headerShown: false, title: myTitle }}/>
          <Stack.Screen
            name='MercInfo'
            component={Home.MercInfo}
            options={{header: props => <Header {...props} title={'Informações'} />, title: myTitle }}/>
          <Stack.Screen
            name='MercRating'
            component={Home.MercRating}
            options={{header: props => <Header {...props} title={'Avaliações'} />, title: myTitle }}/>
          <Stack.Screen
            name='Notifications'
            component={Perfil.Notifications}
            options={{header: props => <Header {...props} title={'Notificações'}/>, title: myTitle}}/>
          <Stack.Screen
            name='Cart'
            component={Others.Cart}
            options={{headerShown: false, title: myTitle }}/>
          <Stack.Screen
            name='Schedule'
            component={Others.Schedule}
            options={{header: props => <Header {...props} title={'Agendameto'} />, title: myTitle}}/>
          <Stack.Screen
            name='CartCupons'
            component={Home.Cupons}
            options={{header: props => <Home.ListMercadosHeader {...props} title={'Cupons'} />, title: myTitle}}/>
          <Stack.Screen
            name='Payment'
            component={Others.Payment}
            options={{header: props => <Header {...props} title={'Pagamento'} divider={false} />, title: myTitle}}/>
          <Stack.Screen
            name='PaymentInApp'
            component={Others.PaymentInApp}
            options={{header: props => <Header {...props} title={'Formas de pagamento'} />, title: myTitle}}/>
          <Stack.Screen
            name='Filter'
            component={Others.Filter}
            options={{header: props => <Header {...props} title={'Filtro'} /> , title: myTitle}}/>
          <Stack.Screen
            name='Search'
            component={Others.Search}
            options={{header: props => <Header2 {...props} fallback='BottomTabs' />, title: myTitle }}/>
          <Stack.Screen
            name='NewAddress'
            component={Others.NewAddress}
            options={{headerShown: false, title: myTitle }}/>
          <Stack.Screen
            name='MyProfile'
            component={Others.MyProfile}
            options={{headerShown: false, title: myTitle}}/>
          <Stack.Screen
            name='Sugestao'
            component={Others.Sugestao}
            options={{header: props => <Header {...props} title={'Sugerir estabelecimento'}/>, title: myTitle}}/>
          <Stack.Screen
            name='UploadQuestion'
            component={Others.UploadQuestion}
            options={{header: props => <Header {...props} title={'Envie sua dúvida'}/>, title: myTitle}}/>
        </Stack.Navigator>
        <MyToast />
      </NavigationContainer>
    </MyProvider>
  );
}

export default App