import style from './Marketplace.module.scss';
import { useEffect, useState } from 'react';
import { UserProduct } from '../../types/UserProduct';
import { Link, useParams } from 'react-router-dom';
import { ShortNav } from '../ShortNav';
import { UserProduct as UserProductComponent } from '../UserProduct/UserProduct';
const URL = 'http://localhost:4000';
type Quality = 'new' | 'used' | 'all';
type Category = 'phones' | 'tablets' | 'accessories' | 'other' | 'all';

function sortProducts(
  products: UserProduct[],
  category: Category,
  quality: Quality,
  query: string,
): UserProduct[] {
  let filteredProducts = [...products];

  if (category !== 'all') {
    filteredProducts = filteredProducts.filter(
      product => product.category === category,
    );
  }

  if (quality !== 'all') {
    filteredProducts = filteredProducts.filter(
      product => product.quality === quality,
    );
  }

  if (query) {
    filteredProducts = filteredProducts.filter(product =>
      product.title.toLowerCase().includes(query.toLowerCase().trim()),
    );
  }

  return filteredProducts;
  // return products.filter(
  //   product => product.category === category && product.quality === quality
  // );
}

export const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<UserProduct[]>([]);
  const [originalProducts, setOriginalProducts] = useState<UserProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Category>('all');
  const [quality, setQuality] = useState<Quality>('all');
  const [query, setQuery] = useState('');
  const { productId } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // подключаемся к твоему серверу напрямую
        const response = await fetch('http://localhost:4000/posts');
        if (!response.ok) {
          throw new Error('Ошибка загрузки постов');
        }
        const data: UserProduct[] = await response.json();
        setOriginalProducts(data);
        setProducts(data);
      } catch (error) {
        console.error('Не удалось загрузить посты:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (productId) {
    return <UserProductComponent />;
  }

  return (
    <section className={style.marketplace}>
      <ShortNav breadcrumb={'Marketplace'} />
      <div className={`container ${style.marketplace__container}`}>
        <div className={style.marketplaceHeader}>
          <h1 className={style.title}>Choose your product</h1>
          <div className={style.nav}>
            <div className={style.navTop}>
              <div className={`${style.search}`}>
                <label htmlFor="search" className={style.label}>
                  Search something for yourself
                </label>
                <input
                  type="text"
                  id="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className={`${style.input} ${style['input--search']}`}
                  placeholder="Search..."
                />
              </div>
            </div>
            <div className={style.navBottom}>
              {' '}
              <div className={`${style.filters} ${style.navContainer}`}>
                <label htmlFor="category" className={style.label}>
                  Category
                </label>
                <select
                  name="category"
                  id="category"
                  value={category}
                  onChange={e => setCategory(e.target.value as Category)}
                  className={`${style['select--category']} ${style.select}`}
                >
                  <option value="all" className={style.option}>
                    All
                  </option>
                  <option value="phones" className={style.option}>
                    Phones
                  </option>
                  <option value="tablets" className={style.option}>
                    Tablets
                  </option>
                  <option value="accessories" className={style.option}>
                    Accessories
                  </option>
                  <option value="other" className={style.option}>
                    Other
                  </option>
                </select>
              </div>
              <div className={`${style.sort} ${style.navContainer}`}>
                <label htmlFor="quality" className={style.label}>
                  Quality
                </label>
                <select
                  name="quality"
                  id="quality"
                  onChange={e => setQuality(e.target.value as Quality)}
                  value={quality}
                  className={`${style['select--sort']} ${style.select}`}
                >
                  <option value="all" className={style.option}>
                    All
                  </option>
                  <option value="new" className={style.option}>
                    New
                  </option>
                  <option value="used" className={style.option}>
                    Used
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className={style.userProducts}>
          {products.length === 0 ? (
            <p>Пока нет объявлений</p>
          ) : (
            // products.map(product => (
            sortProducts(originalProducts, category, quality, query).map(
              product => (
                <Link
                  to={`${product.id}`}
                  // state={{ category: product.category }}
                >
                  <div key={product.id} className={style.userProduct}>
                    <div className={style.imageContainer}>
                      <img
                        src={`${URL}${product.images[0]}`}
                        alt={product.title}
                        className={style.productImage}
                      />
                    </div>
                    <div className={style.shortDescription}>
                      <h2 className={style.productTitle}>{product.title}</h2>
                      <div className={style.descriptionBottom}>
                        <p className={style.productQuality}>
                          Quality: {product.quality}
                        </p>
                        <p className={style.productPrice}>
                          Price: {product.price}$
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ),
            )
          )}
        </div>
      </div>
    </section>
  );
};
