import { ProductCard } from '../ProductCard';
import { useEffect, useState } from 'react';
import { Product } from '../../types/Product';
import classNames from 'classnames';
const MAX_ITMES = 16;
// const API_URL_PRODUCTS = '/api/products';
const API_URL_PRODUCTS = '/api/hot-deals';

type Sort = 'newest' | 'alphabetically' | 'cheapest';
type Quantity = 1 | 4 | 8 | 16 | 'all';

// function getProducts(list: Product[], category: string) {
//   let filteredList = [...list];
//   switch (category) {
//     case 'phones':
//       filteredList = filteredList.filter(
//         product => product.category === 'phones',
//       );
//       break;
//     case 'tablets':
//       filteredList = filteredList.filter(
//         product => product.category === 'tablets',
//       );
//       break;
//     case 'accessories':
//       filteredList = filteredList.filter(
//         product => product.category === 'accessories',
//       );
//       break;
//     default:
//       break;
//   }

//   return filteredList;
// }
function getProducts(list: Product[], category: string) {
  if (category === 'all') {
    // Добавим случай "все товары", если понадобится
    return [...list];
  }
  return list.filter(product => product.category === category);
}

function sortProducts(list: Product[], sort: Sort, number: Quantity) {
  let sortedList = [...list];
  switch (sort) {
    case 'newest':
      sortedList.sort((a, b) => b.year - a.year);
      break;
    case 'alphabetically':
      sortedList.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'cheapest':
      sortedList.sort((a, b) => a.price - b.price);
      break;
    default:
      break;
  }

  // if (number !== 'all') {
  //   sortedList = sortedList.slice(0, number);
  // }

  return sortedList;
}

function getPageCount(list: Product[], number: number) {
  let pageCount = Math.ceil(list.length / number);

  let pages = [];

  for (let i = 1; i <= pageCount; i++) {
    pages.push(i);
  }

  return pages;
}

type Props = {
  title: string;
  category: string;
};

export const ProductsList: React.FC<Props> = ({ title, category }) => {
  const [sort, setSort] = useState<Sort>('newest');
  const [number, setNumber] = useState<Quantity>('all');
  const [productList, setProductList] = useState<Product[]>([]);
  const [originalProductList, setOriginalProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationStart, setPaginationStart] = useState(1);

  // old data loading with localhost:4000
  // useEffect(() => {
  //   fetch('/api/products.json')
  //     .then(res => {
  //       if (!res.ok) {
  //         throw new Error('Ошибка загрузки данных');
  //       }
  //       return res.json();
  //     })
  //     .then(data => {
  //       setOriginalProductList(getProducts(data, category));
  //       let sortedList = sortProducts(originalProductList, sort, number);

  //       setProductList(sortedList);
  //     })
  //     .catch(error => {
  //       console.error('Fetch error:', error);
  //     })
  //     .finally(() => setLoading(false));
  // }, [title, category]);

  useEffect(() => {
    setLoading(true);
    fetch(API_URL_PRODUCTS)
      .then(res => {
        if (!res.ok) {
          console.log(res);
          throw new Error('Error loading data from server');
        }
        return res.json();
      })
      .then((allProducts: Product[]) => {
        // Фильтруем полученные данные по нужной категории
        const categoryProducts = getProducts(allProducts, category);
        setOriginalProductList(categoryProducts);
      })
      .catch(error => {
        console.error('Fetch error:', error);
        // Можно добавить стейт для ошибки и показать ее пользователю
      })
      .finally(() => {
        setLoading(false);
      });
  }, [category]);

  useEffect(() => {
    let sortedList = sortProducts(originalProductList, sort, number);

    setProductList(sortedList);
  }, [sort, number, originalProductList]);

  if (loading) {
    return <div className="productsList__loader">Loading products...</div>;
  }

  return (
    <>
      <section className="productsList">
        <h1 className="productsList__title">{title}</h1>
        <span className="productsList__number">
          {originalProductList.length} models
        </span>

        <div className="productsList__controls">
          <div className="productsList__control">
            <label htmlFor="" className="productsList__label">
              Sort by
            </label>
            <div className="productsList__selectWrapper">
              <select
                value={sort}
                className="productsList__select productsList__select--sort"
                onChange={event => setSort(event.target.value as Sort)}
              >
                <option value="newest">Newest</option>
                <option value="alphabetically">Alphabetically</option>
                <option value="cheapest">Cheapest</option>
              </select>
            </div>
          </div>
          <div className="productsList__control">
            <label htmlFor="" className="productsList__label">
              Items on page
            </label>
            <div className="productsList__selectWrapper">
              <select
                value={number}
                className="productsList__select productsList__select--number"
                onChange={event => {
                  setNumber(event.target.value as Quantity);
                  if (event.target.value !== 'all') {
                    setCurrentPage(1);
                  }
                }}
              >
                <option value={1}>1</option>
                <option value={4}>4</option>
                <option value={8}>8</option>
                <option value={16}>16</option>
                <option value="all">All</option>
              </select>
            </div>
          </div>
        </div>

        <div className="productsList__wrapper">
          {productList.length > 0 &&
            productList
              .slice((currentPage - 1) * 16, currentPage * 16)
              // .map(product => (
              //   <ProductCard product={product} key={product._id} />
              // ))}
              .map(product => {
                console.log(product);
                return <ProductCard product={product} key={product._id} />;
              })}
        </div>

        {/* #region pagination */}
        {number === 'all' && (
          <div className="productsList__pagination productsList-pagination">
            <button
              className="productsList-pagination__btn productsList-pagination__btn--prev"
              onClick={() => {
                let newPage = currentPage - 1;
                if (newPage < paginationStart && newPage !== 0) {
                  setPaginationStart(paginationStart - 1);
                }
                setCurrentPage(prevPage => {
                  return prevPage > 1 ? prevPage - 1 : prevPage;
                });
              }}
            ></button>
            <div className="productsList-pagination__pages">
              {number === 'all' &&
                getPageCount(productList, MAX_ITMES)
                  .slice(paginationStart - 1, paginationStart + 3)
                  .map((page, index) => {
                    return (
                      <button
                        className={classNames(
                          'productsList-pagination__btn productsList-pagination__btn--number productsList-pagination__btn--number',
                          {
                            'productsList-pagination__btn--active':
                              currentPage === page,
                          },
                        )}
                        key={index}
                        onClick={() => {
                          setCurrentPage(page);
                        }}
                      >
                        {page}
                      </button>
                    );
                  })}
            </div>

            <button
              className="productsList-pagination__btn productsList-pagination__btn--next"
              onClick={() => {
                let newPage = currentPage + 1;
                if (
                  newPage > paginationStart + 3 &&
                  newPage <= Math.ceil(productList.length / 16)
                ) {
                  setPaginationStart(paginationStart + 1);
                }
                setCurrentPage(prevPage => {
                  return prevPage < Math.ceil(productList.length / MAX_ITMES)
                    ? prevPage + 1
                    : prevPage;
                });
              }}
            ></button>
          </div>
        )}
        {/* #endregion */}
      </section>
    </>
  );
};
