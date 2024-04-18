import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './LayoutUserInfor.module.scss';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
const cx = classNames.bind(styles);
function LayoutUserInfor({
    children,
    path,
    title,
    profile = false,
    order = false,
    password = false,
    returnn = false,
    wishlist = false,
}) {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };
    return (
        <div className={cx('wrapper')}>
            <ul className={cx('path')}>
                <li>
                    <Link to="/">
                        <p>Home</p>
                    </Link>
                </li>
                <span> &#62; </span>
                <li>{path}</li>
            </ul>
            <div className={cx('title')}>
                <p>{title}</p>
                <button className={cx('logout')} onClick={handleLogout}>
                    <FontAwesomeIcon icon={faArrowRightFromBracket}></FontAwesomeIcon>
                    <p>Log out</p>
                </button>
            </div>
            <div className={cx('wrapper-content')}>
                <div className={cx('side-bar-user')}>
                    <ul className={cx('list-user')}>
                        <li className={cx(profile ? 'isActive' : '')}>
                            <Link to="/user/profile">Personal Information</Link>
                            <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
                        </li>
                        <li className={cx(password ? 'isActive' : '')}>
                            <Link to="/user/password">Password</Link>
                            <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
                        </li>
                        <li className={cx(order ? 'isActive' : '')}>
                            <Link to="/user/order">My Orders</Link>
                            <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
                        </li>
                        <li className={cx(returnn ? 'isActive' : '')}>
                            <Link to="/user/return">Returns</Link>
                            <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
                        </li>
                        <li className={cx(wishlist ? 'isActive' : '')}>
                            <Link to="/user/wishlist">My Wishlist</Link>
                            <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
                        </li>
                    </ul>
                </div>
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
}

export default LayoutUserInfor;
