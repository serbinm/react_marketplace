import styles from './Favorites.module.scss';
import React, { useContext } from 'react';
import { FavoritesContext } from '../../../../contexts/FavoritesContext';
import { ProductCard } from '../../../ProductCard';
import { Link } from 'react-router-dom';
export const Favorites: React.FC = () => {
  const { favorites } = useContext(FavoritesContext);
  return (
    <section className={styles.favorites}>
      <div className={`container ${styles.favoritesContainer}`}>
        <div className={styles.nav}>
          <Link to="/" className={styles.navLink}>
            <img
              src="/public/img/icons/home.svg"
              alt="home"
              className={styles.navIcon}
            />
          </Link>
          <span className={styles.navArrow}></span>
          <span className={styles.navText}>Favourites</span>
        </div>
        <div className={styles.favoritesHeader}>
          <h1 className={styles.favoritesTitle}>Favourites</h1>
          <span className={styles.favoritesNumber}>
            {favorites.length} items
          </span>
        </div>
        <div className={styles.favoritesWrapper}>
          {favorites.length > 0 ? (
            favorites.map(product => (
              <ProductCard product={product} key={product.id} />
            ))
          ) : (
            <h1>No items yet</h1>
          )}
        </div>
      </div>
    </section>
  );
};
