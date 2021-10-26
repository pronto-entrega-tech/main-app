import { createURL } from 'expo-linking';
import { LinkingOptions } from '@react-navigation/native';
const prefix = createURL('/');

const linking: LinkingOptions<{}> = {
  prefixes: [prefix],
  config: {
    screens: {
      Splash: '',
      SignIn: 'entrar',
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
              MarketList: 'lista-mercados',
              Market: 'mercado/:city/:marketId',
              MarketDetails: 'mercado/:city/:marketId/detalhes',
              MarketRating: 'mercado/:city/:marketId/avaliacao',
            },
          },
          Categories: 'categorias',
          ShoppingTab: {
            path: 'compras',
            screens: {
              Shopping: '',
              Order: 'pedido',
            },
          },
          ProfileTab: {
            path: 'perfil',
            screens: {
              Profile: '',
              Notifications: 'notificacoes',
              Help: 'ajuda',
              Config: 'config',
              ConfigNoti: 'config-notificoes',
              Questions: 'perguntas/:question',
            },
          },
        },
      },
      ProductTabs: {
        path: 'produto/:city/:marketId/:prodId',
        screens: {
          ProductDetails: '',
          ProductMarket: '/mercado',
        },
      },
      PaymentInApp: 'meios-de-pagamento',
      PaymentTabs: {
        screens: {
          PaymentInApp: 'pagamento',
          PaymentOnDelivery: 'pagamento-entrega',
        },
      },
      Cart: 'carrinho',
      Cupons: 'cupons',
      Schedule: 'agendamento',
      Address: 'endereco',
      NewAddress: 'editar-endereco',
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

export default linking;
