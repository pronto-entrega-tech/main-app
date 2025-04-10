import { useCallback, useEffect, useState } from "react";
import { createContext } from "~/contexts/createContext";
import { saveFavorites, getFavorites } from "~/services/localStorage";
import { useStateToRef } from "~/hooks/useStateToRef";

function useFavorites() {
  const [favorites, setFavorites] = useState(new Set<string>());
  const favoritesRef = useStateToRef(favorites);

  useEffect(() => {
    getFavorites().then(setFavorites);
  }, []);

  const toggleFavorite = useCallback(
    (itemId: string) => {
      const favorites = favoritesRef.current;
      const newFavorites = new Set(favorites);

      if (favorites.has(itemId)) {
        !newFavorites.delete(itemId);
      } else {
        newFavorites.add(itemId);
      }

      setFavorites(newFavorites);
      saveFavorites(newFavorites);
    },
    [favoritesRef],
  );

  return {
    favorites,
    toggleFavorite,
  };
}

export const [
  FavoritesProvider,
  useFavoritesContext,
  useFavoritesContextSelector,
] = createContext(useFavorites);
