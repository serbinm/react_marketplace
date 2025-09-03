import { useEffect, useState } from 'react';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Product } from '../../../../types/Product';

// const getProducts = () => {
//   return fetch('/api/products.json').then(res => {
//     return res.json();
//   });
// };

// let filterProductsYear = (list: Product[], year: number) => {
//   console.log(list.filter(product => product.year === 2022));
//   // return [];
//   return list.filter(product => product.year === 2022);
// };

let filterProducts = (list: Product[], filter: any) => {
  switch (filter) {
    case 'year':
      return list.filter(product => product.year === 2022);
    case 'discount':
      return list.sort((productA, productB) => productB.price - productA.price);
    // return list.sort((productA, productB) => productB.price - productA.price);
    default:
      return list;
  }
};

type Props = {
  title: string;
  filter: any;
};

export const ProductSlider: React.FC<Props> = ({ title, filter }) => {
  const [productsList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    new Swiper('#productSlider--newModels', {
      // slidesPerView: 1,
      slidesPerView: 'auto',
      spaceBetween: 22,
      modules: [Navigation],
      navigation: {
        nextEl: '.productSlider__nav .productSlider-newModels-next',
        prevEl: '.productSlider__nav .productSlider-newModels-prev',
      },
    });
  }, []);

  useEffect(() => {
    fetch('/api/hot-deals')
      .then(res => {
        if (!res.ok) {
          throw new Error('Ошибка загрузки данных');
        }
        return res.json();
      })
      .then(data => setProductList(data))
      .catch(error => {
        console.error('Fetch error:', error);
      })
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="productSlider">
      <div className="container productSlider__container">
        <div className="productSlider__top">
          <h2 className="productSlider__title">{title}</h2>
          <div className="productSlider__nav">
            <div
              className="swiper-button-prev productSlider-newModels-prev productSlider-newModels-button"
              id="newModels-prev"
            ></div>
            <div
              className="swiper-button-next productSlider-newModels-next productSlider-newModels-button"
              id="newModels-next"
            ></div>
          </div>
        </div>
        <div
          className="swiper productSlider--newModels"
          id="productSlider--newModels"
        >
          <div className="swiper-wrapper productSlider__wrapper">
            {productsList.length > 0 &&
              // filterProductsYear(productsList, 2011).map(product => {
              filterProducts(productsList, filter)
                .slice(0, 10)
                .map(product => {
                  return (
                    <div
                      className="swiper-slide productSlider__item"
                      key={product.id}
                    >
                      <div className="productSlider__card product-card">
                        <img
                          src={product.image}
                          alt=""
                          className="product-card__image"
                        />
                        <h3 className="product-card__title">{product.name}</h3>

                        {filter === 'discount' ? (
                          <>
                            <div className="product-card__priceContainer">
                              <span className="product-card__price">
                                {`$${product.price}`}
                              </span>
                              <span className="product-card__price product-card__price--previous">
                                {`$${product.priceRegular}`}
                              </span>
                            </div>
                          </>
                        ) : (
                          <span className="product-card__price">
                            {`$${product.price}`}
                          </span>
                        )}
                        <div className="product-card__properties">
                          <div className="product-card__property">
                            <span className="product-card__name">Screen</span>
                            <span className="product-card__value">
                              {product.screen}
                            </span>
                          </div>
                          <div className="product-card__property">
                            <span className="product-card__name">Capacity</span>
                            <span className="product-card__value">
                              {product.capacity}
                            </span>
                          </div>
                          <div className="product-card__property">
                            <span className="product-card__name">RAM</span>
                            <span className="product-card__value">
                              {product.ram}
                            </span>
                          </div>
                        </div>

                        <div className="product-card__buttons">
                          <button className="product-card__cart">
                            Add to cart
                          </button>
                          <button className="product-card__favourites"></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
};
