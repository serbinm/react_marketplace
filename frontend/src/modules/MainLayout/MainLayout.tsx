import { Outlet } from 'react-router-dom';
import { Header } from '../HomePage/components/Header';
import { Footer } from '../HomePage/components/Footer';

export const MainLayout: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
