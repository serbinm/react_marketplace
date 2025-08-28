import { useEffect } from 'react';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const Welcome: React.FC = () => {
  useEffect(() => {
    new Swiper('.welcome-swiper__swiper', {
      modules: [Navigation, Pagination],
      loop: true,
      navigation: {
        nextEl: '.welcome-swiper__button--next',
        prevEl: '.welcome-swiper__button--prev',
        // nextEl: '.swiper-button-next',
        // prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }, []);
  return (
    <section className="welcome">
      <div className="container welcome__container">
        <h1 className="welcome__title">Welcome to Nice Gadgets store!</h1>
        {/* <div classNameName="welcome__slider"></div> */}
        {/* <!-- Slider main container --> */}
      </div>
      <div className="container welcome__container welcome__container--swiper">
        {/*  */}
        <div className="welcome-swiper">
          <div className="swiper-button-prev welcome-swiper__button welcome-swiper__button--prev"></div>
          <div className="swiper-button-next welcome-swiper__button welcome-swiper__button--next"></div>
          <div className="swiper welcome-swiper__swiper">
            {/* <!-- Additional required wrapper --> */}
            <div className="swiper-wrapper welcome-swiper__wrapper">
              {/* <!-- Slides --> */}
              <div className="swiper-slide">
                <div className="welcome-swiper__item welcome-swiper__item--slide1">
                  <div className="welcome-swiper__box">
                    <h2 className="welcome-swiper__title">
                      Now available in our store!
                      <span className="welcome-swiper__title--emoji">
                        {'\u{1F44C}'}
                      </span>
                    </h2>
                    <p className="welcome-swiper__text">Be the first!</p>
                    <a href="" className="welcome-swiper__link">
                      order now
                    </a>
                  </div>
                  <img
                    src="/public/img/homepage/welcome-slide1.webp"
                    alt=""
                    className="welcome-swiper__image"
                  />
                </div>
              </div>
              <div className="swiper-slide">
                <div className="welcome-swiper__item welcome-swiper__item--slide2">
                  <div className="welcome-swiper__box">
                    <h2 className="welcome-swiper__title">
                      Now available in our store!
                      <span className="welcome-swiper__title--emoji">
                        {'\u{1F44C}'}
                      </span>
                    </h2>
                    <p className="welcome-swiper__text">Be the first!</p>
                    <a href="" className="welcome-swiper__link">
                      order now
                    </a>
                  </div>
                  <img
                    src="/public/img/homepage/welcome-slide2.webp"
                    alt=""
                    className="welcome-swiper__image"
                  />
                </div>
              </div>
              <div className="swiper-slide">
                <div className="welcome-swiper__item welcome-swiper__item--slide3">
                  <div className="welcome-swiper__box">
                    <h2 className="welcome-swiper__title">
                      Now available in our store!
                      <span className="welcome-swiper__title--emoji">
                        {'\u{1F44C}'}
                      </span>
                    </h2>
                    <p className="welcome-swiper__text">Be the first!</p>
                    <a href="" className="welcome-swiper__link">
                      order now
                    </a>
                  </div>
                  <img
                    src="/public/img/homepage/welcome-slide3.webp"
                    alt=""
                    className="welcome-swiper__image"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="swiper-pagination welcome-swiper__pagination"></div>
        </div>
        {/*  */}
      </div>
    </section>
  );
};
