import { Categories } from './components/Categories';
import { ProductSlider } from './components/ProductSlider';
import { Welcome } from './components/Welcome';

export const HomePage: React.FC = () => {
  return (
    <>
      <Welcome />
      <ProductSlider title={'Brand new models'} filter={'year'} />
      <Categories />
      <ProductSlider title={'Hot prices'} filter={'discount'} />
    </>
  );
};
