import { GetServerSideProps } from "next";
import { api } from "~/services/api";
import { HomeProps } from "@pages/inicio";

export { default } from "@pages/inicio";

export const getServerSideProps: GetServerSideProps<HomeProps> = async ({
  params,
}) => {
  const city = params?.city?.toString();

  const products = city ? await api.products.findMany(city) : undefined;

  const banners = await api.products.banners();

  return {
    props: { products, banners },
  };
};
