import { GetServerSideProps } from 'next';
import { getProdFeed, getSlidesJson } from '~/services/requests';

export { default } from '@pages/inicio';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const city = params?.city?.toString();

  const products = city ? await getProdFeed(city) : null;

  const slides = await getSlidesJson();

  return {
    props: { products, slides },
  };
};
