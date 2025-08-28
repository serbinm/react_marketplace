import { Route, Router, Routes } from 'react-router-dom';
import './App.scss';

import { MainLayout } from './modules/MainLayout';
import { HomePage } from './modules/HomePage/HomePage';
import { Phones } from './modules/Phones/Phones';
import { Tablets } from './modules/Tablets/components/Tablets';
import { Accesories } from './modules/Accessories/components/Accessories';
import { Favorites } from './modules/Favorites/components/Favorites';
import { Cart } from './modules/Cart/components/Cart';
import { ItemCard } from './modules/ItemCard';
import { Register } from './modules/Register';
import { Marketplace } from './modules/Marketplace';
import { UserProduct } from './modules/UserProduct';
import { MyProducts } from './modules/MyProducts';
import { CreatePost } from './modules/CreatePost';

// Home, Phones, Tablets, Accesorries, Favourite, Cart;
export const App = () => (
  <Routes>
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />

      <Route
        path="phones"
        element={
          <Phones
            breadcrumb={'Phones'}
            title={'Mobile phones'}
            category={'phones'}
          />
        }
      >
        <Route path=":itemId" element={<ItemCard />} />
      </Route>

      <Route
        path="tablets"
        element={
          <Phones
            breadcrumb={'Tablets'}
            title={'Tablets'}
            category={'tablets'}
          />
        }
      >
        <Route path=":itemId" element={<ItemCard />} />
      </Route>

      <Route
        path="accessories"
        element={
          <Phones
            breadcrumb={'Accessories'}
            title={'Accessories'}
            category={'accessories'}
          />
        }
      >
        <Route path=":itemId" element={<ItemCard />} />
      </Route>

      <Route path="register" element={<Register />}></Route>

      <Route path="createPost" element={<CreatePost />} />

      <Route path="marketplace" element={<Marketplace />}>
        <Route path=":productId" element={<ItemCard />} />
      </Route>

      <Route path="favorites" element={<Favorites />}>
        <Route path=":itemId" element={<UserProduct />} />
      </Route>

      <Route path="myProducts" element={<MyProducts />}>
        <Route path=":productId" element={<UserProduct />} />
        <Route path=":productId/edit" element={<CreatePost />} />
      </Route>

      <Route path="cart" element={<Cart />} />
    </Route>
  </Routes>
);
