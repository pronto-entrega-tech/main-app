import * as Linking from 'expo-linking';
const prefix = Linking.createURL('/');
import { LinkingOptions } from '@react-navigation/native';

const linking: LinkingOptions = {
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
            screens: {
              Home: 'inicio',
              Cupons: 'cupons',
              Favoritos: 'favoritos',
              ListMercados: 'lista-mercados',
              Mercado: {
                path: 'mercado/:city/:marketId',
              },
              MercInfo: {
                path: 'mercado-detalhes/:city/:marketId',
              },
              MercRating: {
                path: 'mercado-avaliacao/:city/:marketId',
              },
            },
          },
          CategoriasTab: 'categorias',
          ComprasTab: {
            screens: {
              Compras: 'compras',
              Order: 'pedido',
            },
          },
          PerfilTab: {
            screens: {
              Profile: 'perfil',
              Notifications: 'notificacoes',
              Help: 'ajuda',
              Config: 'config',
              ConfigNotifications: 'config-notificoes',
              Questions: 'perguntas',
            },
          },
        },
      },
      Product: {
        path: 'produto/:city/:marketId/:prodId',
        screens: {
          ProductDetails: '',
          MercadoDetails: 'mercado',
        },
      },
      Payment: {
        screens: {
          PaymentInApp: 'pagamento',
          PaymentOnDelivery: 'pagamento-entrega',
        },
      },
      Cart: 'carrinho',
      Schedule: 'agendamento',
      Address: 'enderecos',
      NewAddress: 'editar-endereco',
      Filter: 'filtro',
      Search: 'pesquisa',
      MyProfile: 'meu-perfil',
      UploadQuestion: 'mandar-pergunta',
      Devices: 'dispositivos',
      NotFound: '*',
    },
  },
};

export default linking;
