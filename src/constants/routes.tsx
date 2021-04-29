import * as Linking from 'expo-linking';
const prefix = Linking.createURL('/');
import { LinkingOptions } from "@react-navigation/native";

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
              Home: 'home',
              Cupons: 'cupons',
              Favoritos: 'favoritos',
              ListMercados: 'mercados',
              Mercado: {
                path: 'mercado',
              },
              MercInfo: {
                path: 'mercado-detalhes/:key',
              },
              MercRating: {
                path: 'mercado-avaliacao/:key',
              },
            },
          },
          CategoriasTab: 'categorias',
          ComprasTab: {
            screens: {
              Compras: 'compras',
              Order: 'pedido'
            },
          },
          PerfilTab: {
            screens: {
              Profile: 'perfil',
              Notifications: 'notificacoes',
              Help: 'ajuda',
              Config: 'config',
              ConfigNotifications: 'config-notificoes',
              Questions: 'perguntas'
            },
          },
        },
      },
      Product: {
        path: 'produto/:prod',
        screens: {
          ProductDetails: '',
          Mercado: 'mercado',
        }
      },
      Payment: {
        screens: {
          PaymentInApp: 'pagamento',
          PaymentOnDelivery: 'pagamento-entrega',
        }
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

export default linking