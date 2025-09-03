import { Link, useLocation, useParams } from 'react-router-dom';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { DetailedType } from '../../types/DetailedProduct';
import styles from './ItemCard.module.scss';

const API_URL_PRODUCTS = '/api/products';

const FULL_PROPERTIES: { name: string; key: keyof DetailedType }[] = [
  { name: 'Screen', key: 'screen' },
  { name: 'Resolution', key: 'resolution' },
  { name: 'Processor', key: 'processor' },
  { name: 'RAM', key: 'ram' },
  { name: 'Built in memory', key: 'capacity' },
  { name: 'Camera', key: 'camera' },
  { name: 'Zoom', key: 'zoom' },
  { name: 'Cell', key: 'cell' },
];

function getItem(itemId: string, list: DetailedType[]) {
  return list.find((item: DetailedType) => item.id === itemId);
}

export const ItemCard = () => {
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<DetailedType | null>(null);
  const [products, setProducts] = useState<DetailedType[] | null>(null);
  const [color, setColor] = useState('');
  const { itemId } = useParams();
  const location = useLocation();
  const [imageChosen, setImageChosen] = useState('');

  function getColor(item: DetailedType, color: string, categoryLink: string) {
    let string = item.id;
    let arr = string.split('-');
    let newStr = color;

    arr = arr.slice(0, arr.length - 1); // удаляем старый цвет
    arr.push(newStr); // добавляем новый цвет

    let result = arr.join('-'); // склеиваем обратно в строку

    // console.log(result); // => "apple-iphone-11-pro-512gb-blue"
    let path = `${categoryLink}/${result}`;
    return path;
  }

  const colorMap: Array<{ [key: string]: string }> = [
    { black: '#000000' },
    { yellow: '#ffff00' },
    { gold: '#b49a0d' },
    { green: '#008000' },
    { 'midnight green': '#004953' },
    { silver: '#c0c0c0' },
    { spacegray: '#4b4b4b' },
    { 'space-gray': '#4b4b4b' },
    { 'space gray': '#4b4b4b' },
    { purple: '#6f026f' },
    { white: '#ffffff' },
    { coral: '#ff7f50' },
    { red: '#f70000' },
    { rosegold: '#F3B7B7' },
    { 'rose gold': '#F3B7B7' },
    { blue: '#0000ff' },
    { pink: '#ffc0cb' },
    { midnight: '#191970' },
    { 'sierra blue': '#6699cc' },
    { graphite: '#383838' },
    { starlight: '#f8f4e3' },
    { 'sky blue': '#87ceeb' },
  ];

  const category = location.state?.category;
  let categoryName = '';
  let categoryLink = '';
  switch (category) {
    case 'phones':
      categoryName = 'Phones';
      categoryLink = '/phones';
      break;
    case 'tablets':
      categoryName = 'Tablets';
      categoryLink = '/tablets';
      break;
    case 'accessories':
      categoryName = 'Accessories';
      categoryLink = '/accessories';
      break;
    default:
      categoryName = '';
      break;
  }

  // console.log(category, itemId);
  useEffect(() => {
    if (!itemId || !category) return;

    let url = '';
    switch (category) {
      case 'phones':
        url = '/api/phones.json';
        break;
      case 'tablets':
        url = '/api/tablets.json';
        break;
      case 'accessories':
        url = '/api/accessories.json';
        break;
      default:
        break;
    }

    fetch(url)
      .then(res => {
        if (!res.ok) {
          throw new Error('Ошибка загрузки данных');
        }
        return res.json();
      })
      .then(data => {
        setProducts(data);
        let foundItem = getItem(itemId, data);
        setItem(foundItem || null);
      })
      .catch(error => {
        console.error('Fetch error:', error);
      })
      .finally(() => setLoading(false));
  }, [category, itemId]);

  if (loading) return <h2 className={styles.title}>Loading...</h2>;

  if (!item) return <h2 className={styles.title}>Item not found</h2>;

  // console.log(location);
  return (
    <section className="itemCard">
      <div className="container itemCard__container">
        <div className="itemCard__nav itemCard-nav">
          <Link to="/" className="itemCard-nav__link">
            <img
              src="/public/img/icons/home.svg"
              alt="home"
              className="itemCard-nav__icon"
            />
          </Link>
          <span className="itemCard-nav__arrow"></span>
          <Link
            to={categoryLink}
            className="itemCard-nav__text itemCard-nav__text--link"
          >
            {categoryName}
          </Link>
          <span className="itemCard-nav__arrow"></span>
          <span className="itemCard-nav__text">{item.name}</span>
        </div>

        <div className={styles.back}>
          <span className={styles.backArrow}></span>
          <Link to={categoryLink} className={styles.backLink}>
            Back
          </Link>
        </div>

        <div className={styles.itemInfo}>
          <h2 className={styles.itemTitle}> {item.name}</h2>
          <div className={styles.itemTop}>
            <div className={styles.itemImagesContainer}>
              <div className={styles.smallImages}>
                {item.images.map((image, index) => (
                  <div
                    className={styles.smallImageContainer}
                    key={index}
                    onClick={() => setImageChosen(image)}
                  >
                    <img
                      src={`/public/${image}`}
                      alt={`Item image ${index + 1}`}
                      className={styles.smallImage}
                    />
                  </div>
                ))}
              </div>
              <div className={styles.bigImageContainer}>
                {imageChosen ? (
                  <img
                    src={`/public/${imageChosen}`}
                    alt=""
                    className={styles.itemBigImage}
                  />
                ) : (
                  <img
                    src={`/public/${item.images[0]}`}
                    alt=""
                    className={styles.itemBigImage}
                  />
                )}
              </div>
            </div>
            <div className={styles.itemOptions}>
              <div className={styles.itemColorsSection}>
                <div className={styles.itemColorsDescription}>
                  <span className={styles.itemColorsText}>
                    Available Colors
                  </span>

                  <span
                    className={`${styles.itemColorsText} ${styles['itemColorsText--id']}`}
                  >
                    {`ID: ${item.id}`}
                  </span>
                </div>

                <div className={styles.itemColorsContainer}>
                  {item.colorsAvailable.map((color, index) => {
                    const colorObj = colorMap.find(
                      colorData =>
                        Object.keys(colorData)[0] === color.toLowerCase(),
                    );

                    let colorValue;

                    if (colorObj) {
                      colorValue = Object.values(colorObj)[0];
                    }

                    let path = getColor(item, color, categoryLink);

                    console.log(path);
                    return (
                      <Link
                        className={styles.itemColorContainer}
                        to={path}
                        state={{ category: location.state?.category }}
                        onClick={e => {
                          // e.preventDefault();
                          console.log(path);
                        }}
                      >
                        <div
                          key={index}
                          className={styles.itemColor}
                          style={{ backgroundColor: colorValue }}
                        ></div>
                      </Link>
                    );
                  })}
                </div>
              </div>
              <div className={styles.capacitySection}>
                <span className="capacityText">Select capacity</span>
                <div className={styles.capacityContainer}>
                  {item.capacityAvailable.map(capacity => (
                    <div className={styles.capacity} key={capacity}>
                      {capacity}
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.priceSection}>
                <div className={styles.priceContainer}>
                  <span className={styles.priceRegular}>
                    {`$${item.priceRegular}`}
                  </span>
                  <span className={styles.priceDiscount}>
                    {`$${item.priceDiscount}`}
                  </span>
                </div>
                <div className={styles.priceButtons}>
                  <button className={styles.priceAdd}>Add to cart</button>
                  <button className={styles.priceFavorite}></button>
                </div>
              </div>
              <div className={styles.shortPropertiesSection}>
                <div className={styles.shortProperty}>
                  <span className={styles.shortPropertyName}>Screen</span>
                  <span className={styles.shortPropertyValue}>
                    {item.screen}
                  </span>
                </div>
                <div className={styles.shortProperty}>
                  <span className={styles.shortPropertyName}>Resolution</span>
                  <span className={styles.shortPropertyValue}>
                    {item.resolution}
                  </span>
                </div>
                <div className={styles.shortProperty}>
                  <span className={styles.shortPropertyName}>Processor</span>
                  <span className={styles.shortPropertyValue}>
                    {item.processor}
                  </span>
                </div>
                <div className={styles.shortProperty}>
                  <span className={styles.shortPropertyName}>RAM</span>
                  <span className={styles.shortPropertyValue}>{item.ram}</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.itemBottom}>
            <div className={styles.itemAboutSection}>
              <div className={styles.aboutHeader}>
                <h3 className={styles.aboutTitle}>About</h3>
              </div>
              <div className={styles.aboutArticles}>
                {item.description.map(description => (
                  <div
                    className={styles.articleContainer}
                    key={description.title}
                  >
                    <h4 className={styles.articleTitle}>{description.title}</h4>
                    <article className={styles.articleText}>
                      {description.text}
                    </article>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.fullPropertiesSection}>
              <div className={styles.fullPropertiesHeader}>
                <div className={styles.fullPropertiesTitle}>Tech specs</div>
              </div>
              <div className={styles.fullPropertiesContainer}>
                {FULL_PROPERTIES.map(({ name, key }) => (
                  <div className={styles.fullPropertyContainer} key={key}>
                    <span className={styles.fullPropertyName}>{name}</span>
                    <span className={styles.fullPropertyValue}>
                      {Array.isArray(item[key])
                        ? item[key].join(', ')
                        : item[key]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
