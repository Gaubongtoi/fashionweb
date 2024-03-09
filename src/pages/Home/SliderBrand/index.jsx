import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import styles from './SliderBrand.module.scss';
import classNames from 'classnames/bind';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';
import './styleSlider.css';
import { Link } from 'react-router-dom';
import images from '~/assets/images';
import { formatPrice, priceDiscount } from '~/common';
const cx = classNames.bind(styles);
function SliderBrand({ brand_id = false }) {
    const [brand, setBrand] = useState([]);
    useEffect(() => {
        axios.get(`http://localhost:3000/product?brand_id=${brand_id}`).then((res) => {
            // Trả về 1 mảng [sản phẩm]
            setBrand(res.data);
        });
    }, [brand_id]);
    var settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 2,
        initialSlide: 0,
        autoplay: true,
        pauseOnHover: true,
        autoplaySpeed: 6000,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };
    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return <div className={className} style={{ ...style, display: 'block' }} onClick={onClick} />;
    }

    function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return <div className={className} style={{ ...style, display: 'block' }} onClick={onClick} />;
    }
    return (
        <div className={cx('slider-container')}>
            <Slider {...settings}>
                {brand_id &&
                    brand.length > 0 &&
                    brand?.map((slide, i) => {
                        // console.log(slide[0].name);
                        return (
                            <>
                                <div
                                    key={i}
                                    className={cx('item-wrapper')}
                                    // style={{ width: '90%', backgroundColor: 'red' }}
                                >
                                    <div className={cx('product-img')}>
                                        <div className={cx('product-img-wrapper')}>
                                            <img
                                                src={`https://shoesshop-6n6z.onrender.com/imgs/${slide.img}`}
                                                alt={slide.name}
                                            />
                                            <img
                                                src={`https://shoesshop-6n6z.onrender.com/imgs/${slide.imgs[0]}`}
                                                alt="rear product image"
                                                className={cx('rear-img')}
                                            />
                                        </div>
                                    </div>
                                    <div className={cx('content')}>
                                        {/* <p className={cx('name')}>{prod.name}</p> */}
                                        <Link
                                            to={`/product/${slide.id}`}
                                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                        >
                                            <p className={cx('name')}>{slide.name}</p>
                                        </Link>
                                        <p className={cx('price')}>
                                            {formatPrice(priceDiscount(slide.price, slide.discount_id))}
                                        </p>
                                        <p className={cx('old-price')}>{formatPrice(slide.price)}</p>
                                    </div>
                                    <div className={cx('loved')}>
                                        <img src={images.unheart} alt="" />
                                    </div>
                                </div>
                            </>
                        );
                    })}
            </Slider>
            {brand_id && brand.length <= 0 && (
                <div className={cx('notification')}>
                    <p>Không tìm thấy sản phẩm nào của {brand_id}</p>
                </div>
            )}
        </div>
    );
}

export default SliderBrand;
