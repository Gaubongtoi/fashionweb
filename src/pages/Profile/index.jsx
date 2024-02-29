import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '~/hooks/UserContext';
import AvatarAuto from '~/components/AvatarAuto';

import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '~/components/PageLoading/store';
import { actions } from '~/components/PageLoading/store';
import Button from '~/components/Button';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
const cx = classNames.bind(styles);

function Profile() {
    const state = useContext(UserContext);
    const [edit, setEdit] = useState(false);
    const [isFormDirty, setIsFormDirty] = useState(false);
    const [isLoading, dispatch] = useContext(StoreContext);
    const navigator = useNavigate();

    const phoneRegExp =
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    const navigate = useNavigate();

    const schema = yup
        .object()
        .shape({
            fullname: yup.string().required('Bạn cần nhập trường này'),
            name: yup.string().required('Bạn cần nhập trường này'),
            email: yup.string().required('Bạn cần nhập trường này').email('Email không hợp lệ'),
            phoneNumber: yup
                .string()
                .required('Bạn cần nhập trường này')
                .length(10, 'Số điện thoại phải có 10 số')
                .matches(phoneRegExp, 'Số điện thoại không hợp lệ'),
            address: yup.string().required('Bạn cần nhập trường này'),
        })
        .required();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, dirtyFields },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const defaultValues = {
        fullname: state?.cuser?.value?.fullname,
        name: state?.cuser?.value?.name,
        email: state?.cuser?.value?.email,
        phoneNumber: state?.cuser?.value?.phone,
        address: state?.cuser?.value?.address,
    };

    const currentValues = {
        fullname: watch('fullname', defaultValues.fullname),
        name: watch('name', defaultValues.name),
        email: watch('email', defaultValues.email),
        phoneNumber: watch('phoneNumber', defaultValues.phoneNumber),
        address: watch('address', defaultValues.address),
        // Lấy giá trị của các trường input khác và gán vào đây
    };
    console.log(defaultValues.fullname);
    console.log(currentValues.fullname);
    useEffect(() => {
        const isDirty = Object.keys(dirtyFields).some(
            (fieldName) => currentValues[fieldName] !== defaultValues[fieldName],
        );
        setIsFormDirty(isDirty);
    }, [dirtyFields, currentValues, defaultValues]);
    // console.log(isFormDirty);

    const onSubmit = async (data) => {
        console.log(data);
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const dataPost = {
            fullname: data.fullname,
            name: data.name,
            email: data.email,
            phone: data.phoneNumber,
            address: data.address,
        };

        try {
            // console.log(dataPost);
            console.log(state?.cuser?.value);
            dispatch(actions.setLoading(true));
            await delay(2000); // Chờ 2 giây
            const res = await axios.put(`http://localhost:4000/auth/user/update/${state?.cuser?.value?.id}`, dataPost);

            let dataUpdate = {
                fullname: res.data.fullname,
                name: res.data.name,
                email: res.data.email,
                phone: res.data.phone,
                address: res.data.address,
            };

            let newData = {
                ...state?.cuser?.value,
                ...dataUpdate,
            };
            toast.success('Chỉnh sửa thông tin thành công', {
                // autoClose: 2000,
                theme: 'colored',
                position: 'top-right',
                autoClose: 3000,
            });
            state?.cuser?.setCurrentUser(newData);
            localStorage.setItem('user', JSON.stringify(newData));
            setEdit(false);
        } catch (error) {
            // Xử lý lỗi nếu có
            console.log(error);
            toast.error('Chỉnh sửa thông tin thất bại', {
                // autoClose: 2000,
                theme: 'colored',
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            dispatch(actions.setLoading(false)); // Kết thúc hiển thị trạng thái loading
        }
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('section')}>
                <div className={cx('header-title')}>
                    <p className={cx('title')}>Personal Information</p>
                </div>
                <div className={cx('content-wrapper')}>
                    <div className={cx('avatar')}>
                        <AvatarAuto nameU={state?.cuser?.value?.fullname} />
                        <p className={cx('name')}>
                            Hello, <span>{state?.cuser?.value?.fullname}!!!</span>
                        </p>
                    </div>

                    <div className={cx('form-wrapper')}>
                        {edit === true ? (
                            <>
                                <div className={cx('user-name')}>
                                    <div className={cx('full-name')}>
                                        <label htmlFor="fullname" className="form-label">
                                            Full Name:
                                        </label>
                                        <input
                                            // className={cx('unedited')}
                                            id="fullname"
                                            name="ten"
                                            type="text"
                                            className="form-control"
                                            // value={state?.cuser?.value?.fullname}
                                            value={currentValues.fullname}
                                            {...register('fullname')}
                                        />
                                        {errors.fullname && (
                                            <span className="form-message">{errors.fullname.message}</span>
                                        )}
                                    </div>
                                    <div className={cx('nick-name')}>
                                        <label htmlFor="nickname" className="form-label">
                                            Name:
                                        </label>
                                        <input
                                            id="nickname"
                                            name="nickname"
                                            type="text"
                                            className="form-control"
                                            value={currentValues.name}
                                            {...register('name')}
                                        />
                                        {errors.name && <span className="form-message">{errors.name.message}</span>}
                                    </div>
                                </div>
                                <div className={cx('email')}>
                                    <label htmlFor="email" className="form-label">
                                        Email:
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="form-control"
                                        value={currentValues.email}
                                        {...register('email')}
                                    />
                                    {errors.email && <span className="form-message">{errors.email.message}</span>}
                                </div>
                                <div className={cx('phone-number')}>
                                    <label htmlFor="phoneNumber" className="form-label">
                                        Phone Number:
                                    </label>
                                    <input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        type="text"
                                        className="form-control"
                                        value={currentValues.phoneNumber}
                                        {...register('phoneNumber')}
                                    />
                                    {errors.phoneNumber && (
                                        <span className="form-message">{errors.phoneNumber.message}</span>
                                    )}
                                </div>
                                <div className={cx('address')}>
                                    <label htmlFor="address" className="form-label">
                                        Address:
                                    </label>
                                    <input
                                        id="address"
                                        name="address"
                                        type="text"
                                        className="form-control"
                                        value={currentValues.address}
                                        {...register('address')}
                                    />
                                    {errors.address && <span className="form-message">{errors.address.message}</span>}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={cx('user-name')}>
                                    <div className={cx('full-name')}>
                                        <label htmlFor="fullname" className="form-label">
                                            Full Name:
                                        </label>
                                        <input
                                            // className={cx('unedited')}
                                            id="fullname"
                                            name="ten"
                                            type="text"
                                            className="form-control"
                                            // value={state?.cuser?.value?.fullname}
                                            value={currentValues.fullname}
                                            disabled
                                        />
                                    </div>
                                    <div className={cx('nick-name')}>
                                        <label htmlFor="nickname" className="form-label">
                                            Name:
                                        </label>
                                        <input
                                            id="nickname"
                                            name="nickname"
                                            type="text"
                                            className="form-control"
                                            value={currentValues.name}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className={cx('email')}>
                                    <label htmlFor="email" className="form-label">
                                        Email:
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="form-control"
                                        value={currentValues.email}
                                        disabled
                                    />
                                </div>
                                <div className={cx('phone-number')}>
                                    <label htmlFor="phoneNumber" className="form-label">
                                        Phone Number:
                                    </label>
                                    <input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        type="text"
                                        className="form-control"
                                        value={currentValues.phoneNumber}
                                        disabled
                                    />
                                </div>
                                <div className={cx('address')}>
                                    <label htmlFor="address" className="form-label">
                                        Address:
                                    </label>
                                    <input
                                        id="address"
                                        name="address"
                                        type="text"
                                        className="form-control"
                                        value={currentValues.address}
                                        disabled
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className={cx('logout-change')}>
                {edit === true &&
                    (isFormDirty === true ? (
                        <>
                            <button className="hello" onClick={() => setEdit((prev) => !prev)}>
                                Cancel
                            </button>
                            <Button
                                primary
                                // onClick={(e) => {
                                //     handleSubmit(onSubmit)(e);
                                // }}
                                type="submit"
                                onClick={(e) => {
                                    // console.log('Hello');
                                    handleSubmit(onSubmit)(e);
                                }}
                            >
                                Change
                            </Button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setEdit((prev) => !prev)}>Cancel</button>
                            <Button primary disabled>
                                Change
                            </Button>
                        </>
                    ))}
                {/* // (formState.isDirty === true ? ( //{' '}
                <Button primary onClick={() => setEdit((prev) => !prev)}>
                    // Change //{' '}
                </Button>
                // ) : ( //{' '}
                <Button primary disabled>
                    // Change //{' '}
                </Button>
                // ))} */}
                {edit === false && (
                    <Button primary onClick={() => setEdit((prev) => !prev)}>
                        Edit
                    </Button>
                )}
                {/* {isFormDirty && <button type="submit">Submit</button>} */}
            </div>
            {/* <div className={cx('section')}>
                <p className={cx('title')}>Personal Information</p>
                <div className={cx('content-wrapper')}></div>
            </div> */}
        </div>
    );
}

export default Profile;
