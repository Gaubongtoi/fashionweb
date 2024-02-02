import { useContext, useEffect, useState, useRef } from 'react';
import styles from './ChangePasswordUser.module.scss';
import classNames from 'classnames/bind';
import axios from 'axios';
// import {  } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useDebounce from '~/hooks/useDebounce';
import { UserContext } from '~/hooks/UserContext';
import images from '~/assets/images';
import { PoweroffOutlined } from '@ant-design/icons';
import { Button as ButtonLibrary, Modal } from 'antd';
import { toast } from 'react-toastify';
const cx = classNames.bind(styles);
function ChangePasswordUser() {
    // Password trả về từ API là 1 password đã được mã hoá bằng bcrypt => sử dụng thư viện bcryptjs để mã hoá
    const bcrypt = require('bcryptjs');
    const [enterPassword, setEnterPassword] = useState('');
    const [isChecked, setIsChecked] = useState(true);
    const [displayCurrentPass, setDisplayCurrentPass] = useState(false);
    const [displayPass, setDisplayPass] = useState(false);
    const [displayRePass, setDisplayRePass] = useState(false);
    const [loadings, setLoadings] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const state = useContext(UserContext);
    const debounce = useDebounce(enterPassword, 1000);
    // console.log(enterPassword);
    const schema = yup
        .object()
        .shape({
            cpassword: yup.string().required('Bạn cần nhập trường này'),
            newpassword: yup
                .string()
                .required('Bạn cần nhập trường này')
                .matches(/[A-Z]/, 'Mật khẩu phải chứa ít nhất 1 kí tự viết hoa')
                .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Mật khẩu phải chứa ít nhất 1 kí tự đặc biệt')
                .min(8, 'Password is too short - should be 8 chars minimum.'),
            repassword: yup
                .string()
                .required('Bạn cần nhập trường này')
                .oneOf([yup.ref('newpassword')], 'Mật khẩu không khớp'),
        })
        .required();
    // console.log(product);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            // userName: '',
            // email: '',
            // phoneNumber: '',
        },
        resolver: yupResolver(schema),
    });
    useEffect(() => {
        const acccessToken = JSON.parse(localStorage.getItem('accessToken'));
        // console.log(acccessToken);
        axios
            .get('http://localhost:4000/auth/user', {
                headers: {
                    Authorization: `Bearer ${acccessToken}`,
                },
            })
            .then((res) => {
                // console.log(res.data);
                // state.cuser.setCurrentUser(res.data);
                state.cuser.setCurrentUser((prev) => {
                    let data = prev;
                    let newData = {
                        ...data,
                        password: res.data.password,
                    };
                    return newData;
                });
            })
            .catch((err) => console.log(err));
    }, []);
    // bcrypt.compare(debounce, state.cuser.value.password, function (err, result) {
    //     if (err) {
    //         // console.error(err);
    //         return;
    //     }

    //     if (result) {
    //         // console.log(result);
    //         setIsChecked(result);
    //     } else {
    //         setIsChecked(result);
    //     }
    // });
    // console.log(checkPassword);
    // console.log(checkPassword);
    const enterLoading = (index) => {
        setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });

        setTimeout(() => {
            setLoadings((prevLoadings) => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = false;
                return newLoadings;
            });
        }, 4000);
    };
    const onSubmit = (data) => {
        // console.log(data);
        enterLoading(0);
        setIsChecked(true);
        setIsModalOpen(true);
        setTimeout(() => {
            bcrypt.compare(data.cpassword, state.cuser.value.password, function (err, result) {
                if (err) {
                    // console.error(err);
                    return;
                }

                if (result) {
                    setIsChecked(result);
                    let newPass = {
                        password: data.newpassword,
                    };
                    // console.log();
                    axios
                        .put(`http://localhost:4000/auth/user/update/${state?.cuser?.value?.id}`, newPass)
                        .then((res) => {
                            console.log(res?.data?.password);
                            state.cuser.setCurrentUser((prev) => {
                                let oldData = prev;
                                let newData = {
                                    ...oldData,
                                    password: res?.data?.password,
                                };
                                return newData;
                            });
                            toast.success('Chỉnh sửa thông tin thành công', {
                                // autoClose: 2000,
                                theme: 'colored',
                                position: 'top-right',
                                autoClose: 3000,
                            });
                            reset({ cpassword: '', newpassword: '', repassword: '' });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                    // console.log(result);
                } else {
                    // inputEl.current.focus();
                    // inputEl.current.value = '';
                    reset({ cpassword: '' });
                    setIsChecked(result);
                }
            });
        }, 4000);
    };
    return (
        <>
            <div className={cx('wrapper')}>
                {/* <div className={cx('')}></div> */}
                <div className={cx('inputField')}>
                    <label htmlFor="cpassword" className="form-label">
                        Input Your Current Password:
                    </label>
                    <div className={cx('protected-password')}>
                        <input
                            id="cpassword"
                            name="cpassword"
                            type={displayCurrentPass === true ? 'text' : 'password'}
                            className="form-control"
                            {...register('cpassword')}
                            // ref={inputEl}

                            // ref={userRef}
                            // onChange={(e) => setUser(e.target.value)}
                            // value={user}
                        />
                        {errors.cpassword && <span className="form-message">{errors.cpassword.message}</span>}
                        {isChecked === false && <p className="form-message">Mật khẩu không chính xác</p>}
                        <div className={cx('eye')}>
                            <img
                                src={displayCurrentPass === false ? images.eye_slash : images.eye}
                                alt="eye"
                                onClick={() => setDisplayCurrentPass(!displayCurrentPass)}
                            />
                        </div>
                    </div>
                </div>
                <div className={cx('inputField')}>
                    <label htmlFor="newpassword" className="form-label">
                        Input Your New Password:
                    </label>
                    <div className={cx('protected-password')}>
                        <input
                            id="newpassword"
                            name="newpassword"
                            type={displayPass === true ? 'text' : 'password'}
                            className="form-control"
                            {...register('newpassword')}

                            // ref={userRef}
                            // onChange={(e) => setUser(e.target.value)}
                            // value={user}
                        />
                        {errors.newpassword && <span className="form-message">{errors.newpassword.message}</span>}
                        <div className={cx('eye')}>
                            <img
                                src={displayPass === false ? images.eye_slash : images.eye}
                                alt="eye"
                                onClick={() => setDisplayPass(!displayPass)}
                            />
                        </div>
                    </div>
                </div>
                <div className={cx('inputField')}>
                    <label htmlFor="repassword" className="form-label">
                        Input Your Re-Password:
                    </label>
                    <div className={cx('protected-password')}>
                        <input
                            id="repassword"
                            name="repassword"
                            type={displayRePass === true ? 'text' : 'password'}
                            className="form-control"
                            {...register('repassword')}

                            // ref={userRef}
                            // onChange={(e) => setUser(e.target.value)}
                            // value={user}
                        />
                        {errors.repassword && <span className="form-message">{errors.repassword.message}</span>}
                        <div className={cx('eye')}>
                            <img
                                src={displayRePass === false ? images.eye_slash : images.eye}
                                alt="eye"
                                onClick={() => setDisplayRePass(!displayRePass)}
                            />
                        </div>
                    </div>
                </div>
                <ButtonLibrary
                    type="primary"
                    loading={loadings[0]}
                    // onClick={() => enterLoading(0)}
                    onClick={(e) => {
                        handleSubmit(onSubmit)(e);
                    }}
                    style={{ background: 'var(--primary)', borderColor: 'yellow' }}
                >
                    Confirm
                </ButtonLibrary>
            </div>
        </>
    );
}

export default ChangePasswordUser;
