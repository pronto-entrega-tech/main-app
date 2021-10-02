import loadable from '@loadable/component';
import Home, { HomeHeader } from './Home';
import ListMercados, { ListMercadosHeader } from './ListMercados';
const Cupons = loadable(() => import('./Cupons'));
const Favoritos = loadable(() => import('./Favoritos'));
const FavoritosHeader = loadable(async () => {
  return (await import('./Favoritos')).FavoritosHeader;
});
import Mercado from './Mercado';
const MercInfo = loadable(() => import('./MercInfo'));
const MercRating = loadable(() => import('./MercRating'));

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
