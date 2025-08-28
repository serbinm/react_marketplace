import React, { Dispatch, SetStateAction } from 'react';
import { Product } from '../types/Product';

export const CartContext = React.createContext({
  cart: [] as Product[],
  setCart: (() => {}) as Dispatch<SetStateAction<Product[]>>,
});

type Props = {
  children: React.ReactNode;
};

export const CartProvider: React.FC<Props> = ({ children }) => {
  const [cart, setCart] = React.useState<Product[]>([]);

  const value = React.useMemo(() => ({ cart, setCart }), [cart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
