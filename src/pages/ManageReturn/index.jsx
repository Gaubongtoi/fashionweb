import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Header from '~/chartComp/Header';
import classNames from 'classnames/bind';
import styles from './ManageReturn.module.scss';
import { formatPrice, priceDiscount } from '~/common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '~/components/Button';
import { UserContext } from '~/hooks/UserContext';
import ModalDetailReturn from './ModalDetailReturn';
import { toast } from 'react-toastify';
const cx = classNames.bind(styles);

function ManageReturn() {
    const [response, setResponse] = useState();
    const [pagCurr, setPagCurr] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [order, setOrder] = useState();
    const [checkChange, setCheckChange] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const state = useContext(UserContext);
    console.log(response);
    const pagName = ['Picking up', 'Received', 'Refund', 'Returned'];
    const date = (d) => {
        const currentDate = new Date(d);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let date = currentDate.getDate();
        let month = currentDate.getMonth();
        const monthAbbreviation = monthNames[month];

        let year = currentDate.getFullYear();
        return `${date} ${monthAbbreviation}, ${year}`;
    };
    useEffect(() => {
        axios.get(`http://localhost:3000/return`).then((res) => {
            let returnOrder = [...res.data].reverse();
            if (pagCurr === 0) {
                // orderUser = res.data.filter(i => i.id_client === user._id)
                returnOrder = returnOrder.filter((i) => i.status === 1);
            } else if (pagCurr === 1) {
                // orderUser = res.data.filter(i => i.id_client === user._id)
                returnOrder = returnOrder.filter((i) => i.status === 2);
            } else if (pagCurr === 2) {
                // orderUser = res.data.filter(i => i.id_client === user._id)
                returnOrder = returnOrder.filter((i) => i.status === 3);
            } else if (pagCurr === 3) {
                // orderUser = res.data.filter(i => i.id_client === user._id)
                returnOrder = returnOrder.filter((i) => i.status === 4);
            }
            // setOrders(orderUser);
            setResponse(returnOrder);
        });
    }, [pagCurr, checkChange]);
    return (
        <>
            <Header title="MANAGER RETURN" subtitle="View & Managing Returns!" />
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
                <ul className={cx('responsive-table')}>
                    <li className={cx('table-header')}>
                        <div className={cx('col', 'col-1')}>
                            {/* <FontAwesomeIcon icon={faImage}></FontAwesomeIcon> */}
                            Return ID
                        </div>
                        <div className={cx('col', 'col-2')}>status</div>
                        <div className={cx('col', 'col-3')}>Date Return</div>
                        <div className={cx('col', 'col-4')}>Adrress</div>
                        <div className={cx('col', 'col-5')}>Total</div>
                        <div className={cx('col', 'col-6')}></div>
                        <div className={cx('col', 'col-7')}></div>
                        {/* <div className={cx('col', 'col-9')}></div> */}
                    </li>
                    {response?.map((order, index) => {
                        return (
                            <li key={index} className={cx('table-row')}>
                                <div className={cx('col', 'col-1', 'name')} data-label="ID">
                                    RT_#2024{order?.id}
                                </div>
                                <div className={cx('col', 'col-2', 'name')} data-label="ID">
                                    {order.status === 1 && <p>Picking up</p>}
                                    {order.status === 2 && <p>Received</p>}
                                    {order.status === 3 && <p>Refund</p>}
                                    {order.status === 4 && <p>Returned</p>}
                                </div>
                                <div className={cx('col', 'col-3', 'name')} data-label="Product Name">
                                    {date(order?.createdAt)}
                                </div>
                                <div className={cx('col', 'col-4', 'name')} data-label="Price">
                                    {/* {item.price} */}
                                    {/* {formatPrice(order?.amount)} */}
                                    {order?.order?.address}, {order?.order?.city}
                                </div>
                                <div className={cx('col', 'col-5', 'name')} data-label="Discount">
                                    {/* {order.id} */}
                                    {formatPrice(order?.order?.amount)}
                                </div>
                                {order?.status === 1 && pagCurr === 0 && (
                                    <>
                                        <Button
                                            primary
                                            manageReturn
                                            onClick={() => {
                                                axios
                                                    .patch(`http://localhost:3000/return/${order?.id}`, {
                                                        status: 2,
                                                    })
                                                    .then((res) => {
                                                        console.log(res);
                                                        setCheckChange((prev) => !prev);
                                                        toast.success('Xác nhận đang tiến hành lấy hàng gửi trả');
                                                    })
                                                    .catch((err) => console.log(err));
                                            }}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            primary
                                            manageReturn
                                            onClick={() => {
                                                handleShow();
                                                setOrder(order);
                                            }}
                                        >
                                            Detail
                                        </Button>
                                    </>
                                )}
                                {order?.status === 2 && pagCurr === 1 && (
                                    <>
                                        <Button
                                            primary
                                            manageReturn
                                            onClick={() => {
                                                axios
                                                    .patch(`http://localhost:3000/return/${order?.id}`, {
                                                        status: 3,
                                                    })
                                                    .then((res) => {
                                                        console.log(res);
                                                        setCheckChange((prev) => !prev);
                                                        toast.success(
                                                            'Xác nhận hàng đã được gửi về shop. Tiến hành refund!!!',
                                                        );
                                                    })
                                                    .catch((err) => console.log(err));
                                            }}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            primary
                                            manageReturn
                                            onClick={() => {
                                                handleShow();
                                                setOrder(order);
                                            }}
                                        >
                                            Detail
                                        </Button>
                                    </>
                                )}
                                {order?.status === 3 && pagCurr === 2 && (
                                    <>
                                        {order?.isRefund === 2 ? (
                                            <Button primary disabled manageReturn>
                                                Refunded!!!
                                            </Button>
                                        ) : (
                                            <Button
                                                primary
                                                manageReturn
                                                onClick={() => {
                                                    axios
                                                        .patch(`http://localhost:3000/return/${order?.id}`, {
                                                            isRefund: 2,
                                                        })
                                                        .then((res) => {
                                                            console.log(res);
                                                            setCheckChange((prev) => !prev);
                                                            toast.success(
                                                                'Xác nhận đã chuyển khoản đến cho tài khoản. Chờ khách xác nhận đã hoàn tiền',
                                                            );
                                                        })
                                                        .catch((err) => console.log(err));
                                                }}
                                            >
                                                Refund
                                            </Button>
                                        )}

                                        <Button
                                            primary
                                            manageReturn
                                            onClick={() => {
                                                handleShow();
                                                setOrder(order);
                                            }}
                                        >
                                            Detail
                                        </Button>
                                    </>
                                )}
                                {order?.status === 4 && pagCurr === 3 && (
                                    <>
                                        <Button primary manageReturn disabled>
                                            Hehe
                                        </Button>
                                        <Button
                                            primary
                                            manageReturn
                                            onClick={() => {
                                                handleShow();
                                                setOrder(order);
                                            }}
                                        >
                                            Detail
                                        </Button>
                                    </>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
            <ModalDetailReturn show={showModal} handleClose={handleClose} returnOrder={order}></ModalDetailReturn>
        </>
    );
}

export default ManageReturn;
