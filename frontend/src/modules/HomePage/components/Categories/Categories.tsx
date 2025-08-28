import { Link } from 'react-router-dom';

export const Categories: React.FC = () => {
  return (
    <section className="categories">
      <div className="container categories__container">
        <h2 className="categories__title">Shop by category</h2>
        <div className="categories__links">
          <Link to="/phones" className="categories__link">
            <img
              src="/public/img/categories/phones.jpg"
              alt="phones"
              className="categories__image"
            />
            <div className="categories__description">
              <span className="categories__text">Mobile phones</span>
              <span className="categories__text categories__text--small">
                98 models
              </span>
            </div>
          </Link>
          <Link to="/tablets" className="categories__link">
            <img
              src="/public/img/categories/tablets.jpg"
              alt="tablets"
              className="categories__image"
            />
            <div className="categories__description">
              <span className="categories__text">Tablets</span>
              <span className="categories__text categories__text--small">
                24 models
              </span>
            </div>
          </Link>
          <Link to="/accessories" className="categories__link">
            <img
              src="/public/img/categories/accessories.jpg"
              alt="accessories"
              className="categories__image"
            />
            <div className="categories__description">
              <span className="categories__text">Accessories</span>
              <span className="categories__text categories__text--small">
                100 models
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
