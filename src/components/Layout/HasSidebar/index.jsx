import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from './Sidebar';
import classNames from 'classnames/bind';
import styles from './HasSidebar.module.scss';

const cx = classNames.bind(styles);
function HasSidebar({ children }) {
    return (
        <div className={cx('wrapper')}>
            {/* Chứa:
                1. Component Header  */}
            <Header />
            {/* 2. Container chứa: */}
            <div className={cx('container')}>
                <Sidebar />
                {/* + Content: Chứa thông tin sản phẩm */}
                <div className={cx('content')}>{children}</div>
            </div>
            <Footer />
        </div>
    );
}

export default HasSidebar;
