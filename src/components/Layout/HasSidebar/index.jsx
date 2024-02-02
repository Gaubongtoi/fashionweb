import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from './Sidebar';
import classNames from 'classnames/bind';
import styles from './HasSidebar.module.scss';
import { Wrapper } from '~/components/Popper';
import Tippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);
function HasSidebar({ children }) {
    return (
        <div className={cx('wrapper')}>
            {/* Chứa:
                1. Component Header  */}
            <Header />

            {/* 2. Container chứa: */}

            <div className={cx('has-sidebar-wrapper')}>
                <div className={cx('container')}>
                    <Sidebar />
                    {/* + Content: Chứa thông tin sản phẩm */}
                    <div className={cx('content')}>{children}</div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default HasSidebar;
