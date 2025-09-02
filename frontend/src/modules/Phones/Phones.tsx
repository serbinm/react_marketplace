import { Link, useParams } from 'react-router-dom';

import { Product } from '../../types/Product';
import { ProductsList } from '../ProductsList/ProductsList';
import { ItemCard } from '../ItemCard';

// let filterProducts = (list: Product[], filter: any) => {
//   switch (filter) {
//     case 'year':
//       return list.filter(product => product.year === 2022);
//     case 'discount':
//       return list.sort((productA, productB) => productB.price - productA.price);
//     default:
//       return list;
//   }
// };

type Props = {
  breadcrumb: string;
  title: string;
  category: string;
};

export const Goods: React.FC<Props> = ({ breadcrumb, title, category }) => {
  const { itemId } = useParams();

  if (itemId) {
    return <ItemCard />;
  }
  
  return (
    <section className="phones">
      <div className="container phones__container">
        <div className="phones__nav phones-nav">
          <Link to="/" className="phones-nav__link">
            <img
              src="/public/img/icons/home.svg"
              alt="home"
              className="phones-nav__icon"
            />
          </Link>
          <span className="phones-nav__arrow"></span>
          <span className="phones-nav__text">{breadcrumb}</span>
        </div>
        <ProductsList title={title} category={category} />
      </div>
    </section>
  );
};
