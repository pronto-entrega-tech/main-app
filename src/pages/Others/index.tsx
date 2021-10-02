import loadable from '@loadable/component';
import routes from '~/constants/routes';
const Address = loadable(() => import('./Address'));
const Cart = loadable(() => import('./Cart'));
const Devices = loadable(() => import('./Devices'));
const Filter = loadable(() => import('./Filter'));
const MyProfile = loadable(() => import('./MyProfile'));
const NewAddress = loadable(() => import('./NewAddress'));
const NewUser = loadable(() => import('./NewUser'));
const Payment = loadable(() => import('./Payment'));
const PaymentInApp = loadable(() => import('./PaymentInApp'));
const PaymentOnDelivery = loadable(() => import('./PaymentOnDelivery'));
const Product = loadable(() => import('./Product'));
const ProductHeader = loadable(
  async () => (await import('./Product')).ProductHeader
);
const Schedule = loadable(() => import('./Schedule'));
const Splash = loadable(() => import('./Splash'));
const SignIn = loadable(() => import('./SignIn'));
const Search = loadable(() => import('./Search'));
const Sugestao = loadable(() => import('./Sugestao'));
const UploadQuestion = loadable(() => import('./UploadQuestion'));

export default {
  routes,
  Address,
  Cart,
  Devices,
  Filter,
  MyProfile,
  NewAddress,
  NewUser,
  Payment,
  PaymentInApp,
  PaymentOnDelivery,
  Product,
  ProductHeader,
  Schedule,
  Splash,
  SignIn,
  Search,
  Sugestao,
  UploadQuestion,
};
