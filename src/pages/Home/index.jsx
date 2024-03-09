import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import images from '~/assets/images';
import ContentSection from '~/components/ContentSection';
import Slider from '~/components/Carousel/Slider';
// import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import SliderBrand from './SliderBrand';
const cx = classNames.bind(styles);

function Home() {
    const brands = [
        {
            name: 'ADIDAS',
            img: images.brand_Adidas,
        },
        {
            name: 'NIKE',
            img: images.brand_Nike,
        },
        {
            name: 'PUMA',
            img: images.brand_Puma,
        },
        {
            name: 'CONVERSE',
            img: images.brand_Converse,
        },
        {
            name: 'VANS',
            img: images.brand_Vans,
        },
    ];
    return (
        <div className={cx('wrapper')}>
            <img className={cx('thumbnail-1')} src={images.thumbnail1} alt="thumbnail1" />
            <ContentSection name="Product Catalogue">
                <div className={cx('product-wrapper')}>
                    <div className={cx('card')}>
                        <img src={require('./Product/product_1.png')} />
                        <div className={cx('card-body')}>
                            <p className={cx('card-title')}>Catalogue</p>
                            <p className={cx('card-sub-title')}>Clothes</p>
                            <p className={cx('card-content')}>Comming Soon!!</p>
                        </div>
                    </div>

                    <div className={cx('card')}>
                        <Link to={'/product?_page=1&_limit=9'}>
                            <img src={require('./Product/product_2.png')} />
                            <div className={cx('card-body')}>
                                <p className={cx('card-title')}>Catalogue</p>
                                <p className={cx('card-sub-title')}>Shoes</p>
                                <p className={cx('card-content')}>
                                    Providing shoes with a variety of designs, sizes, and brands for you to freely
                                    choose
                                </p>
                            </div>
                        </Link>
                    </div>
                    <div className={cx('card')}>
                        <img src={require('./Product/product_3.png')} />
                        <div className={cx('card-body')}>
                            <p className={cx('card-title')}>Catalogue</p>
                            <p className={cx('card-sub-title')}>Hats</p>
                            <p className={cx('card-content')}>Comming Soon!!</p>
                        </div>
                    </div>
                    <div className={cx('card')}>
                        <img src={require('./Product/product_4.png')} />
                        <div className={cx('card-body')}>
                            <p className={cx('card-title')}>Catalogue</p>
                            <p className={cx('card-sub-title')}>Jewelry</p>
                            <p className={cx('card-content')}>Comming Soon!!</p>
                        </div>
                    </div>
                </div>
            </ContentSection>
            <img className={cx('thumbnail-2')} src={images.thumbnail2} alt="thumbnail1" />
            <ContentSection name="Featured Products" navigation upper>
                <div className={cx('product-wrapper')}>
                    <img src={require('./Product/product_5.png')} />
                    <img src={require('./Product/product_6.png')} />
                    <img src={require('./Product/product_7.png')} />
                    <img src={require('./Product/product_8.png')} />
                </div>
            </ContentSection>
            <ContentSection upper>
                {brands &&
                    brands.map((brand) => {
                        return (
                            <div className={cx('brand-wrapper')}>
                                <div className={cx('brand-title')}>
                                    <div className={cx('product-img')}>
                                        <div className={cx('product-img-wrapper')}>
                                            <img src={brand.img} alt="" />
                                        </div>
                                    </div>
                                    <p>{brand.name}</p>
                                    <Tippy
                                        delay={[0, 50]}
                                        content={`See more product of ${brand.name}`}
                                        placement="bottom"
                                    >
                                        <div className={cx('more-prod')}>
                                            <Link to={`/product?_page=1&_limit=9&brand_id=${brand.name}`}>
                                                See more!
                                            </Link>
                                        </div>
                                    </Tippy>
                                </div>
                                {/* <Slider brand_id={brand.name} /> */}
                                <SliderBrand brand_id={brand.name}></SliderBrand>
                            </div>
                        );
                    })}

                {/* <div className={cx('brand-wrapper')}>
                    <div className={cx('brand-title')}>
                        <div className={cx('product-img')}>
                            <div className={cx('product-img-wrapper')}>
                                <img src={images.brand_Nike} alt="" />
                            </div>
                        </div>
                        <p>NIKE</p>
                    </div>

                    <Slider brand_id={'NIKE'} />
                </div>
                <div className={cx('brand-wrapper')}>
                    <div className={cx('brand-title')}>
                        <div className={cx('product-img')}>
                            <div className={cx('product-img-wrapper')}>
                                <img src={images.brand_Adidas} alt="" />
                            </div>
                        </div>
                        <p>ADIDAS</p>
                    </div>
                    <Slider brand_id={'ADIDAS'} />
                </div> */}
            </ContentSection>
        </div>
    );
}

export default Home;
