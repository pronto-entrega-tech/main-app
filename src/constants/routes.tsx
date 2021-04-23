import * as Linking from 'expo-linking';
const prefix = Linking.createURL('/');
import { LinkingOptions } from "@react-navigation/native";

const linking: LinkingOptions = {
  prefixes: [prefix],
  config: {
    screens: {
      Splash: '',
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
          Produto: '',
          Mercado: 'mercado',
        }
      },
      MyProfile: 'meu-perfil',
      Address: 'enderecos',
      Search: 'pesquisa',
      UploadQuestion: 'mandar-pergunta',
      Filter: 'filtro',
      NotFound: '*',
    },
  },
};

export default linking