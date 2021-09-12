import loadable from '@loadable/component';
const Compras = loadable(
  () => import(/* webpackChunkName: 'ComprasChunk' */ './Compras')
);
const Order = loadable(
  () => import(/* webpackChunkName: 'OrderChunk' */ './Order')
);

export default {
  Compras,
  Order,
};
