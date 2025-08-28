import { Link } from 'react-router-dom';
import './Footer.module.scss';
export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container footer__container">
        <Link to="/" className="footer__logo">
          <img
            src="/public/img/header/header-logo.png"
            alt=""
            className="footer__image"
          />
        </Link>
        <nav className="footer__nav">
          <ul className="footer__list">
            <li className="footer__item">
              <Link to="" className="footer__link">
                github
              </Link>
            </li>
            <li className="footer__item">
              <Link to="" className="footer__link">
                contacts
              </Link>
            </li>
            <li className="footer__item">
              <Link to="" className="footer__link">
                rights
              </Link>
            </li>
          </ul>
        </nav>
        <div className="footer__anchor">
          <span className="footer__text"> Back to top</span>
          <a href="#top" className="footer__anchorLink"></a>
        </div>
      </div>
    </footer>
  );
};
