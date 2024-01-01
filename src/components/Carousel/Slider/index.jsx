import React, { useRef, useState, useMemo, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';

import 'swiper/css/pagination';

import classNames from 'classnames/bind';
import styles from './Slider.module.scss';
import { formatPrice, priceDiscount } from '~/common';

const cx = classNames.bind(styles);

// import required modules

function Slider({ param }) {
    // const array = [product];
    const [recommend, setRecommend] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:3000/product').then((res) => {
            // Trả về 1 mảng [sản phẩm]
            setRecommend(res.data);
        });
    }, [param]);
    const randomValues = useMemo(() => {
        const sortedData = [...recommend].sort(() => 0.5 - Math.random());
        return sortedData.slice(0, 9);
    }, [recommend]);
    // console.log(product);
    // console.log();
    // console.log(randomValues);
    // console.log(product);
    return (
        <>
            <Swiper
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                navigation={true}
                slidesPerView={4}
                spaceBetween={30}
                modules={[Autoplay]}
                className="mySwiper"
            >
                {param &&
                    randomValues.length > 0 &&
                    randomValues?.map((slide, i) => {
                        // console.log(slide[0].name);
                        return (
                            <div key={i}>
                                <SwiperSlide>
                                    <Link to={`http://localhost:3001/product/${slide.id}`}>
                                        <div className={cx('item-slider')}>
                                            <img
                                                src={'https://shoesshop-6n6z.onrender.com/imgs/' + slide?.img}
                                                alt={slide.name}
                                                title={slide.name}
                                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                            />
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            </div>
                        );
                    })}
            </Swiper>
        </>
    );
}
export default memo(Slider);
