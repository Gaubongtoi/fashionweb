import styles from './Login.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import Button from '~/components/Button';
import { useState, useRef, useEffect } from 'react';
import { HashLoader } from 'react-spinners';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

// import LoginSignUp from '../LoginSignup';
const cx = classNames.bind(styles);

function Login() {
    const userRef = useRef();
    const errorRef = useRef();

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [errorMes, setErrorMes] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = () => {
        const data = {
            user,
            password,
        };
        axios.post('https://shoesshop-6n6z.onrender.com/signin', data).then((res) => {
            console.log(res.data);
        });
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('form')}>
                <div className={cx('title')}>
                    <p>Luxury</p>
                    <p>Sign in</p>
                </div>
                <div className={cx('fill-in-form')}>
                    <div className={cx('inputField')}>
                        <label htmlFor="username" className="form-label">
                            Tên đăng nhập
                        </label>
                        <input
                            id="username"
                            name="avatar"
                            type="text"
                            className="form-control"
                            ref={userRef}
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                        />
                        <span className="form-message"></span>
                    </div>
                    <div className={cx('inputField')}>
                        <label htmlFor="password" className="form-label">
                            Mật khẩu
                        </label>
                        <input
                            id="password"
                            placeholder="mật khẩu"
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className={cx('login-forget')}>
                        <Link to="/forgotPassword">Forgot Password?</Link>
                    </div>
                    <Button onClick={handleLogin} primary rounded>
                        Sign in
                    </Button>
                </div>
                <p>or continue with </p>
                <div className={cx('another-login')}>
                    <div className={cx('another-login-btn')}>
                        <Button rounded>
                            <img src={require('~/assets/images/icons_google.svg').default} alt="yt" />
                        </Button>
                        <Button rounded>
                            <img src={require('~/assets/images/icons_github.svg').default} alt="yt" />
                        </Button>
                        <Button rounded>
                            <img src={require('~/assets/images/bi_facebook.svg').default} alt="yt" />
                        </Button>
                    </div>
                </div>
                <div className={cx('register')}>
                    <p>
                        Don't have an account yet?{' '}
                        <span>
                            <Link to="/register">Register for free</Link>
                        </span>
                    </p>
                </div>
            </div>
            <div className={cx('logo')}></div>
        </div>
    );
}

export default Login;
