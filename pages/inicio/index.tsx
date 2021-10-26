import React, { useState } from 'react';
import { View, StyleSheet, ImageURISource } from 'react-native';
import { GetServerSideProps } from 'next';
import { WithBottomNav } from '~/components/Layout';
import { myColors, device, globalStyles, myFonts } from '~/constants';
import { getProdFeed, getSlidesJson } from '~/services/requests';
import { getShortAddress } from '~/core/dataStorage';
import Slider from '~/components/Slides';
import IconButtonText from '~/components/IconButtonText';
import ProdList from '~/components/ProdList';
import MyDivider from '~/components/MyDivider';
import MySearchbar from '~/components/MySearchBar';
import MyButton from '~/components/MyButton';
import MyText from '~/components/MyText';
import { Product } from '~/components/ProdItem';
import MyIcon from '~/components/MyIcon';
import useRouting from '~/hooks/useRouting';
import useFocusEffect from '~/hooks/useFocusEffect';

function HomeHeader() {
  const [shortAdress, setShortAdress] = useState('Carregando endereço...');
  const { navigate } = useRouting();

  useFocusEffect(
    React.useCallback(() => {
      getShortAddress().then(setShortAdress);
    }, [])
  );

  return (
    <View
      style={[
        {
          backgroundColor: myColors.background,
          width: '100%',
          paddingTop: 4,
          paddingBottom: 12,
        },
        globalStyles.notch,
      ]}>
      <MyText style={styles.text}>Mostrando ofertas próximas à</MyText>
      <View style={styles.icon}>
        <MyIcon name='map-marker' size={30} color={myColors.primaryColor} />
        <MyButton
          type='clear'
          title={shortAdress}
          titleStyle={{
            color: myColors.text5,
            fontFamily: myFonts.Condensed,
            fontSize: 17,
          }}
          iconRight
          icon={{ name: 'chevron-right', color: myColors.text5 }}
          path='/endereco'
          params={{ back: 'inicio' }}
        />
      </View>
      <View style={{ marginHorizontal: 16 }}>
        <MyDivider
          style={{
            backgroundColor: myColors.divider3,
            marginBottom: 8,
            marginTop: -1,
          }}
        />
        <MySearchbar onSubmit={(search) => navigate('/pesquisa', { search })} />
      </View>
    </View>
  );
}

export function ListHeader({
  title = 'Ofertas',
  barless = false,
}: {
  title?: string;
  barless?: boolean;
}) {
  return (
    <View style={{ width: '100%', height: 48, elevation: 10, zIndex: 10 }}>
      {!barless && <MyDivider style={{ height: 2 }} />}
      <View style={styles.line2}>
        <MyText style={styles.ofertasText}>{title}</MyText>
        <View style={styles.filerButton}>
          <MyButton
            type='clear'
            title='Filtros'
            titleStyle={{ color: myColors.grey2 }}
            icon={{ name: 'tune', color: myColors.grey2 }}
            path='/filtro'
          />
        </View>
      </View>
    </View>
  );
}

// props from the `/inicio/explore/[city]` route
function Home(props: { products?: Product[]; slides?: string[] }) {
  const { products, slides } = props;
  const [tryAgain, setTryAgain] = useState(false);
  const { params } = useRouting();

  React.useEffect(() => {
    if (params?.callback === 'refresh') {
      setTryAgain((v) => !v);
    }
  }, [params]);

  return (
    <>
      <HomeHeader />
      <View style={{ backgroundColor: myColors.background, flex: 1 }}>
        <ProdList
          data={products}
          tryAgain={tryAgain}
          header={
            <View>
              <Slider data={slides} />

              <View style={styles.buttons}>
                <IconButtonText
                  icon='basket'
                  text='Mercados'
                  path='/inicio/lista-mercados'
                />
                <IconButtonText
                  icon='ticket-percent'
                  text='Cupons'
                  path='/inicio/cupons'
                />
                <IconButtonText
                  icon='heart'
                  text='Favoritos'
                  path='/inicio/favoritos'
                />
              </View>
              <ListHeader />
            </View>
          }
        />
      </View>
    </>
  );
}

const top = device.web ? 10 : 0;
const iconTop = device.android ? -12 : -8;
const styles = StyleSheet.create({
  text: {
    marginTop: top,
    marginStart: 78,
    color: myColors.text2,
  },
  icon: {
    flexDirection: 'row',
    marginTop: iconTop,
    marginStart: 40,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: -4,
    marginHorizontal: 16,
    paddingBottom: 6,
  },
  line2: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: myColors.background,
    width: '100%',
    height: 44,
    paddingLeft: 16,
    paddingRight: 8,
  },
  ofertasText: {
    color: myColors.primaryColor,
    fontSize: 20,
    fontWeight: 'bold',
  },
  filerButton: {
    alignItems: 'flex-end',
    flex: 1,
  },
});

export default WithBottomNav(Home);
