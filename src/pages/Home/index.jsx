import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import images from '~/assets/images';
import ContentSection from '~/components/ContentSection';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);

function Home() {
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
        </div>
    );
}

export default Home;
