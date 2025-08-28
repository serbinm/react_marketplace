import { createRoot } from 'react-dom/client';
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';

import { FavoritesProvider, CartProvider } from './contexts';
import { AuthProvider } from './contexts/AuthContext';

createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>,
);
