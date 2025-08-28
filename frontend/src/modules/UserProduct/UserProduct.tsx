import { useEffect, useState } from 'react';
import style from './UserProduct.module.scss';
import { UserProduct as UserProductType } from '../../types/UserProduct';
import { useParams } from 'react-router-dom';
import { ShortNav } from '../ShortNav';

const URL_POSTS = 'http://localhost:4000/posts';
// const URL = 'http://localhost:4000';

function filterUserProduct(id: number, data: UserProductType[]) {
  return data.find(product => product.id === Number(id));
}

function changeImage(
  imageIndex: number,
  userProduct: UserProductType,
  action: 'prev' | 'next',
) {
  if (action === 'prev') {
    imageIndex -= 1;
  } else if (action === 'next') {
    imageIndex += 1;
  }

  if (imageIndex > userProduct.images.length - 1) {
    return 0;
  }

  if (imageIndex < 0) {
    return userProduct.images.length - 1;
  }

  return imageIndex;
}
export const UserProduct: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [userProduct, setUserProduct] = useState<UserProductType | null>(null);
  const { productId } = useParams();
  const [imageIndex, setImageIndex] = useState(0);

  console.log('productId', productId);
  console.log(userProduct);
  useEffect(() => {
    if (!productId) return;

    const fetchProducts = async () => {
      try {
        const response = await fetch(URL_POSTS);
        if (!response.ok) {
          throw new Error('Ошибка загрузки постов');
        }
        const data: UserProductType[] = await response.json();
        const product = filterUserProduct(Number(productId), data);
        setUserProduct(product ?? null);
      } catch (error) {
        console.error('Не удалось загрузить посты:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [productId]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <section className={style.userProduct}>
      {userProduct && <ShortNav breadcrumb={userProduct.title} />}
      <div className={`container ${style.userProduct__container}`}>
        <div className={style.imagesContainer}>
          <div className={style.imageContainer}>
            <img
              key={userProduct?.id}
              // src={`${URL}${userProduct?.images[imageIndex]}`}
              src={userProduct?.images[imageIndex]}
              alt={userProduct?.title}
              className={style.image}
            />
            <button
              className={`${style.imageBtn} ${style[`imageBtn--prev`]}`}
              onClick={() =>
                setImageIndex(prevIndex =>
                  changeImage(prevIndex, userProduct!, 'prev'),
                )
              }
            ></button>
            <button
              className={`${style.imageBtn} ${style[`imageBtn--next`]}`}
              onClick={() =>
                setImageIndex(prevIndex =>
                  changeImage(prevIndex, userProduct!, 'next'),
                )
              }
            ></button>
          </div>
        </div>
        <div className={style.descriptionContainer}>
          <h2 className={style.title}>{userProduct?.title}</h2>
          <div className={style.details}>
            <div className={style.detail}>
              <p className={style.name}>Price:</p>
              <p className={style.value}>{userProduct?.price}$</p>
            </div>
            <div className={style.detail}>
              <p className={style.name}>Contact:</p>
              <p className={style.value}>{userProduct?.contactPerson}</p>
            </div>
            <div className={style.detail}>
              <p className={style.name}>Email</p>
              <p className={style.value}>{userProduct?.email}</p>
            </div>
            <div className={style.detail}>
              <p className={style.name}>Phone:</p>
              <p className={style.value}>{userProduct?.phoneNumber}</p>
            </div>
            <div className={`${style.detail} ${style['detail--description']}`}>
              <p className={style.name}>Description</p>
              <p className={`${style.value} ${style['value--description']}`}>
                {userProduct?.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
