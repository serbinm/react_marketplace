import './ProductCard.module.scss';
import { Product } from '../../types/Product';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { FavoritesContext } from '../../contexts/';
import { CartContext } from '../../contexts';
import classNames from 'classnames';

type Props = {
  product: Product;
};

export const ProductCard: React.FC<Props> = ({ product }) => {
  const { favorites, setFavorites } = useContext(FavoritesContext);
  const { cart, setCart } = useContext(CartContext);

  return (
    <Link to={`${product.itemId}`} state={{ category: product.category }}>
      <div className="productCard">
        <img src={product.image} alt="" className="productCard__image" />
        <h3 className="productCard__title">{product.name}</h3>

        <div className="productCard__priceContainer">
          <span className="productCard__price">{`$${product.price}`}</span>
          <span className="productCard__price productCard__price--previous">
            {`$${product.priceRegular}`}
          </span>
        </div>

        <div className="productCard__properties">
          <div className="productCard__property">
            <span className="productCard__name">Screen</span>
            <span className="productCard__value">{product.screen}</span>
          </div>
          <div className="productCard__property">
            <span className="productCard__name">Capacity</span>
            <span className="productCard__value">{product.capacity}</span>
          </div>
          <div className="productCard__property">
            <span className="productCard__name">RAM</span>
            <span className="productCard__value">{product.ram}</span>
          </div>
        </div>

        <div className="productCard__buttons">
          <button
            className="productCard__cart"
            onClick={event => {
              event.stopPropagation();
              event.preventDefault(); // reset link onclick behavior

              setCart(prevCart => {
                const existingProduct = prevCart.find(
                  item => item.id === product.id,
                );

                if (existingProduct) {
                  // return prevCart.filter(item => item.id !== product.id);
                  // return [...prevCart, {...product, quantity: product.quantity + 1}];
                  return prevCart.map(item =>
                    item.id === product.id
                      ? { ...item, quantity: item.quantity + 1 }
                      : item,
                  );
                } else {
                  // return [...prevCart, product];
                  return [...prevCart, { ...product, quantity: 1 }];
                }
              });
              console.log(cart);
            }}
          >
            Add to cart
          </button>
          <button
            // className="productCard__favorites"
            className={classNames('productCard__favorites', {
              'productCard__favorites--active': favorites.some(
                item => item.id === product.id,
              ),
            })}
            onClick={event => {
              event.stopPropagation();
              event.preventDefault(); // reset link onclick behavior

              setFavorites(prevFavorites => {
                const exists = prevFavorites.some(
                  item => item.id === product.id,
                );
                if (exists) {
                  return prevFavorites.filter(item => item.id !== product.id);
                } else {
                  return [...prevFavorites, product];
                }
              });
            }}
          ></button>
        </div>
      </div>
    </Link>
  );
};
