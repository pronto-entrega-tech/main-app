import { GetStaticProps } from 'next';
import React from 'react';
import { View } from 'react-native';
import Header from '~/components/Header';
import { WithBottomNav } from '~/components/Layout';
import MyText from '~/components/MyText';
import { globalStyles, myColors } from '~/constants';
import { getMarket } from '~/services/requests';

function MercRating() {
  return (
    <>
      <Header title={'Avaliação'} />
      <View
        style={[
          globalStyles.centralizer,
          {
            backgroundColor: myColors.background,
          },
        ]}>
        <MyText style={{ fontSize: 15, color: myColors.text2 }}>
          Nenhuma avaliação ainda
        </MyText>
      </View>
    </>
  );
}

export default WithBottomNav(MercRating);

export { getStaticPaths } from './index';

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const city = params?.city?.toString();
  const marketId = params?.marketId?.toString();

  const props =
    city && marketId
      ? {
          market: await getMarket(city, marketId),
        }
      : {};

  return {
    revalidate: 60,
    props,
  };
};
