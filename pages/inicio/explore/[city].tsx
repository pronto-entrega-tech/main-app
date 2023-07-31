import { GetServerSideProps } from 'next';
import { api } from '~/services/api';

export { default } from '@pages/inicio';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const city = params?.city?.toString();

  const products = city ? await api.products.findMany(city) : null;

  const slides = await api.products.slides();

  return {
    props: { products, slides },
  };
};
