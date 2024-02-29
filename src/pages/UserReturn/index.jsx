import classNames from 'classnames/bind';
import styles from './UserReturn.module.scss';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '~/hooks/UserContext';
import { formatPrice, priceDiscount } from '~/common';
import Button from '~/components/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function UserReturn() {
    const state = useContext(UserContext);
    const [response, setResponse] = useState();
    const [pagCurr, setPagCurr] = useState(0);
    const pagName = ['All', 'Picking up', 'Received', 'Refund', 'Returned'];

    useEffect(() => {
        axios.get(`http://localhost:3000/return?client_id=${state?.cuser?.value?.id}`).then((res) => {
            let returnOrder = [...res.data].reverse();
            if (pagCurr === 1) {
                // orderUser = res.data.filter(i => i.id_client === user._id)
                returnOrder = returnOrder.filter((i) => i.status === 1);
            } else if (pagCurr === 2) {
                // orderUser = res.data.filter(i => i.id_client === user._id)
                returnOrder = returnOrder.filter((i) => i.status === 2);
            } else if (pagCurr === 3) {
                // orderUser = res.data.filter(i => i.id_client === user._id)
                returnOrder = returnOrder.filter((i) => i.status === 3);
            } else if (pagCurr === 4) {
                // orderUser = res.data.filter(i => i.id_client === user._id)
                returnOrder = returnOrder.filter((i) => i.status === 4);
            }
            // setOrders(orderUser);
            setResponse(returnOrder);
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
                        {item}
                    </li>
                ))}
            </ul>
            <div className={cx('table')}>
                <Return response={response} userID={state?.cuser?.value?.id}></Return>
            </div>
        </div>
    );
}

export default UserReturn;

function Return({ response, userID }) {
    const navigator = useNavigate();
    const handleChangePage = (id) => {
        navigator(`/user/return/detail/${id}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const expectedDate = (day) => {
        // const splitD = d.split('/');
        // const D = 1706322872160;
        const currentDate = new Date(day);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let date = currentDate.getDate();
        let month = currentDate.getMonth();
        const monthAbbreviation = monthNames[month];

        let year = currentDate.getFullYear();
        return `${date} ${monthAbbreviation}, ${year}`;
    };
    // console.log(expectedDate());
    return (
        <>
            {response?.map((res, i) => {
                // console.log(order);
                console.log(res?.status);
                return (
                    <div className={cx('order')} key={i}>
                        <div className={cx('header-bill')}>
                            <ul className={cx('title-bill')}>
                                <li>
                                    <div className={cx('status')}>
                                        <p className={cx('row-title')}>Status</p>
                                        {res.status === 1 && <p>Picking up</p>}
                                        {res.status === 2 && <p>Received</p>}
                                        {res.status === 3 && <p>Refund</p>}
                                        {res.status === 4 && <p>Returned</p>}
                                    </div>
                                </li>
                                <li>
                                    <div className={cx('order-id')}>
                                        <p className={cx('row-title')}>Return ID</p>
                                        <p>RT_#2024{res.id}</p>
                                    </div>
                                </li>
                                <li>
                                    <div className={cx('total')}>
                                        <p className={cx('row-title')}>Total</p>
                                        <p>{formatPrice(res?.order?.amount)}</p>
                                    </div>
                                </li>
                                <li>
                                    <div className={cx('detail')}>
                                        <button onClick={() => handleChangePage(res?.id)}>See Detail</button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className={cx('body-bill')}>
                            <div className={cx('message-status')}>
                                {res.status === 1 && <p>Drop off the items by {expectedDate(res.datePickup)}</p>}
                                {res.status === 2 && (
                                    <p>
                                        Item received by us
                                        {/* {expectedDate(res.createdAt, res?.shipment)} */}
                                    </p>
                                )}
                                {res.status === 3 && <p>Refund sent within a week after we get the items</p>}
                                {res.status === 4 && <p>Completed</p>}
                            </div>
                            {res?.order?.products.map((prod, index) => {
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
                                {res?.status === 3 &&
                                    (res?.isRefund === 2 ? (
                                        <Button
                                            primary
                                            onClick={() => {
                                                axios
                                                    .patch(`http://localhost:3000/return/${res?.id}`, {
                                                        isRefund: 1,
                                                        status: 4,
                                                    })
                                                    .then((res) => {
                                                        console.log(res);
                                                        // setCheckChange((prev) => !prev);
                                                        toast.success(
                                                            'Đã xác nhận hoàn tiền đẩy đủ. Xin lỗi quý khách về sản phẩm!!',
                                                        );
                                                        navigator('/user/return');
                                                    })
                                                    .catch((err) => console.log(err));
                                            }}
                                        >
                                            Have Already Received Refund
                                        </Button>
                                    ) : (
                                        <Button primary disabled>
                                            Have Already Received Refund
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
