import styles from './Login.module.scss';
import styless from '~/components/Layout/LoginSignup/LoginSignup.module.scss';
import classNames from 'classnames/bind';
import { Link, useNavigate } from 'react-router-dom';
import Button from '~/components/Button';
import { useState, useRef, useEffect } from 'react';
import { HashLoader } from 'react-spinners';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome/';
// import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';

// import LoginSignUp from '../LoginSignup';
const cx = classNames.bind(styles);
const cxx = classNames.bind(styless);

function Login() {
    const navigation = useNavigate();

    const [errorDisplay, setErrorDisplay] = useState(false);
    const [errorMes, setErrorMes] = useState('');
    const [loading, setLoading] = useState(false);

    const schema = yup
        .object()
        .shape({
            email: yup.string().required('Bạn cần nhập trường này').email('Email không hợp lệ'),
            password: yup.string().required('Bạn cần nhập trường này'),
        })
        .required();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            // userName: '',
            // email: '',
            // phoneNumber: '',
        },
        resolver: yupResolver(schema),
    });
    const handleLogin = (data) => {
        const dataPost = {
            ...data,
        };
        console.log(dataPost);
        // const data = {
        //     email: 'nhattan123@gmail.com',
        //     password: 'vunhattan123',
        // };
        setLoading(true);
        // console.log(data);
        axios
            .post('https://shop-ban-hang-backend.onrender.com/user/login', data)
            .then((res) => {
                localStorage.setItem('token', JSON.stringify(res.data.token));
                // console.log(res.data.user.name);
                navigation('/');
                toast.success(`Chào mừng ${res.data.user.name}`, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                });
                setErrorDisplay(false);
                setErrorMes('');
                setLoading(false);
                // console.log(res.data.token);
            })
            .catch((res) => {
                if (res.response.status) {
                    setErrorDisplay(true);
                    setErrorMes(res.message);
                }
                // console.log(res.message);
                setLoading(false);
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
                    {/* <div className={cx('error-message')}>
                        <FontAwesomeIcon icon={faExclamation} />
                        <h4>Error:</h4>
                        <span>{errorMes}</span>
                    </div> */}
                    {errorDisplay && (
                        <div className="alert alert-danger" role="alert">
                            <h4 className="alert-heading">Error: {`${errorMes}`}</h4>
                            <p>{`Tên tài khoản (email) hoặc là mật khẩu (password) không chính xác`}</p>

                            <p className="mb-0">Vui lòng nhập lại!!</p>
                        </div>
                    )}

                    <div className={cx('inputField')}>
                        <label htmlFor="email" className="form-label">
                            Tên đăng nhập
                        </label>
                        <input id="email" name="avatar" type="email" className="form-control" {...register('email')} />
                        {errors.email && <span className="form-message">{errors.email.message}</span>}
                    </div>
                    <div className={cx('inputField')}>
                        <label htmlFor="password" className="form-label">
                            Mật khẩu
                        </label>
                        <input id="password" placeholder="mật khẩu" type="password" {...register('password')} />
                        {errors.password && <span className="form-message">{errors.password.message}</span>}
                    </div>

                    <div className={cx('login-forget')}>
                        <Link to="/forgotPassword">Forgot Password?</Link>
                    </div>
                    <Button
                        onClick={(e) => {
                            handleSubmit(handleLogin)(e);
                        }}
                        primary
                        rounded
                    >
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
            {/* <button onClick={setTimeout()}>Click here!!</button> */}
            {loading && (
                <div className={cxx('loading')}>
                    <HashLoader color="ab8a37" cssOverride={{}} />
                </div>
            )}
            {/* {setTimeout(() => {
                <div className={cx('loading')}>
                    <HashLoader color="ab8a37" cssOverride={{}} />
                </div>;
            }, 5000)} */}
        </div>
    );
}

export default Login;
