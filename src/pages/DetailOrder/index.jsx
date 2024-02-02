import classNames from 'classnames/bind';
import styles from './DetailOrder.module.scss';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo, useContext } from 'react';
import { formatPrice, priceDiscount } from '~/common';
import { actions } from '~/components/PageLoading/store';
import { StoreContext } from '~/components/PageLoading/store';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Button, Modal } from 'antd';
const cx = classNames.bind(styles);
function DetailOrder() {
    const param = useParams();
    const [order, setOrder] = useState([]);
    const [isLoading, dispatch] = useContext(StoreContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        let cancel = {
            ...order,
            status: 4,
        };
        setIsModalOpen(false);
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        // .then((res) => console.log(res));
        try {
            // console.log(dataPost);
            // console.log(state?.cuser?.value);
            dispatch(actions.setLoading(true));
            await delay(2000); // Chờ 2 giây
            const res = await axios.put(`http://localhost:3000/orders/${param.id}`, cancel);

            let dataUpdate = {
                ...res,
            };
            setOrder(dataUpdate);
            toast.success('Huỷ đơn hàng thành công', {
                // autoClose: 2000,
                theme: 'colored',
                position: 'top-right',
                autoClose: 3000,
            });
        } catch (error) {
            // Xử lý lỗi nếu có
            toast.error('Huỷ đơn hàng thất bại!', {
                // autoClose: 2000,
                theme: 'colored',
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            navigator('/user/order');
            dispatch(actions.setLoading(false)); // Kết thúc hiển thị trạng thái loading
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const navigator = useNavigate();
    const date = (d) => {
        const currentDate = new Date(d);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let date = currentDate.getDate();
        let month = currentDate.getMonth();
        const monthAbbreviation = monthNames[month];

        let year = currentDate.getFullYear();
        return `${date} ${monthAbbreviation}, ${year}`;
    };
    const subtotal = useMemo(() => {
        let total = order?.products?.reduce((cur, acc) => {
            return cur + acc.quantity * acc.product.price;
        }, 0);
        return total;
    });
    console.log(subtotal);
    const discount = useMemo(() => {
        let dis = order?.products?.reduce((cur, acc) => {
            return cur + acc.quantity * ((acc.product.price * acc.product.discount_id) / 100);
        }, 0);
        return dis;
    });
    const totalSum = useMemo(() => {
        return subtotal - discount + 50000;
    });
    const expectedDate = (day, shipment) => {
        // const splitD = d.split('/');
        // const D = 1706322872160;
        const currentDate = new Date(day);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        if (shipment === 'save') {
            currentDate.setDate(currentDate.getDate() + 5);
        } else if (shipment === 'fast') {
            currentDate.setDate(currentDate.getDate() + 3);
        }
        // console.log(typeof currentDate);
        // console.log(currentDate.);
        let date = currentDate.getDate();
        let month = currentDate.getMonth();
        const monthAbbreviation = monthNames[month];

        let year = currentDate.getFullYear();
        return `${date} ${monthAbbreviation}, ${year}`;
        // return currentDate;
        // const dv = new Date(`${splitD[2]}-${splitD[1]}-${splitD[0]}`);
        // console.log(dv);

        // let expecDay = new Date(dv);
        // expecDay.setDate(dv.getDate() + 3);

        // expecDay = expecDay.toLocaleDateString().split('/');

        // return `${expecDay[1]}/${expecDay[0]}/${expecDay[2]}`;
    };

    console.log(param.id);
    useEffect(() => {
        axios.get(`http://localhost:3000/orders/${param.id}`).then((res) => {
            // console.log(res.data.createdAt);
            // let order = [...res.data]
            // order[createAt] =
            setOrder(res.data);
            console.log(res.data);
        });
    }, []);
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
                </ul>
                <div className={cx('content')}>
                    <div className={cx('message-status')}>
                        <div className="status">
                            {order?.status === 1 && <p>Please Waiting Confirm Your Order</p>}
                            {order?.status === 2 && (
                                <p>Estimated delivery: {expectedDate(order?.createdAt, order?.shipment)}</p>
                            )}
                            {order?.status === 3 && <p>Delivered</p>}
                            {order?.status === 4 && <p>Cancellation requested</p>}
                        </div>
                        <div className={cx('handle-btn')}>
                            {order?.status === 1 && (
                                <button className={cx('cancel')} onClick={showModal}>
                                    Cancel Order
                                </button>
                            )}
                            {order?.status === 2 && (
                                <button className={cx('cancel')} onClick={showModal}>
                                    Cancel Order
                                </button>
                            )}
                            {/* {order?.status === 1 && <button className={cx('cancel')}>Cancel Order</button>} */}
                        </div>
                    </div>
                    <div className={cx('process-information')}>
                        <div className={cx('left-content')}>
                            <div className={cx('name')}>
                                <div className={cx('first-name')}>
                                    <p className={cx('label')}>First name:</p>
                                    <p>{order?.firstname}</p>
                                </div>
                                <div className={cx('last-name')}>
                                    <p className={cx('label')}>Last name:</p>
                                    <p>{order?.lastname}</p>
                                </div>
                            </div>
                            <div className={cx('address')}>
                                <p className={cx('label')}>Shipping Address: </p>
                                <p>
                                    {order?.address}, {order?.city}
                                </p>
                            </div>
                            <div className={cx('ship-method')}>
                                <p className={cx('label')}>Ship Method: </p>
                                <p>{order?.shipment === 'save' ? 'Vận chuyển tiết kiệm' : 'Vận chuyển nhanh'}</p>
                            </div>
                            <div className={cx('payment-method')}>
                                <p className={cx('label')}>Payment Method: </p>
                                <p>{order?.payment === 'cod' ? 'COD - Cash On Delivery' : ''}</p>
                            </div>
                            <div className={cx('order-date')}>
                                <p className={cx('label')}>Order Date: </p>
                                <p>{date(order?.createdAt)}</p>
                            </div>
                        </div>
                        <div className={cx('right-content')}>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal title="Thông báo" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Bạn có muốn huỷ đơn hàng này không?</p>
            </Modal>
        </>
    );
}

export default DetailOrder;
