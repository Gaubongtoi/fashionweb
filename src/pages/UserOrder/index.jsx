import classNames from 'classnames/bind';
import styles from './UserOrder.module.scss';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '~/hooks/UserContext';
import axios from 'axios';
import { formatPrice, priceDiscount } from '~/common';
import { useNavigate } from 'react-router-dom';
import Button from '~/components/Button';
import { toast } from 'react-toastify';
const cx = classNames.bind(styles);

function UserOrder() {
    const pagName = ['All', 'Confirmating', 'Delivering', 'Completed', 'Canceled'];
    const [pagCurr, setPagCurr] = useState(0);
    const state = useContext(UserContext);
    const [orders, setOrders] = useState([]);
    let [deliAmount, setDeliAmount] = useState();
    useEffect(() => {
        axios.get('http://localhost:3000' + `/orders?client_id=${state?.cuser?.value?.id}`).then((res) => {
            let orderUser = [...res.data].reverse();
            if (pagCurr === 1) {
                // orderUser = res.data.filter(i => i.id_client === user._id)
                orderUser = orderUser.filter((i) => i.status === 1);
            } else if (pagCurr === 2) {
                // orderUser = res.data.filter(i => i.id_client === user._id)
                orderUser = orderUser.filter((i) => i.status === 2);
            } else if (pagCurr === 3) {
                // orderUser = res.data.filter(i => i.id_client === user._id)
                orderUser = orderUser.filter((i) => i.status === 3);
            } else if (pagCurr === 4) {
                // orderUser = res.data.filter(i => i.id_client === user._id)
                orderUser = orderUser.filter((i) => i.status === 4);
            }
            setOrders(orderUser);
            setDeliAmount(res.data.filter((i) => i.status === 2).length);
        });
    }, [pagCurr]);
    return (
        <div className={cx('wrapper')}>
            <ul className={cx('navigate')}>
                {pagName.map((item, index) => (
                    <li
                        key={item}
                        className={cx({ li_active: index === pagCurr })}
                        onClick={() => {
                            setPagCurr(index);
                        }}
                    >
                        {item} {index === 2 && <span>({deliAmount})</span>}
                    </li>
                ))}
            </ul>
            <div className={cx('table')}>
                <Orders orders={orders} userID={state?.cuser?.value?.id} />
            </div>
        </div>
    );
}

export default UserOrder;

function Orders({ orders, userID }) {
    const navigator = useNavigate();
    const handleChangePage = (id) => {
        navigator(`/user/order/detail/${id}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
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
    // console.log(expectedDate());
    return (
        <>
            {orders.map((order, i) => {
                // console.log(order);

                return (
                    <div className={cx('order')} key={i}>
                        <div className={cx('header-bill')}>
                            <ul className={cx('title-bill')}>
                                <li>
                                    <div className={cx('status')}>
                                        <p className={cx('row-title')}>Status</p>
                                        {order.status === 1 && <p>Confirmating</p>}
                                        {order.status === 2 && <p>Delivering</p>}
                                        {order.status === 3 && <p>Completed</p>}
                                        {order.status === 4 && <p>Canceled</p>}
                                    </div>
                                </li>
                                <li>
                                    <div className={cx('order-id')}>
                                        <p className={cx('row-title')}>Order ID</p>
                                        <p>#2024{order.id}</p>
                                    </div>
                                </li>
                                <li>
                                    <div className={cx('total')}>
                                        <p className={cx('row-title')}>Total</p>
                                        <p>{formatPrice(order.amount)}</p>
                                    </div>
                                </li>
                                <li>
                                    <div className={cx('detail')}>
                                        <button onClick={() => handleChangePage(order.id)}>See Detail</button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className={cx('body-bill')}>
                            <div className={cx('message-status')}>
                                {order.status === 1 && <p>Please Waiting Confirm Your Order</p>}
                                {order.status === 2 && (
                                    <p>Estimated delivery: {expectedDate(order.createdAt, order?.shipment)}</p>
                                )}
                                {order.status === 3 && <p>Delivered</p>}
                                {order.status === 4 && <p>Cancellation requested</p>}
                            </div>
                            {order.products.map((prod, index) => {
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
                                                        priceDiscount(prod?.product?.price, prod?.product?.discount_id),
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div className={cx('received')}>
                                {order?.status === 2 &&
                                    (order?.isPay === 2 ? (
                                        <Button
                                            primary
                                            onClick={() => {
                                                axios
                                                    .patch(`http://localhost:3000/orders/${order?.id}`, {
                                                        isPay: 1,
                                                        status: 3,
                                                    })
                                                    .then((res) => {
                                                        console.log(res);
                                                        // setCheckChange((prev) => !prev);
                                                        toast.success(
                                                            'Đã hoàn tất thanh toán đầy đủ. Cảm ơn quý khách!!',
                                                        );
                                                        navigator('/user/order');
                                                    })
                                                    .catch((err) => console.log(err));
                                            }}
                                        >
                                            Received
                                        </Button>
                                    ) : (
                                        <Button primary disabled>
                                            Received
                                        </Button>
                                    ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
}
