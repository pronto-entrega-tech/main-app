import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { WithBottomNav } from "~/components/Layout";
import { myColors, device, globalStyles, myFonts } from "~/constants";
import Banners from "~/components/Banners";
import IconButtonText from "~/components/IconButtonText";
import ProdList from "~/components/ProdList";
import MyDivider from "~/components/MyDivider";
import MySearchBar from "~/components/MySearchBar";
import MyButton from "~/components/MyButton";
import MyText from "~/components/MyText";
import MyIcon from "~/components/MyIcon";
import useRouting from "~/hooks/useRouting";
import { Banner, Product } from "~/core/models";
import { stringifyShortAddress } from "~/functions/converter";
import { useAddressContext } from "~/contexts/AddressContext";
import Animated, {
  runOnUI,
  setNativeProps,
  useAnimatedProps,
  useAnimatedRef,
  useSharedValue,
} from "react-native-reanimated";
import { TextInput } from "react-native";

const AddressButton = () => {
  const { address } = useAddressContext();
  const shortAddress = address
    ? stringifyShortAddress(address)
    : address === null
      ? "Escolha um endereço"
      : "Carregando endereço...";

  return (
    <MyButton
      title={shortAddress}
      screen="Addresses"
      type="clear"
      titleStyle={styles.headerTitle}
      iconRight
      icon={{ name: "chevron-right", color: myColors.text5 }}
    />
  );
};

const HomeHeader = () => {
  const { navigate } = useRouting();

  return (
    <View style={[styles.headerContainer, globalStyles.notch]}>
      <MyText style={styles.text}>Mostrando ofertas próximas à</MyText>
      <View style={styles.icon}>
        <MyIcon name="map-marker" size={30} color={myColors.primaryColor} />
        <AddressButton />
      </View>
      <View style={{ marginHorizontal: 16 }}>
        <MyDivider style={styles.headerDivider} />
        <MySearchBar onSubmit={(query) => navigate("Search", { query })} />
      </View>
    </View>
  );
};

export const ListHeader = ({
  title = "Ofertas",
  barless = false,
}: {
  title?: string;
  barless?: boolean;
}) => (
  <View style={{ width: "100%", height: 48, elevation: 10, zIndex: 10 }}>
    {!barless && <MyDivider style={{ height: 2 }} />}
    <View style={styles.line2}>
      <MyText style={styles.ofertasText}>{title}</MyText>
      <View style={styles.filerButton}>
        <MyButton
          type="clear"
          title="Filtros"
          titleStyle={{ color: myColors.grey2 }}
          icon={{ name: "tune", color: myColors.grey2 }}
          screen="Filter"
        />
      </View>
    </View>
  </View>
);

// props from the `/inicio/explore/[city]` route
export type HomeProps = { products?: Product[]; banners?: Banner[] };

const Home = (p: HomeProps) => {
  const { products, banners } = p;

  return (
    <>
      <HomeHeader />
      <View style={{ backgroundColor: myColors.background, flex: 1 }}>
        <ProdList
          data={products}
          header={
            <View>
              <Banners banners={banners} />

              <View style={styles.buttons}>
                <IconButtonText
                  icon="basket"
                  text="Mercados"
                  screen="MarketList"
                />
                <IconButtonText
                  icon="ticket-percent"
                  text="Cupons"
                  screen="Cupons"
                />
                <IconButtonText
                  icon="heart"
                  text="Favoritos"
                  screen="Favorites"
                />
              </View>
              <ListHeader />
            </View>
          }
        />
      </View>
    </>
  );
};

const top = device.web ? 10 : 0;
const iconTop = device.android ? -12 : -8;
const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: myColors.background,
    width: "100%",
    paddingTop: 4,
    paddingBottom: 12,
  },
  headerTitle: {
    color: myColors.text5,
    fontFamily: myFonts.Condensed,
    fontSize: 17,
  },
  headerDivider: {
    backgroundColor: myColors.divider3,
    marginBottom: 8,
    marginTop: -1,
  },
  text: {
    marginTop: top,
    marginStart: 78,
    color: myColors.text2,
  },
  icon: {
    flexDirection: "row",
    marginTop: iconTop,
    marginStart: 40,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  line2: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: myColors.background,
    width: "100%",
    height: 44,
    paddingLeft: 16,
    paddingRight: 8,
  },
  ofertasText: {
    color: myColors.primaryColor,
    fontSize: 20,
    fontFamily: myFonts.Bold,
  },
  filerButton: {
    alignItems: "flex-end",
    flex: 1,
  },
});

export default WithBottomNav(Home);
