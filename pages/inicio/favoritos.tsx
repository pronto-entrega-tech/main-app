import React from "react";
import { View } from "react-native";
import MySearchBar from "~/components/MySearchBar";
import ProdListHorizontal from "~/components/ProdListHorizontal";
import MyText from "~/components/MyText";
import { WithBottomNav } from "~/components/Layout";
import MyHeader from "~/components/MyHeader";
import { useFavoritesContext } from "~/contexts/FavoritesContext";
import globalStyles from "~/constants/globalStyles";
import myColors from "~/constants/myColors";

const Favorites = () => {
  const { favorites } = useFavoritesContext();

  return (
    <>
      <MyHeader title="Favoritos" smallDivider />
      <View style={{ marginTop: 12, marginBottom: 8, paddingHorizontal: 16 }}>
        <MySearchBar onSubmit={() => 0} />
      </View>
      {!favorites.size ? (
        <View style={globalStyles.centralizer}>
          <MyText style={{ fontSize: 15, color: myColors.text2 }}>
            Nenhum produto salvo
          </MyText>
        </View>
      ) : (
        <ProdListHorizontal
          style={{ paddingTop: 12 }}
          searchParams={{ ids: [...favorites.values()] }}
        />
      )}
    </>
  );
};

export default WithBottomNav(Favorites);
