import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import HeadlessTippy from '@tippyjs/react/headless';
import Tippy from '@tippyjs/react';

import 'tippy.js/dist/tippy.css'; // optional
import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '~/hooks/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/Button';
import images from '~/assets/images';
import Search from '../Search';
import { Wrapper as PopperWrapper } from '~/components/Popper';

import ProductItem from '~/components/AccountItem';

const cx = classNames.bind(styles);
// Tien hanh lay gia tri tu UserContext
// Lay ra gia tri currentUser => Token
// Ngay luc nay no da chay ngam useEffect tu Component UserContext (Comp App da duoc bo trong UserProvider)

function Header() {
    const [currentUser] = useContext(UserContext);
    const navigator = useNavigate();
    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Link to="/">
                    <p className={cx('logo')}>Luxury’s Closet</p>
                </Link>

                {/* Search */}
                <Search />
                {/* Action */}
                <div className={cx('action')}>
                    {/* Neu nguoi dung dang nhap thanh cong */}
                    {false ? (
                        <>
                            <h2>Hello</h2>
                        </>
                    ) : (
                        <>
                            {/* Store */}
                            <Tippy delay={[0, 50]} content="Visit Shop!" placement="bottom">
                                <Button text onClick={() => navigator('/product')}>
                                    Store
                                </Button>
                            </Tippy>
                            {/* Account: Login */}
                            <HeadlessTippy
                                // Cho phep duoc active thanh phan trong Tippy
                                interactive
                                //
                                appendTo={() => document.body}
                                //
                                // visible
                                // trigger="click"
                                placement="bottom-end"
                                // Attribute cho phep render ra popup voi dieu kien la
                                // visible
                                render={(attrs) => {
                                    return (
                                        <div className={cx('account')} tabIndex="-1" {...attrs}>
                                            <PopperWrapper>
                                                <div className={cx('account-wrapper')}>
                                                    <button className={cx('another-login-btn', 'disabled')}>
                                                        <img
                                                            src={require('~/assets/images/bi_facebook.svg').default}
                                                            alt="yt"
                                                        />
                                                    </button>
                                                    <button className={cx('another-login-btn', 'disabled')}>
                                                        <img
                                                            src={require('~/assets/images/bi_facebook.svg').default}
                                                            alt="yt"
                                                        />
                                                    </button>
                                                    <button className={cx('another-login-btn', 'disabled')}>
                                                        <img
                                                            src={require('~/assets/images/bi_facebook.svg').default}
                                                            alt="yt"
                                                        />
                                                    </button>
                                                </div>
                                            </PopperWrapper>
                                        </div>
                                    );
                                }}
                            >
                                {/* <button>Hello</button> */}

                                <Button text>Account</Button>
                            </HeadlessTippy>
                            <HeadlessTippy
                                // Cho phep duoc active thanh phan trong Tippy
                                interactive
                                //
                                appendTo={() => document.body}
                                //
                                // visible
                                // trigger="click"
                                placement="bottom-end"
                                // Attribute cho phep render ra popup voi dieu kien la
                                // visible
                                render={(attrs) => {
                                    return (
                                        <div className={cx('cart-result')} tabIndex="-1" {...attrs}>
                                            <PopperWrapper>
                                                <div className={cx('cart-wrapper')}>
                                                    <img src={images.emptyCart} />
                                                    <p>Bạn chưa có sản phẩm nào!!!</p>
                                                </div>
                                            </PopperWrapper>
                                        </div>
                                    );
                                }}
                            >
                                {/* <button>Hello</button> */}
                                <div className={cx('cart')}>
                                    <Button
                                        icon={<img className={cx('cart-img')} src={images.cart} alt="logo-cart" />}
                                    ></Button>
                                    <span className={cx('badge')}>12</span>
                                </div>
                            </HeadlessTippy>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
