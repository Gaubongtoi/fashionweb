import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/Button';
import images from '~/assets/images';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import AccountItem from '~/components/AccountItem';

const cx = classNames.bind(styles);

function Header() {
    const [searchResult, setSearchResult] = useState([]);
    // Call API
    useEffect(() => {
        setTimeout(() => {
            setSearchResult([]);
        }, 0);
    }, []);
    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <p className={cx('logo')}>Luxury’s Closet</p>
                <Tippy
                    // Cho phep duoc active thanh phan trong Tippy
                    interactive
                    //
                    appendTo={() => document.body}
                    //
                    visible={searchResult.length > 0}
                    // trigger="click"
                    // placement="bottom-end"
                    // Attribute cho phep render ra popup voi dieu kien la
                    // visible
                    render={(attrs) => {
                        return (
                            <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                                <PopperWrapper>
                                    <p className={cx('title-search-result')}>Gợi ý sản phẩm</p>
                                    <AccountItem />
                                    <AccountItem />
                                    <AccountItem />
                                </PopperWrapper>
                            </div>
                        );
                    }}
                >
                    <div className={cx('search')}>
                        <button className={cx('search-btn')}>
                            <img className={cx('search-logo')} src={images.search} alt="search" />
                        </button>

                        <input placeholder="Search for an Item..." />
                    </div>
                </Tippy>
                <div className={cx('action')}>
                    <Button text>Store</Button>
                    <Button text>Account</Button>
                    <Button text>Wish List</Button>
                    <Button icon={<img className={cx('cart-img')} src={images.cart} alt="logo-cart" />}></Button>
                </div>
            </div>
        </header>
    );
}

export default Header;
