import React, { useEffect, useState } from 'react';
import style from './MyProducts.module.scss';
import { MyProduct } from '../MyProduct/MyProduct';
import { Outlet, useParams } from 'react-router-dom';
import { UserProduct } from '../../types/UserProduct'; // ИЗМЕНЕНО: Импортируем тип для строгой типизации
// import { fetchWithAuth } from '../../api'; // ИЗМЕНЕНО: Импортируем нашу обертку для fetch
import { fetchWithAuth } from '../../api/api';
import { ShortNav } from '../ShortNav';
export const MyProducts: React.FC = () => {
  const [products, setProducts] = useState<UserProduct[]>([]);
  // Добавим состояние для отслеживания загрузки
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { productId } = useParams();

  // data loading
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Используем нашу централизованную функцию.
        // Она сама добавит токен и обработает истечение сессии!
        const response = await fetchWithAuth('http://localhost:4000/my-posts');

        // fetchWithAuth перехватит 401/403 и выйдет из системы.
        // Но нам все еще нужно проверить другие ошибки (например, 500 - ошибка сервера).
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Не удалось загрузить данные');
        }

        const data: UserProduct[] = await response.json();
        console.log('ДАННЫЕ С СЕРВЕРА:', data); // <--- ДОБАВЬТЕ ЭТУ СТРОКУ
        setProducts(data);
      } catch (err: any) {
        // Если ошибка 'Session expired', пользователь уже перенаправлен,
        // и мы можем ничего не делать. Для других ошибок покажем сообщение.
        if (err.message !== 'Session expired') {
          console.error('Ошибка при загрузке товаров:', err);
          setError(
            'Не удалось загрузить ваши товары. Попробуйте обновить страницу.',
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Рендеринг в зависимости от состояния загрузки и ошибок
  if (isLoading) {
    return (
      <section className={style.myProducts}>
        <div className="container">
          <h1 className={style.title}>My Products</h1>
          <p>Загрузка...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={style.myProducts}>
        <div className="container">
          <h1 className={style.title}>My Products</h1>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={style.myProducts}>
      {!productId ? <ShortNav breadcrumb="My Products" /> : <></>}
      <div className={`container ${style.userProducts}`}>
        {/*
          Если в URL есть productId, значит мы на странице просмотра/редактирования.
          В этом случае мы показываем ТОЛЬКО дочерний компонент через Outlet.
          
          Если productId нет, значит мы на главной странице /myProducts.
          В этом случае мы показываем заголовок и список продуктов.
        */}
        {productId ? (
          <Outlet />
        ) : (
          <>
            <h1 className={style.title}>My Products</h1>
            {products.length > 0 ? (
              products.map(product => (
                <MyProduct key={product.id} product={product} edit={true} />
              ))
            ) : (
              <p>У вас пока нет добавленных товаров.</p>
            )}
          </>
        )}
      </div>
    </section>
  );
};
