import loadable from '@loadable/component';
import routes from '~/constants/routes';
import Address from './Address';
const Cart = loadable(
  () => import(/* webpackChunkName: 'CartChunk' */ './Cart')
);
const Devices = loadable(
  () => import(/* webpackChunkName: 'DevicesChunk' */ './Devices')
);
const Filter = loadable(
  () => import(/* webpackChunkName: 'FilterChunk' */ './Filter')
);
const MyProfile = loadable(
  () => import(/* webpackChunkName: 'MyProfileChunk' */ './MyProfile')
);
const NewAddress = loadable(
  () => import(/* webpackChunkName: 'NewAddressChunk' */ './NewAddress')
);
const NewUser = loadable(
  () => import(/* webpackChunkName: 'NewUserChunk' */ './NewUser')
);
const Payment = loadable(
  () => import(/* webpackChunkName: 'NewUserChunk' */ './Payment')
);
const PaymentInApp = loadable(
  () => import(/* webpackChunkName: 'PaymentInAppChunk' */ './PaymentInApp')
);
const PaymentOnDelivery = loadable(
  () =>
    import(
      /* webpackChunkName: 'PaymentOnDeliveryChunk' */ './PaymentOnDelivery'
    )
);
import Product, { ProductHeader } from './Product';
const Schedule = loadable(
  () => import(/* webpackChunkName: 'ScheduleChunk' */ './Schedule')
);
import Splash from './Splash';
const SignIn = loadable(
  () => import(/* webpackChunkName: 'SignInChunk' */ './SignIn')
);
import Search from './Search';
const Sugestao = loadable(
  () => import(/* webpackChunkName: 'SugestaoChunk' */ './Sugestao')
);
const UploadQuestion = loadable(
  () => import(/* webpackChunkName: 'UploadQuestionChunk' */ './UploadQuestion')
);

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
