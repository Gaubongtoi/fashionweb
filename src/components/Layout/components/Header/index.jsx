import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import HeadlessTippy from '@tippyjs/react/headless';
import Tippy from '@tippyjs/react';
import { isAuthenticated } from '~/service/AuthService';
import 'tippy.js/dist/tippy.css'; // optional
import { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '~/hooks/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/Button';
import images from '~/assets/images';
import Search from '../Search';
import { formatPrice, priceDiscount } from '~/common';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import { faUser, faWallet, faArrowRightFromBracket, faLock } from '@fortawesome/free-solid-svg-icons';
// import AvatarAuto from "../../components/AvatarAuto";
import AvatarAuto from '~/components/AvatarAuto';
// import { UserProvider } from '~/hooks/UserContext';
import ProductItem from '~/components/AccountItem';
import axios from 'axios';

const cx = classNames.bind(styles);
// Tien hanh lay gia tri tu UserContext
// Lay ra gia tri currentUser => Token
// Ngay luc nay no da chay ngam useEffect tu Component UserContext (Comp App da duoc bo trong UserProvider)

function Header() {
    const state = useContext(UserContext);
    const user = isAuthenticated();
    const [display, setDisplay] = useState(false);
    const [cartHeader, setCartHeader] = useState([]);
    const navigator = useNavigate();
    const totalProduct = useMemo(() => {
        return cartHeader.reduce((acc, cur) => {
            // console.log(cur.quantity);
            return acc + Number(cur?.quantity);
        }, 0);
    }, [cartHeader]);
    useEffect(() => {
        // let cart = JSON.parse(localStorage.getItem('cart'));
        let cart_prod_id = state.cart.value.map((i) => i.id).toString();
        // console.log(cart);
        axios.get('https://shoesshop-6n6z.onrender.com/shoesList/' + cart_prod_id).then((res) => {
            let product_api = JSON.parse(localStorage.getItem('cart'));
            let product_cart = product_api.map((item) => {
                return {
                    ...item,
                    product: res.data.find((i) => i.id === item.id),
                };
            });
            setCartHeader(product_cart);
        });
    }, [state.cart.value]);
    // const cart = localStorage.getItem('cart');
    // console.log(cart);
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
                    {state.cuser.value !== '' ? (
                        <>
                            <Tippy delay={[0, 50]} content="Visit Shop!" placement="bottom">
                                <Button
                                    text
                                    onClick={() => {
                                        navigator('/product?_page=1&_limit=9');
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                >
                                    Store
                                </Button>
                            </Tippy>
                            <Tippy delay={[0, 50]} content="Your Favourite!" placement="bottom">
                                <Button
                                    text
                                    onClick={() => {
                                        navigator('/product?_page=1&_limit=9');
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    // className={'disabled'}
                                >
                                    Wish List
                                </Button>
                            </Tippy>
                            <HeadlessTippy
                                // Cho phep duoc active thanh phan trong Tippy
                                interactive
                                //
                                appendTo={() => document.body}
                                // visible={true}
                                placement="bottom-end"
                                // Attribute cho phep render ra popup voi dieu kien la
                                // visible
                                render={(attrs) => {
                                    return (
                                        <div className={cx('cart-result')} tabIndex="-1" {...attrs}>
                                            <PopperWrapper>
                                                {cartHeader.length > 0 && cartHeader ? (
                                                    <div className={cx('cart-list')}>
                                                        <ul className={cx('cart-list-item')}>
                                                            {cartHeader.map((prod, i) => {
                                                                return (
                                                                    <li key={i} className={cx('cart-item')}>
                                                                        <div className={cx('product-img')}>
                                                                            <div className={cx('product-img-wrapper')}>
                                                                                <img
                                                                                    src={`https://shoesshop-6n6z.onrender.com/imgs/${prod?.product?.img}`}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className={cx('cart-item-infor')}>
                                                                            <Link to={`/product/${prod?.id}`}>
                                                                                <p className={cx('cart-item-name')}>
                                                                                    {prod?.product?.name}
                                                                                </p>
                                                                            </Link>
                                                                            <span className={cx('cart-item-price')}>
                                                                                {formatPrice(
                                                                                    priceDiscount(
                                                                                        prod?.product?.price,
                                                                                        prod?.product?.discount_id,
                                                                                    ),
                                                                                )}
                                                                            </span>
                                                                            <div className={cx('cart-item-quantity')}>
                                                                                <p>
                                                                                    Size: <span>{prod?.size}</span>
                                                                                </p>
                                                                                <p>
                                                                                    x<span>{prod?.quantity}</span>
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </div>
                                                ) : (
                                                    <div className={cx('cart-wrapper')}>
                                                        <img src={images.emptyCart} />
                                                        <p>Bạn chưa có sản phẩm nào!!!</p>
                                                    </div>
                                                )}
                                            </PopperWrapper>
                                        </div>
                                    );
                                }}
                            >
                                <div className={cx('cart')}>
                                    <Link to="/user/cart">
                                        <Button
                                            icon={<img className={cx('cart-img')} src={images.cart} alt="logo-cart" />}
                                        ></Button>
                                        {totalProduct > 0 && <span className={cx('badge')}>{totalProduct}</span>}
                                    </Link>
                                </div>
                            </HeadlessTippy>
                            <div className={cx('user')}>
                                <div className={cx('user-infor')}>
                                    <div className={cx('avatar')} onClick={() => setDisplay((prev) => !prev)}>
                                        <AvatarAuto nameU={user?.fullname} />
                                        <div className={cx('dropdown-content', display ? 'active' : '')}>
                                            <Link to={'/user/profile'}>
                                                <div className={cx('dropdown-item')}>
                                                    <FontAwesomeIcon icon={faUser} />
                                                    <p className={cx('option')}>Your Profile</p>
                                                </div>
                                            </Link>
                                            <Link to={'/user/order'}>
                                                <div className={cx('dropdown-item')}>
                                                    <FontAwesomeIcon icon={faWallet} />
                                                    <p className={cx('option')}>Purchase Order</p>
                                                </div>
                                            </Link>
                                            <Link to={'/user/password'}>
                                                <div className={cx('dropdown-item')}>
                                                    <FontAwesomeIcon icon={faLock} />
                                                    <p className={cx('option')}>Password</p>
                                                </div>
                                            </Link>
                                            <div
                                                className={cx('dropdown-item')}
                                                onClick={() => {
                                                    localStorage.removeItem('user');
                                                    // window.location.reload();
                                                    navigator('/login');
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faArrowRightFromBracket} />
                                                <p className={cx('option')}>Log Out</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Store */}
                            <Tippy delay={[0, 50]} content="Visit Shop!" placement="bottom">
                                <Button
                                    text
                                    onClick={() => {
                                        navigator('/product?_page=1&_limit=9');
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                >
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
                                placement="bottom-end"
                                // Attribute cho phep render ra popup voi dieu kien la
                                // visible
                                render={(attrs) => {
                                    return (
                                        <div className={cx('account')} tabIndex="-1" {...attrs}>
                                            <PopperWrapper>
                                                <div className={cx('account-wrapper')}>
                                                    <button className={cx('another-login-btn')}>
                                                        <Link to="/login">Signup</Link>
                                                    </button>
                                                    <button className={cx('another-login-btn')}>
                                                        <Link to="/register">Signin</Link>
                                                    </button>
                                                </div>
                                            </PopperWrapper>
                                        </div>
                                    );
                                }}
                            >
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
                                                {cartHeader.length > 0 && cartHeader ? (
                                                    <div className={cx('cart-list')}>
                                                        <ul className={cx('cart-list-item')}>
                                                            {cartHeader.map((prod, i) => {
                                                                return (
                                                                    <li key={i} className={cx('cart-item')}>
                                                                        <div className={cx('product-img')}>
                                                                            <div className={cx('product-img-wrapper')}>
                                                                                <img
                                                                                    src={`https://shoesshop-6n6z.onrender.com/imgs/${prod?.product?.img}`}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className={cx('cart-item-infor')}>
                                                                            <Link to={`/product/${prod?.id}`}>
                                                                                <p className={cx('cart-item-name')}>
                                                                                    {prod?.product?.name}
                                                                                </p>
                                                                            </Link>
                                                                            <span className={cx('cart-item-price')}>
                                                                                {formatPrice(
                                                                                    priceDiscount(
                                                                                        prod?.product?.price,
                                                                                        prod?.product?.discount_id,
                                                                                    ),
                                                                                )}
                                                                            </span>
                                                                            <div className={cx('cart-item-quantity')}>
                                                                                <p>
                                                                                    Size: <span>{prod?.size}</span>
                                                                                </p>
                                                                                <p>
                                                                                    x<span>{prod?.quantity}</span>
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </div>
                                                ) : (
                                                    <div className={cx('cart-wrapper')}>
                                                        <img src={images.emptyCart} />
                                                        <p>Bạn chưa có sản phẩm nào!!!</p>
                                                    </div>
                                                )}
                                            </PopperWrapper>
                                        </div>
                                    );
                                }}
                            >
                                {/* <button>Hello</button> */}
                                <div className={cx('cart')}>
                                    <Link to="/user/cart">
                                        <Button
                                            icon={<img className={cx('cart-img')} src={images.cart} alt="logo-cart" />}
                                        ></Button>
                                        {totalProduct > 0 && <span className={cx('badge')}>{totalProduct}</span>}
                                    </Link>
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
