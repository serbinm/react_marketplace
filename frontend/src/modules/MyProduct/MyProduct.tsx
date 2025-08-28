import { Link } from 'react-router-dom';
// import style from './MyProduct.module.css';
import style from './MyProduct.module.scss';
import { UserProduct } from '../../types/UserProduct';
// const URL = 'http://localhost:4000';
type Props = {
  product: UserProduct;
  edit: boolean;
};

export const MyProduct: React.FC<Props> = ({ product, edit }) => {
  console.log(product);
  return (
    <Link
      to={`${product.id}`}
      // state={{ category: product.category }}
    >
      <div key={product.id} className={style.userProduct}>
        <div className={style.imageContainer}>
          <img
            src={product.images[0]}
            alt={product.title}
            className={style.productImage}
          />
        </div>
        <div className={style.shortDescription}>
          <div className={style.shortDescription__top}>
            <h2 className={style.productTitle}>{product.title}</h2>
            {edit && (
              // <Link to={`/myProducts/${product.id}/edit`}>
              <Link to={`/myProducts/${product.id}/edit`}>
                <button className={style.editButton}>Edit</button>
              </Link>
            )}
          </div>

          <div className={style.descriptionBottom}>
            <p className={style.productQuality}>Quality: {product.quality}</p>
            <p className={style.productPrice}>Price: {product.price}$</p>
          </div>
        </div>
      </div>
    </Link>
  );
};
