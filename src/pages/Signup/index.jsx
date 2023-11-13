import classNames from 'classnames/bind';
import styles from './Signup.module.scss';
import Button from '~/components/Button';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
// Toast
import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import * as yup from 'yup';
const cx = classNames.bind(styles);
function Signup() {
    const [checkDuplicate, setCheckDuplicate] = useState(false);
    // const [userName, setUserName] = useState('')
    // Schema là một đối tượng mô tả cấu trúc và quy tắc kiểm tra của dữ liệu
    // 1 Schema có thể bao gồm các phương thức như string(), number(),
    // object(), array(),...
    const phoneRegExp =
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    const navigate = useNavigate();

    const schema = yup
        .object()
        .shape({
            name: yup.string().required('Bạn cần nhập trường này'),
            email: yup.string().required('Bạn cần nhập trường này').email('Email không hợp lệ'),
            phoneNumber: yup
                .string()
                .required('Bạn cần nhập trường này')
                .length(10, 'Số điện thoại phải có 10 số')
                .matches(phoneRegExp, 'Số điện thoại không hợp lệ'),
            password: yup
                .string()
                .required('Bạn cần nhập trường này')
                .min(8, 'Password is too short - should be 8 chars minimum.'),
            passwordCF: yup
                .string()
                .required('Bạn cần nhập trường này')
                .oneOf([yup.ref('password')], 'Mật khẩu không khớp'),
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

    const onSubmit = (data) => {
        // console.log({ ...data });
        const dataPost = {
            ...data,
        };
        console.log(dataPost);
        axios
            .post('https://shop-ban-hang-backend.onrender.com/user', dataPost)
            .then((res) => {
                // res: res này thường sẽ trả về
                // + status: 200(OK) hay là 201(Created)
                // console.log(res);
                if (res.data.user.name) {
                    toast('🦄 Wow so easy!', {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                    });
                    navigate('/login');
                    setCheckDuplicate(false);
                }
            })
            .catch((res) => {
                // console.log();
                if (res.response.data.keyPattern.email) {
                    setCheckDuplicate(true);
                }
            });
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('form')}>
                <div className={cx('title')}>
                    <p>Luxury</p>
                    <p>Sign up</p>
                </div>
                <div className={cx('fill-in-form')}>
                    <div className={cx('inputField')}>
                        <label htmlFor="name" className="form-label">
                            Username
                        </label>
                        <input
                            // id="username"
                            {...register('name')}
                            type="text"
                            className="form-control"
                            // ref={userRef}
                            // onChange={(e) => setUser(e.target.value)}
                            // value={user}
                        />
                        {errors.name && <span className="form-message">{errors.name.message}</span>}
                    </div>
                    <div className={cx('inputField')}>
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            id="email"
                            name="avatar"
                            type="email"
                            className="form-control"
                            {...register('email')}

                            // ref={userRef}
                            // onChange={(e) => setUser(e.target.value)}
                            // value={user}
                        />
                        {errors.email && <span className="form-message">{errors.email.message}</span>}
                        {checkDuplicate && <span className="form-message">Email đã tồn tại</span>}
                    </div>
                    <div className={cx('inputField')}>
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="form-control"
                            {...register('password')}

                            // ref={userRef}
                            // onChange={(e) => setUser(e.target.value)}
                            // value={user}
                        />
                        {errors.password && <span className="form-message">{errors.password.message}</span>}
                    </div>
                    <div className={cx('inputField')}>
                        <label htmlFor="rePassword" className="form-label">
                            Re-enter password
                        </label>
                        <input
                            id="rePassword"
                            name="avatar"
                            type="password"
                            className="form-control"
                            {...register('passwordCF')}

                            // ref={userRef}
                            // onChange={(e) => setUser(e.target.value)}
                            // value={user}
                        />
                        {errors.passwordCF && <span className="form-message">{errors.passwordCF.message}</span>}
                    </div>
                    <div className={cx('inputField')}>
                        <label htmlFor="phone" className="form-label">
                            Phone Number
                        </label>
                        <input
                            id="phone"
                            name="avatar"
                            type="tel"
                            className="form-control"
                            // pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                            {...register('phoneNumber')}

                            // ref={userRef}
                            // onChange={(e) => setUser(e.target.value)}
                            // value={user}
                        />
                        {errors.phoneNumber && <span className="form-message">{errors.phoneNumber.message}</span>}
                    </div>
                    {/* <input type="submit" /> */}
                    <Button
                        primary
                        rounded
                        type="submit"
                        onClick={(e) => {
                            handleSubmit(onSubmit)(e);
                        }}
                    >
                        Sign up
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
            </div>
        </div>
    );
}

export default Signup;
