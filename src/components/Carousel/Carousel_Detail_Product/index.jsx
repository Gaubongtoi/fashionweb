import { useEffect, useState, useMemo, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from '../Carousel.module.scss';
const cx = classNames.bind(styles);

export default function Carousel({ images, product, reset }) {
    const [selectedImg, setSelectedImg] = useState(1);
    // console.log();
    // const [img, setImg] = useState(`https://shoesshop-6n6z.onrender.com/imgs/${selectedImg}`);
    // console.log(images);
    // console.log([...product?.imgs]);
    // const imagess = [product?.img, ...product?.imgs];
    // console.log(images[0]);
    useEffect(() => {
        setSlideIndex(1);
    }, [reset]);
    const [slideIndex, setSlideIndex] = useState(1);
    const sliderRef = useRef();
    const plusSlides = (index) => {
        setSlideIndex((prev) => prev + index);
        checkSlideShow(slideIndex + index);
    };
    const checkSlideShow = (index) => {
        // console.log(index);
        // setSlideIndex(index + 1);
        setSelectedImg(index + 1);
    };
    const handleSlideLeft = () => {
        // if (selectedImg === 1) {
        //     setSelectedImg(images.length);
        // }
        // setSelectedImg((prevState) => prevState - 1);
        sliderRef.current.scrollLeft -= 180;
    };

    const handleSlideRight = () => {
        // if (selectedImg >= images.length) {
        //     setSelectedImg(0);
        // }
        // setSelectedImg((prevState) => prevState + 1);
        sliderRef.current.scrollLeft += 180;
    };
    return (
        <div className={cx('product-preview')}>
            {/* Optional Chaining */}
            <div className={cx('product-container-img')}>
                {/* <img src={'https://shoesshop-6n6z.onrender.com/imgs/' + product?.img} alt="" ref={mainRef} /> */}
                {/* {product?.imgs?.map((img, index) => {
                    return (
                        <div
                            key={index}
                            className={cx('mySlide')}
                            style={{ display: index + 1 === slideIndex ? 'flex' : 'none' }}
                        >
                            <img src={'https://shoesshop-6n6z.onrender.com/imgs/' + img} alt="" />
                        </div>
                    );
                })} */}
                {images &&
                    images.length > 0 &&
                    images.map((img, index) => {
                        return (
                            <div
                                key={index}
                                className={cx('mySlide')}
                                style={{ display: index + 1 === slideIndex ? 'flex' : 'none' }}
                            >
                                <img
                                    src={'https://shoesshop-6n6z.onrender.com/imgs/' + images[selectedImg - 1]}
                                    alt=""
                                />
                            </div>
                        );
                    })}
            </div>
            <div className={cx('img-slider')}>
                <button className={cx('prev-slider')} onClick={() => handleSlideLeft()}>
                    &#10094;
                </button>
                <div className={cx('slider')} ref={sliderRef}>
                    {product?.imgs?.map((img, index) => {
                        // console.log(index);
                        return (
                            <div
                                key={index}
                                className={cx(`slider-box`, `${index + 1 === selectedImg ? cx('active') : ''}`)}
                                onClick={() => checkSlideShow(index)}
                            >
                                <img src={'https://shoesshop-6n6z.onrender.com/imgs/' + img} alt="" />
                            </div>
                        );
                    })}
                    {/* {images &&
                        images.length > 0 &&
                        images.map((img, index) => {
                            return (
                                <div
                                    key={index}
                                    className={cx(`slider-box`, `${index + 1 === slideIndex ? cx('active') : ''}`)}
                                    onClick={() => checkSlideShow(index)}
                                >
                                    <img
                                        src={'https://shoesshop-6n6z.onrender.com/imgs/' + images[selectedImg]}
                                        alt=""
                                    />
                                </div>
                            );
                        })} */}
                </div>

                <button className={cx('next-slider')} onClick={() => handleSlideRight()}>
                    &#10095;
                </button>
            </div>

            {/* Slider */}
        </div>
    );
}
