import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';
import Header from '~/components/Layout/components/Header';
import Footer from '~/components/Layout/components/Footer';

const cx = classNames.bind(styles);
function DefaultLayout({ children }) {
    return (
        // Thẻ div wrapper là nơi chứa toàn bộ children
        <div className={cx('wrapper')}>
            {/* Chứa:
            1. Component Header  */}
            <Header />
            {/* 2. Container chứa: */}
            <div className={cx('container')}>
                {/* + Content: Chứa thông tin sản phẩm */}
                <div className={cx('content')}>{children}</div>
            </div>
            <Footer />
        </div>
    );
}

export default DefaultLayout;
