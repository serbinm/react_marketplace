import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import style from './Header.module.scss';
import { useAuth } from '../../../../contexts/AuthContext';
export const Header: React.FC = () => {
  const [toggleBurger, setToggleBurger] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Вызываем функцию выхода из контекста
    navigate('/'); // Перенаправляем на главную страницу
  };

  useEffect(() => {
    let mediaQuery = window.matchMedia('(max-width: 600px');

    const handleResize = (event: MediaQueryListEvent) => {
      if (!event.matches) {
        setToggleBurger(false);
      }
    };
    console.log(toggleBurger);
    mediaQuery.addEventListener('change', handleResize);

    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, []);

  return (
    <>
      <header className="header">
        <div className="container header__container">
          <Link to="/">
            <img
              src="/img/header/header-logo.png"
              alt="Nice Gadgets logo"
              className="header__logo"
            />
          </Link>
          <nav className="header__nav">
            <ul className="header__list">
              <li className="header__item">
                <Link to="/" className="header__link">
                  Home
                </Link>
              </li>
              <li className="header__item">
                <Link to="/phones" className="header__link">
                  Phones
                </Link>
              </li>
              <li className="header__item">
                <Link to="/tablets" className="header__link">
                  Tablets
                </Link>
              </li>
              <li className="header__item">
                <Link to="/accessories" className="header__link">
                  Accessories
                </Link>
              </li>
              <li className="header__item">
                <Link to="/marketplace" className="header__link">
                  Marketplace
                </Link>
              </li>
              {isLoggedIn && (
                <>
                  <li className="header__item">
                    <Link to="/myProducts" className="header__link">
                      My Products
                    </Link>
                  </li>
                  <li className="header__item">
                    <Link to="/createPost" className="header__link">
                      List your product
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
          <div className="header__icons">
            {/* <Link to="/register" className="header__icon">
              <img
                src="/public/img/icons/user-icon.svg"
                alt=""
                className="header__favourites"
              />
            </Link> */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className={`header__icon ${style.logout}`}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/register"
                className={`header__icon ${style.login}`}
              >
                <img src="/img/icons/user-icon.svg" alt="Login/Register" />
              </Link>
            )}
            <Link to="favorites" className="header__icon">
              <img
                src="/img/header/header-favourites.svg"
                alt=""
                className="header__favourites"
              />
            </Link>
            <Link to="cart" className="header__icon">
              <img
                src="/img/header/header-shopping.svg"
                alt=""
                className="header__shopping"
              />
            </Link>
            {toggleBurger ? (
              <button
                className="header__icon header__icon--burger"
                onClick={() => setToggleBurger(!toggleBurger)}
              >
                <img
                  src="/img/header/header-close.svg"
                  alt=""
                  className="header__menu"
                />
              </button>
            ) : (
              <button
                className="header__icon header__icon--burger"
                onClick={() => setToggleBurger(!toggleBurger)}
              >
                <img
                  src="/img/header/header-menu.svg"
                  alt=""
                  className="header__menu"
                />
              </button>
            )}
          </div>
        </div>
      </header>
      {toggleBurger && (
        <div className="burger">
          <div className="container burger__container">
            <nav className="burger__nav">
              <ul className="burger__list">
                <li className="burger__item">
                  <Link to="/" className="burger__link">
                    Home
                  </Link>
                </li>
                <li className="burger__item">
                  <Link to="phones" className="burger__link">
                    Phones
                  </Link>
                </li>
                <li className="burger__item">
                  <Link to="tablets" className="burger__link">
                    Tablets
                  </Link>
                </li>
                <li className="burger__item">
                  <Link to="accessories" className="burger__link">
                    Accessories
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="burger__icons">
              <Link to="favourites" className="burger__icon">
                <img
                  src="/img/header/header-favourites.svg"
                  alt=""
                  className="burger__favourites"
                />
              </Link>
              <Link to="cart" className="burger__icon">
                <img
                  src="/img/header/header-shopping.svg"
                  alt=""
                  className="burger__shopping"
                />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
