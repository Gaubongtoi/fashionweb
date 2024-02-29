import styles from './Return.module.scss';
import classNames from 'classnames/bind';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo, useContext } from 'react';
import { formatPrice, priceDiscount } from '~/common';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import Button from '~/components/Button';
import { Modal } from 'antd';
import images from '~/assets/images';
import { toast } from 'react-toastify';
import { UserContext } from '~/hooks/UserContext';
const cx = classNames.bind(styles);
function Return() {
    const param = useParams();
    const navigator = useNavigate();
    const [order, setOrder] = useState([]);
    const [datePicker, setDatePicker] = useState();
    console.log(typeof datePicker);
    const [isModalOpenCancel, setIsModalOpenCancel] = useState(false);
    const [isModalOpenFalse, setIsModalOpenFalse] = useState(false);
    // const state = useContext(UserContext);
    // console.log();
    const showModal = () => {
        setIsModalOpenCancel(true);
    };
    const handleCancel = () => {
        setIsModalOpenCancel(false);
        // setIsModalOpen(false);
    };
    const handleOkCancel = () => {
        navigator(`/user/order/detail/${param.id}`);
    };
    const handleCancelFalse = () => {
        setIsModalOpenFalse(false);
        // setIsModalOpen(false);
    };
    // console.log(datePicker);
    // console.log(datePicker);
    const tabs = ['USPS', 'Home'];
    const [method, setMethod] = useState('USPS');
    const phoneRegExp =
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    const schema = yup
        .object()
        .shape({
            name: yup.string().required('Trường này là bắt buộc'),
            address: yup.string().required('Trường này là bắt buộc'),
            city: yup.string().required('Trường này là bắt buộc'),
            // brand: yup.string().required('Bạn cần lựa chọn thành phố'),
            additional: yup.string().nullable(),
            district: yup.string().required('Trường này là bắt buộc'),
            ward: yup.string().required('Trường này là bắt buộc'),
            country: yup.string().required('Trường này là bắt buộc'),
            phoneNumber: yup
                .string()
                .required('Trường này là bắt buộc')
                .length(10, 'Số điện thoại phải có 10 số')
                .matches(phoneRegExp, 'Số điện thoại không hợp lệ'),
            description: yup.string().required('Trường này là bắt buộc'),
        })
        .required();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const date = (nextDate) => {
        if (nextDate) {
            const currentDate = new Date();
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            let date = currentDate.getDate() + nextDate;
            let month = currentDate.getMonth();
            let year = currentDate.getFullYear();
            // let test = new Date(year, month + 1, 0).getDate();
            // console.log(date, test);
            if (date > new Date(year, month + 1, 0).getDate()) {
                date -= new Date(year, month + 1, 0).getDate();
                month++;
                // Kiểm tra nếu tháng vượt quá 11 (tháng 12), tăng thêm năm
                if (month > 11) {
                    month = 0;
                    year++;
                }
            }
            const monthAbbreviation = monthNames[month];

            return `${date} ${monthAbbreviation}, ${year}`;
        } else {
            const currentDate = new Date();
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            let date = currentDate.getDate();
            let month = currentDate.getMonth();
            const monthAbbreviation = monthNames[month];

            let year = currentDate.getFullYear();
            return `${date} ${monthAbbreviation}, ${year}`;
        }
    };
    const subtotal = useMemo(() => {
        let total = order?.products?.reduce((cur, acc) => {
            return cur + acc.quantity * acc.product.price;
        }, 0);
        return total;
    });
    const discount = useMemo(() => {
        let dis = order?.products?.reduce((cur, acc) => {
            return cur + acc.quantity * ((acc.product.price * acc.product.discount_id) / 100);
        }, 0);
        return dis;
    });
    const totalSum = useMemo(() => {
        return subtotal - discount + 50000;
    });
    useEffect(() => {
        axios.get(`http://localhost:3000/orders/${param.id}`).then((res) => {
            // console.log(res.data.createdAt);
            // let order = [...res.data]
            // order[createAt] =
            setOrder(res.data);
            console.log(res.data);
        });
    }, []);
    // const formatDate = (data) => {};
    const onSubmit = async (data) => {
        // console.log(data);
        // const dateObj = new Date(datePicker);
        const dateObj = new Date(datePicker);
        const timestamp = dateObj.getTime(); // Lấy timestamp
        // const timestamp = new Date(datePicker);
        // // console.log(timestamp);
        const postData = {
            name: data.name,
            address: data.address,
            additional: data.additional,
            city: data.city,
            district: data.district,
            ward: data.ward,
            country: data.country,
            phoneNumber: data.phoneNumber,
            description: data.description,
            order: order,
            datePickup: timestamp,
            client_id: order?.client_id,
            status: 1,
            isRefund: 0,
        };
        console.log(postData);
        try {
            const resDelete = await axios.delete(`http://localhost:3000/orders/${param.id}`);
            const resPost = await axios.post(`http://localhost:3000/return`, postData);
            console.log(resPost);
            toast.success('Hoàn thành thông tin trả hàng. Vui lòng vào mục Returns để kiểm tra đơn hàng hoàn trả');
            navigator('/user/order');
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <div className={cx('wrapper')}>
                <ul className={cx('path')}>
                    <li>
                        <Link to="/user/order">
                            <p>Order</p>
                        </Link>
                    </li>
                    <span> &#62; </span>
                    <li>#2024{param.id}</li>
                    <span> &#62; </span>
                    <li>Return</li>
                </ul>
                <div className={cx('content')}>
                    <div className={cx('order-reason')}>
                        <div className={cx('left-content')}>
                            <div className={cx('title')}>
                                <p className={cx('span-number')}>1</p>
                                <p className={cx('title-line')}>Your Order You Want Return</p>
                            </div>

                            <div className={cx('order-wrapper')}>
                                <div className={cx('title-order')}>
                                    <p className={cx('order-code')}>Order #2024{order?.id}</p>
                                </div>
                                <div className={cx('body-order')}>
                                    {order?.products?.map((prod, index) => {
                                        return (
                                            <div className={cx('product')} key={index}>
                                                <div className={cx('product-img')}>
                                                    <div className={cx('product-img-wrapper')}>
                                                        <img
                                                            src={`https://shoesshop-6n6z.onrender.com/imgs/${prod?.product?.img}`}
                                                        />
                                                    </div>
                                                </div>
                                                <div className={cx('cart-item-infor')}>
                                                    <div className={cx('left-infor')}>
                                                        <p className={cx('cart-item-name')}>{prod?.product?.name}</p>

                                                        <div className={cx('cart-item-quantity')}>
                                                            <p>
                                                                {/* Size: <span>{prod?.size}</span> */}
                                                                Size: <span>{prod?.size}</span>
                                                            </p>
                                                            <p>
                                                                {/* x<span>{prod?.quantity}</span> */}x
                                                                <span>{prod?.quantity}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className={cx('right-infor')}>
                                                        <span className={cx('cart-item-price')}>
                                                            {formatPrice(
                                                                priceDiscount(
                                                                    prod?.product?.price,
                                                                    prod?.product?.discount_id,
                                                                ),
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className={cx('payment-wrapper-modal')}>
                                    <div className={cx('payment-display-modal')}>
                                        <p className={cx('label-modal')}>Subtotal</p>
                                        <p className={cx('price-modal')}>{formatPrice(subtotal)}</p>
                                    </div>
                                    <div className={cx('payment-display-modal')}>
                                        <p className={cx('label-modal')}>Discount</p>
                                        <p className={cx('discount-price-modal')}>- {formatPrice(discount)}</p>
                                    </div>
                                    <div className={cx('payment-display-modal')}>
                                        <p className={cx('label-modal')}>Shipping Costs</p>
                                        <p className={cx('discount-price-modal')}>+ {formatPrice(50000)}</p>
                                    </div>
                                    <div className={cx('payment-display-modal', 'total-wrapper')}>
                                        <p className={cx('label-modal', 'total')}>Total</p>
                                        <p className={cx('discount-price-modal')}>{formatPrice(totalSum)}</p>
                                    </div>
                                </div>
                                <div className={cx('pickup-date')}>
                                    <label className={cx('label-product')}>Pickup Date </label>
                                    <div className={cx('date-wrapper')}>
                                        <div
                                            className={cx('date', datePicker === date() && 'active')}
                                            onClick={() => setDatePicker(date())}
                                        >
                                            <p>{date()}</p>
                                        </div>
                                        <div
                                            className={cx('date', datePicker === date(1) && 'active')}
                                            onClick={() => setDatePicker(date(1))}
                                        >
                                            <p>{date(1)}</p>
                                        </div>
                                        <div
                                            className={cx('date', datePicker === date(2) && 'active')}
                                            onClick={() => setDatePicker(date(2))}
                                        >
                                            <p>{date(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={cx('right-content')}>
                            <div className={cx('title')}>
                                <p className={cx('span-number')}>2</p>
                                <p className={cx('title-line')}>Return method</p>
                            </div>
                            <div className={cx('method-return')}>
                                {/* <div className=''></div> */}
                                <div
                                    className={cx('method', method === 'USPS' && 'active')}
                                    onClick={() => setMethod('USPS')}
                                >
                                    <p className={cx('mtd-title')}>Drop off at USPS point</p>
                                    <p className={cx('mtd-content')}>
                                        Return through your local USPS post office in over 35,000 locations
                                    </p>
                                    <p className={cx('mtd-content')}>Find the nearest USPS point</p>
                                </div>
                                <div
                                    className={cx('method', method === 'Home' && 'active')}
                                    onClick={() => setMethod('Home')}
                                >
                                    <p className={cx('mtd-title')}>Home pick up</p>
                                    <p className={cx('mtd-content')}>
                                        A courier will pick up the parcel from the indicated address $5,75
                                    </p>
                                </div>
                            </div>
                            <div className={cx('form-wrapper')}>
                                {tabs && method === 'Home' ? (
                                    <>
                                        <div className={cx('input_product')}>
                                            <label className={cx('label-product')}>Full name </label>
                                            <input placeholder="..." {...register('name')} />
                                            {errors.name && <p className={cx('form-message')}>{errors.name.message}</p>}
                                        </div>
                                        <div className={cx('input_product')}>
                                            <label className={cx('label-product')}>address: </label>
                                            <input placeholder="..." {...register('address')} />
                                            {errors.address && (
                                                <p className={cx('form-message')}>{errors.address.message}</p>
                                            )}
                                        </div>
                                        <div className={cx('input_product')}>
                                            <label className={cx('label-product')}>
                                                additional information (e.g. Company):{' '}
                                            </label>
                                            <input placeholder="..." {...register('additional')} />
                                            {errors.additional && (
                                                <p className={cx('form-message')}>{errors.additional.message}</p>
                                            )}
                                        </div>
                                        <div className={cx('city-district', 'section-location')}>
                                            <div className={cx('input_product')}>
                                                <label className={cx('label-product')}>city: </label>
                                                <input placeholder="..." {...register('city')} />
                                                {errors.city && (
                                                    <p className={cx('form-message')}>{errors.city.message}</p>
                                                )}
                                            </div>
                                            <div className={cx('input_product')}>
                                                <label className={cx('label-product')}>district: </label>
                                                <input placeholder="..." {...register('district')} />
                                                {errors.district && (
                                                    <p className={cx('form-message')}>{errors.district.message}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className={cx('ward-country', 'section-location')}>
                                            <div className={cx('input_product')}>
                                                <label className={cx('label-product')}>ward: </label>
                                                <input placeholder="..." {...register('ward')} />
                                                {errors.ward && (
                                                    <p className={cx('form-message')}>{errors.ward.message}</p>
                                                )}
                                            </div>
                                            <div className={cx('input_product')}>
                                                <label className={cx('label-product')}>country: </label>
                                                <input placeholder="..." {...register('country')} />
                                                {errors.country && (
                                                    <p className={cx('form-message')}>{errors.country.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className={cx('input_product')}>
                                            <label className={cx('label-product')}>phone number: </label>
                                            <input placeholder="..." {...register('phoneNumber')} />
                                            {errors.phoneNumber && (
                                                <p className={cx('form-message')}>{errors.phoneNumber.message}</p>
                                            )}
                                        </div>
                                        <div className={cx('input_product')}>
                                            <label style={{ display: 'block' }} className={cx('label-product')}>
                                                Reason why return (Need detail about Defective product)
                                            </label>
                                            <textarea
                                                className={cx('input_textarea')}
                                                {...register('description')}
                                                // {...register("description", { required: true })}
                                            ></textarea>
                                            {errors.description && (
                                                <span className={cx('form-message')}>{errors.description.message}</span>
                                            )}
                                        </div>
                                        <div className={cx('btn-handle')}>
                                            <button className={cx('cancel')} onClick={showModal}>
                                                Cancel
                                            </button>
                                            <Button
                                                primary
                                                onClick={(e) => {
                                                    if (datePicker === '' || datePicker === undefined) {
                                                        setIsModalOpenFalse(true);
                                                    } else {
                                                        handleSubmit(onSubmit)(e);
                                                    }
                                                }}
                                            >
                                                Confirm
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className={cx('comming-img')}>
                                            <div className={cx('comming-img-wrapper')}>
                                                <img src={images.comming} />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal title="Thông báo" open={isModalOpenCancel} onOk={handleOkCancel} onCancel={handleCancel}>
                <p>Bạn có muốn huỷ hoàn trả hàng không?</p>
                {/* <p>Bạn chưa dán ảnh đầy đủ!!</p> */}
                {/* <ul>
                    <li>Tối thiểu 1 ảnh chính (Khuyến khích ảnh đã được removeBackground)</li>
                    <li>Tối thiểu 3 ảnh phụ</li>
                </ul> */}
            </Modal>
            <Modal title="Thông báo" open={isModalOpenFalse} onOk={handleCancelFalse} onCancel={handleCancelFalse}>
                <p>Bạn chưa chọn ngày lấy hàng!</p>
                {/* <p>Bạn chưa dán ảnh đầy đủ!!</p> */}
                {/* <ul>
                    <li>Tối thiểu 1 ảnh chính (Khuyến khích ảnh đã được removeBackground)</li>
                    <li>Tối thiểu 3 ảnh phụ</li>
                </ul> */}
            </Modal>
        </>
    );
}

export default Return;
