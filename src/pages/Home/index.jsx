import classNames from 'classnames/bind';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from './Home.module.scss';
import images from '~/assets/images';
import ContentSection from '~/components/ContentSection';
import 'bootstrap/dist/css/bootstrap.min.css';
const cx = classNames.bind(styles);

function Home() {
    return (
        <div className={cx('wrapper')}>
            <img className={cx('thumbnail-1')} src={images.thumbnail1} alt="thumbnail1" />
            <ContentSection name="Product Catalogue">
                <div className={cx('product-wrapper')}>
                    <img src={require('./Product/product_1.png')} />
                    <img src={require('./Product/product_2.png')} />
                    <img src={require('./Product/product_3.png')} />
                    <img src={require('./Product/product_4.png')} />
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
