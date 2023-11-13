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
            <div className={cx('quantity-filter-wrapper')}>
                <div className={cx('quantity')}>
                    <p>
                        <span>Showing 1 - 20</span> out of 2,356 Products
                    </p>
                </div>
                <Tippy
                    // Cho phep duoc active thanh phan trong Tippy
                    interactive
                    //
                    appendTo={() => document.body}
                    //
                    // visible={searchResult.length > 0}
                    // trigger="click"
                    // placement="bottom-end"
                    // Attribute cho phep render ra popup voi dieu kien la
                    // visible
                    render={(attrs) => {
                        return <div tabIndex="-1" {...attrs}></div>;
                    }}
                >
                    <div className={cx('filter')}>
                        <p>Sort by:</p>
                        <span className={cx('title')}>New Arrival</span>
                        <FontAwesomeIcon icon={faChevronDown} />
                    </div>
                </Tippy>
            </div>

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
