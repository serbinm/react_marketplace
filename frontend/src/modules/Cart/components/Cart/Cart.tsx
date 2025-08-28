import styles from './Cart.module.scss';
import React, { useContext, useMemo } from 'react';
import { CartContext } from '../../../../contexts/CartContext';
import { Link } from 'react-router-dom';
import { ShortNav } from '../../../ShortNav';

export const Cart: React.FC = () => {
  const { cart, setCart } = useContext(CartContext);

  let itemsNumber = useMemo(() => {
    return cart.reduce((acc, item) => {
      return (acc += item.quantity);
    }, 0);
  }, [cart]);

  return (
    <section className={styles.cart}>
      <ShortNav breadcrumb='Cart'/>
      <div className={`container ${styles.cartContainer}`}>
        {/* <div className={styles.cartNav}>
          <Link to="/" className={styles.cartNavLink}>
            <img
              src="/public/img/icons/home.svg"
              alt="home"
              className={styles.cartNavIcon}
            />
          </Link>
          <span className={styles.cartNavArrow}></span>
          <span className={styles.cartNavText}>Cart</span>
        </div> */}

        <div className={styles.cartHeader}>
          <h1 className={styles.cartTitle}>Cart</h1>
          {/* <span className={styles.cartNumber}>{cart.length} items</span> */}
          {cart.length > 0 && (
            <span className={styles.cartNumber}>
              {itemsNumber > 1 ? `${itemsNumber} items` : `${itemsNumber} item`}
            </span>
          )}
        </div>

        <div className={styles.cartWrapper}>
          <div className={styles.productsContainer}>
            {cart.length > 0 ? (
              cart.map(product => (
                <div className={styles.productCard}>
                  <div className={styles.productCardTop}>
                    <button
                      className={styles.productCancel}
                      onClick={() => {
                        setCart(prevCart => {
                          return prevCart.filter(
                            item => item.id !== product.id,
                          );
                        });
                      }}
                    ></button>
                    <div className={styles.productImageContainer}>
                      <img
                        src={product.image}
                        alt=""
                        className={styles.productImage}
                      />
                    </div>

                    <span className={styles.productName}>{product.name}</span>
                  </div>

                  <div className={styles.productCardBottom}>
                    <div className={styles.productControls}>
                      <button
                        className={`${styles.productControlButton} ${styles.productMinus}`}
                        // onClick={() => {
                        //   setCart(prevCart => {
                        //     let foundItem = prevCart.find(
                        //       item => item.id === product.id,
                        //     );

                        //     if (foundItem) {
                        //       foundItem.quantity -= 1;

                        //       return foundItem.quantity > 0
                        //         ? [...prevCart, foundItem]
                        //         : prevCart.filter(
                        //             item => item.id !== foundItem.id,
                        //           );
                        //     }
                        //   });
                        // }}
                        onClick={() => {
                          setCart(prevCart => {
                            const updatedCart = prevCart.map(item => {
                              if (item.id === product.id) {
                                const newQuantity = item.quantity - 1;
                                return newQuantity > 0
                                  ? { ...item, quantity: newQuantity }
                                  : null; // пометим на удаление
                              }
                              return item;
                            });

                            // фильтруем null (удалённые товары)
                            return updatedCart.filter(item => item !== null);
                          });
                        }}
                      ></button>

                      <span
                        className={`${styles.productControlButton} ${styles.productCount}`}
                      >
                        {product.quantity}
                      </span>

                      <button
                        className={`${styles.productControlButton} ${styles.productPlus}`}
                        onClick={() => {
                          setCart(prevCart => {
                            return prevCart.map(item =>
                              item.id === product.id
                                ? {
                                    ...product,
                                    quantity: product.quantity + 1,
                                  }
                                : { ...product },
                            );
                          });
                        }}
                      ></button>
                    </div>
                    <span
                      className={styles.productPrice}
                    >{`$${product.price}`}</span>
                  </div>
                </div>
              ))
            ) : (
              <h1>No items yet</h1>
            )}
          </div>
          <div className={styles.summaryContainer}>
            <div className={styles.summaryHeader}>
              <span className={styles.summaryPrice}>
                $
                {cart.reduce((acc, product) => {
                  acc += product.price * product.quantity;
                  return acc;
                }, 0)}
              </span>
              <span
                className={styles.summaryQuantity}
              >{`Total for ${cart.length} items`}</span>
            </div>
            <button className={styles.summaryCheckout}>Checkout</button>
          </div>
        </div>
      </div>
    </section>
  );
};
