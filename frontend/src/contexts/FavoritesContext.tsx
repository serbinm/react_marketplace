import React, { Dispatch, SetStateAction } from 'react';
import { Product } from '../types/Product';

export const FavoritesContext = React.createContext({
  favorites: [] as Product[],
  setFavorites: (() => {}) as Dispatch<SetStateAction<Product[]>>,
});

type Props = {
  children: React.ReactNode;
};

export const FavoritesProvider: React.FC<Props> = ({ children }) => {
  const [favorites, setFavorites] = React.useState<Product[]>([]);

  const value = React.useMemo(() => ({ favorites, setFavorites }), [favorites]);
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
