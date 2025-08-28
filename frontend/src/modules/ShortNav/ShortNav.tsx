import { Link } from 'react-router-dom';
import style from './ShortNav.module.scss';

type Props = {
  breadcrumb: string;
};

export const ShortNav: React.FC<Props> = ({ breadcrumb }) => {
  return (
    <div className={`${style.shortNav} ${style['phones-nav']}`}>
      <div className={`container ${style['shortNav__container']}`}>
        <Link to="/">
          <img
            src="/public/img/icons/home.svg"
            alt="home"
            className={style.icon}
          />
        </Link>
        <span className={style.arrow}></span>
        <span className={style.text}>{breadcrumb}</span>
      </div>
    </div>
  );
};
