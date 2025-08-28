import { useCallback, useEffect, useRef, useState } from 'react';
import style from './CreatePost.module.scss';
import { useNavigate } from 'react-router-dom';
import { UserProduct } from '../../types/UserProduct';
import { useParams } from 'react-router-dom';
import { fetchWithAuth } from '../../api/api'; // ИЗМЕНЕНО: Импортируем нашу главную функцию
import { ShortNav } from '../ShortNav';
// import auth

const MAX_IMAGES = 5;
const URL_POSTS = 'http://localhost:4000/posts';
// const URL = 'http://localhost:4000';

function filterUserProduct(id: number, data: UserProduct[]) {
  return data.find(product => product.id === Number(id));
}

type Quality = 'new' | 'used';
type Category = 'phones' | 'tablets' | 'accessories' | 'other';

export const CreatePost: React.FC = () => {
  const [images, setImages] = useState<(File | null)[]>(
    Array(MAX_IMAGES).fill(null),
  );
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [category, setCategory] = useState('phones');
  const [quality, setQuality] = useState<Quality>('new');

  // #region updating post
  // старые  изображения из базы
  const [existingImages, setExistingImages] = useState<string[]>([]);
  // новые изображения, добавленные через инпут
  const [newImages, setNewImages] = useState<File[]>([]);
  // список старых картинок, которые хотим удалить
  const [removeImages, setRemoveImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProduct, setUserProduct] = useState<UserProduct | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { productId } = useParams();

  // #region загрузка списка
  useEffect(() => {
    // if (!productId) return;
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch(URL_POSTS);
        if (!response.ok) {
          throw new Error('Ошибка загрузки постов');
        }
        const data: UserProduct[] = await response.json();
        const product = filterUserProduct(Number(productId), data);
        setUserProduct(product ?? null);
      } catch (error) {
        console.error('Не удалось загрузить данные для редактирования:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [productId]);

  useEffect(() => {
    if (userProduct) {
      setTitle(userProduct.title || '');
      setPrice(userProduct.price?.toString() || '');
      setDescription(userProduct.description || '');
      setPhoneNumber(userProduct.phoneNumber || '');
      setEmail(userProduct.email || '');
      setContactPerson(userProduct.contactPerson || '');
      setCategory(userProduct.category || 'phones');
      setQuality((userProduct.quality as Quality) || 'new');

      // загружаем старые картинки
      setExistingImages(userProduct.images || []);
    }
  }, [userProduct]);

  // #endregion

  // #region  // добавление удаление картинок images
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (existingImages.length + newImages.length >= MAX_IMAGES) {
      alert(`Максимум ${MAX_IMAGES} изображений`);
      return;
    }

    setNewImages(prev => [...prev, file]);
    event.target.value = '';
  };
  const handleRemoveExistingImage = (url: string) => {
    setExistingImages(prev => prev.filter(img => img !== url));
    setRemoveImages(prev => [...prev, url]);
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  // #endregion

  // #region submit button
  // const handleSubmit = useCallback(
  //   async (e: React.FormEvent) => {
  //     e.preventDefault();

  //     try {
  //       const token = localStorage.getItem('token');
  //       if (!token) {
  //         alert('Вы не авторизованы');
  //         return;
  //       }

  //       const formData = new FormData();
  //       formData.append('title', title);
  //       formData.append('price', price);
  //       formData.append('description', description);
  //       formData.append('phoneNumber', phoneNumber);
  //       formData.append('email', email);
  //       formData.append('quality', quality);
  //       formData.append('category', category);
  //       formData.append('contactPerson', contactPerson);
  //       newImages.forEach(img => formData.append('images', img));

  //       if (removeImages.length > 0) {
  //         formData.append('removeImages', JSON.stringify(removeImages));
  //       }

  //       const isEdit = Boolean(productId);
  //       const url = isEdit
  //         ? `http://localhost:4000/posts/${productId}`
  //         : 'http://localhost:4000/posts';
  //       const method = isEdit ? 'PUT' : 'POST';

  //       const response = await fetch(url, {
  //         method,
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: formData,
  //       });

  //       if (!response.ok) {
  //         // token expiration logic
  //         if (response.status === 401) {
  //           console.log('session expired');
  //           return;
  //         }
  //         const errorData = await response.json();
  //         alert(errorData.message || 'Ошибка при сохранении поста');
  //         return;
  //       }

  //       // показываем сообщение об успехе
  //       setIsSuccess(true);

  //       // через 2 секунды делаем редирект
  //       setTimeout(() => {
  //         navigate('/myProducts');
  //       }, 2000);
  //     } catch (error) {
  //       console.error('Ошибка:', error);
  //       alert('Не удалось сохранить пост');
  //     }
  //   },
  //   [
  //     title,
  //     price,
  //     description,
  //     phoneNumber,
  //     email,
  //     quality,
  //     category,
  //     contactPerson,
  //     newImages,
  //     removeImages,
  //     productId,
  //     navigate,
  //   ],
  // );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append('title', title);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('phoneNumber', phoneNumber);
      formData.append('email', email);
      formData.append('quality', quality);
      formData.append('category', category);
      formData.append('contactPerson', contactPerson);
      newImages.forEach(img => formData.append('images', img));
      if (removeImages.length > 0) {
        formData.append('removeImages', JSON.stringify(removeImages));
      }

      const isEdit = Boolean(productId);
      const url = isEdit ? `${URL_POSTS}/${productId}` : URL_POSTS;
      const method = isEdit ? 'PUT' : 'POST';

      try {
        // УДАЛЕНО: Ручная проверка токена. fetchWithAuth сделает это сам.

        // ЗАМЕНЕНО: Используем нашу умную функцию `fetchWithAuth`
        const response = await fetchWithAuth(url, {
          method,
          body: formData, // Она сама разберется с заголовками
        });

        // УДАЛЕНО: Проверка на status 401. Это теперь внутри fetchWithAuth.

        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.message || 'Ошибка при сохранении поста');
          return;
        }

        setIsSuccess(true);
        setTimeout(() => {
          navigate('/myProducts');
        }, 2000);
      } catch (error: any) {
        // Эта ошибка будет поймана, если fetchWithAuth не сможет обновить токен.
        // Пользователь к этому моменту уже будет перенаправлен.
        // Мы просто предотвращаем показ лишнего алерта.
        if (error.message !== 'Session expired') {
          console.error('Ошибка:', error);
          alert('Не удалось сохранить пост');
        }
      }
    },
    [
      title,
      price,
      description,
      phoneNumber,
      email,
      quality,
      category,
      contactPerson,
      newImages,
      removeImages,
      productId,
      navigate,
    ],
  );
  // #endregion

  // for when loading is true
  if (loading && productId) {
    return <div>Загрузка данных продукта...</div>;
  }

  return (
    <section className={style.createPost}>
      <ShortNav breadcrumb="List your product" />
      <div className={`container ${style.createPost__container}`}>
        <h2 className={style.title}>Add your product</h2>
        {isSuccess && (
          <div className={style.successMessage}>
            {productId ? 'Продукт успешно обновлён!' : 'Продукт успешно создан'}
          </div>
        )}
        {!isSuccess && (
          <>
            <form className={style.createPost__form} onSubmit={handleSubmit}>
              <div className={style.inputContainer}>
                <label htmlFor="title" className={style.label}>
                  Product Title
                </label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  type="text"
                  id="title"
                  className={`${style.input} ${style['input--text']}`}
                  required
                />
              </div>

              <div className={style.imagesSection}>
                {/* новый способ добавления картинок */}
                <div className={style.imagesContainer}>
                  {/* старые картинки */}
                  {existingImages.map((url, idx) => (
                    <div key={`old-${idx}`} className={style.imageContainer}>
                      <img
                        // src={`http://localhost:4000${url}`}
                        src={url}
                        alt={`existing-${idx}`}
                        className={style.image}
                      />
                      <button
                        className={style.imageRemoveButton}
                        type="button"
                        onClick={() => handleRemoveExistingImage(url)}
                      ></button>
                    </div>
                  ))}

                  {/* новые картинки */}
                  {newImages.map((file, idx) => (
                    <div key={`new-${idx}`} className={style.imageContainer}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`new-${idx}`}
                        className={style.image}
                      />
                      <button
                        className={style.imageRemoveButton}
                        type="button"
                        onClick={() => handleRemoveNewImage(idx)}
                      ></button>
                    </div>
                  ))}

                  {/* кнопка добавления */}
                  {existingImages.length + newImages.length < MAX_IMAGES && (
                    <div className={style.imageContainer} onClick={handleClick}>
                      <span className="text-gray-500">+</span>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className={style.fileInput}
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
              </div>

              <div className={style.inputContainer}>
                <label htmlFor="price" className={style.label}>
                  Price
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  id="price"
                  className={`${style.input} ${style['input--text']}`}
                  required
                />
              </div>

              <div className={style.inputContainer}>
                <label htmlFor="category" className={style.label}>
                  Category
                </label>
                <select
                  name="category"
                  id="category"
                  onChange={e => setCategory(e.target.value as Category)}
                  value={category}
                  className={`${style.input} ${style['input--text']} ${style['input--select']}`}
                >
                  <option value="phones">Phones</option>
                  <option value="tablets">Tablets</option>
                  <option value="accessories">Accessories</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className={style.inputContainer}>
                <label htmlFor="quality" className={style.label}>
                  Quality
                </label>
                <select
                  name="quality"
                  id="quality"
                  onChange={e => setQuality(e.target.value as Quality)}
                  value={quality}
                  className={`${style.input} ${style['input--text']} ${style['input--select']}`}
                >
                  <option value="new">New</option>
                  <option value="used">Used</option>
                </select>
              </div>

              <div className={style.inputContainer}>
                <label htmlFor="description" className={style.label}>
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  id="description"
                  className={`${style.input} ${style['input--text']} ${style['input--textarea']}`}
                  required
                ></textarea>
              </div>

              <div className={style.inputContainer}>
                <label htmlFor="contactPerson" className={style.label}>
                  Contact Person
                </label>
                <input
                  id="contactPerson"
                  type="text"
                  value={contactPerson}
                  onChange={e => setContactPerson(e.target.value)}
                  className={`${style.input} ${style['input--text']}`}
                  required
                />
              </div>

              <div className={style.inputContainer}>
                <label htmlFor="phoneNumber" className={style.label}>
                  Contact Number
                </label>
                <input
                  id="phoneNumber"
                  type="number"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  className={`${style.input} ${style['input--text']}`}
                  required
                />
              </div>

              <div className="inputContainer">
                <label htmlFor="email" className={style.label}>
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  id="email"
                  className={`${style.input} ${style['input--text']}`}
                  required
                />
              </div>
              {productId ? (
                <button type="submit" className={style.submitButton}>
                  Finish Editing
                </button>
              ) : (
                <button type="submit" className={style.submitButton}>
                  Submit
                </button>
              )}
            </form>
          </>
        )}
      </div>
    </section>
  );
};
