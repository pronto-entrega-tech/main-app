import loadable from '@loadable/component';
import Home, { HomeHeader } from './Home';
import ListMercados, { ListMercadosHeader } from './ListMercados';
const Cupons = loadable(
  () =>
    import(
      /* webpackChunkName: 'CuponsChunk' */
      /* webpackMode: 'lazy-once' */
      './Cupons'
    )
);
const Favoritos = loadable(
  () =>
    import(
      /* webpackChunkName: 'FavoritosChunk' */
      /* webpackMode: 'lazy-once' */
      './Favoritos'
    )
);
const FavoritosHeader = loadable(async () => {
  return (
    await import(
      /* webpackChunkName: 'FavoritosHeaderChunk' */
      /* webpackMode: 'lazy-once' */
      './Favoritos'
    )
  ).FavoritosHeader;
});
import Mercado from './Mercado';
const MercInfo = loadable(
  () =>
    import(
      /* webpackChunkName: 'MercInfoChunk' */
      /* webpackMode: 'lazy-once' */
      './MercInfo'
    )
);
const MercRating = loadable(
  () =>
    import(
      /* webpackChunkName: 'MercRatingChunk' */
      /* webpackMode: 'lazy-once' */
      './MercRating'
    )
);

export default {
  Home,
  HomeHeader,
  ListMercados,
  ListMercadosHeader,
  Cupons,
  Favoritos,
  FavoritosHeader,
  Mercado,
  MercInfo,
  MercRating,
};
