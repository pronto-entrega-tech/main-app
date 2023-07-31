import { createURL } from 'expo-linking';
import { LinkingOptions } from '@react-navigation/native';

const linking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: [createURL('/')],
  config: {
    screens: {
      Splash: '',
      SignIn: {
        path: 'entrar',
        screens: {
          SignIn: '',
          EmailSignIn: 'email',
        },
      },
      SelectAddress: 'selecione-endereco',
      BottomTabs: {
        initialRouteName: 'HomeTab',
        screens: {
          HomeTab: {
            path: 'inicio',
            screens: {
              Home: '',
              Explore: 'explore/:city',
              Cupons: 'cupons',
              Favorites: 'favoritos',
              MarketList: 'mercados',
              Market: 'mercado/:city/:marketId',
              MarketDetails: 'mercado/:city/:marketId/detalhes',
              MarketRating: 'mercado/:city/:marketId/avaliacao',
            },
          },
          Categories: 'categorias',
          OrdersTab: {
            path: 'compras',
            screens: {
              Orders: '',
              OrderDetails: ':marketId/:orderId',
              Chat: ':marketId/:orderId/chat',
            },
          },
          ProfileTab: {
            path: 'perfil',
            screens: {
              Profile: '',
              Notifications: 'notificacoes',
              Help: 'ajuda',
              Questions: 'perguntas/:question',
              Config: {
                path: 'configuracoes',
                screens: {
                  Config: '',
                  NotifConfig: 'notificacoes',
                },
              },
            },
          },
        },
      },
      Product: 'produto/:city/:itemId',
      PaymentMethods: {
        path: 'meios-de-pagamento',
        screens: {
          PaymentMethods: '',
          PaymentCard: 'cartao',
        },
      },
      Payment: 'pagamento',
      Cart: 'carrinho',
      Cupons: 'cupons',
      Schedule: 'agendamento',
      Addresses: 'endereco',
      EditAddress: 'editar-endereco',
      Filter: 'filtro',
      Search: 'pesquisa',
      MyProfile: 'meu-perfil',
      Suggestion: 'sugestao',
      UploadQuestion: 'mandar-pergunta',
      Devices: 'dispositivos',
      NoMatch: '*',
    },
  },
};

export const screensPaths = (() => {
  const screensPaths = new Map<string, string>([['BottomTabs', '/inicio']]);

  const joinPaths = (paths: string[]) =>
    paths
      .filter(Boolean)
      .join('/')
      .replace(/(?:\/):.*?(?=\/|$)/g, (param) => `/[${param.slice(2)}]`);

  const iterate = (screens: any, path = '') => {
    Object.entries(screens).forEach(([screen, route]: any) => {
      typeof route === 'string'
        ? screensPaths.set(screen, `/${joinPaths([path, route])}`)
        : iterate(route.screens, joinPaths([path, route.path]));
    });
  };

  iterate(linking.config?.screens ?? {});

  return screensPaths;
})();

export default linking;
