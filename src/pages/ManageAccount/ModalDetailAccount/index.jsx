import classNames from 'classnames/bind';
import styles from './ModalDetailAccount.module.scss';
import { useState, useContext, useEffect } from 'react';
import { UserContext } from '~/hooks/UserContext';
import axios from 'axios';
import Modal from 'react-modal';
import { formatPrice, priceDiscount } from '~/common';
import { useNavigate } from 'react-router-dom';
import images from '~/assets/images';
// import '/ModalDetailAccount.css';
import '~/pages/ManageAccount/ModalDetailAccount/ModalDetailAccount.css';
const cx = classNames.bind(styles);
function ModalDetailAccount({ show, handleClose, accInfor }) {
    console.log(accInfor);
    const handleCreateAt = (data) => {
        // console.log(data);
        let dateObject = new Date(data);
        let day = dateObject.getDate();
        let month = dateObject.getMonth() + 1;
        // Lấy năm
        let year = dateObject.getFullYear();
        return `${day}/${month}/${year}`;
    };
    return (
        <Modal
            isOpen={show}
            onRequestClose={handleClose}
            style={{
                overlay: {
                    // backgroundColor: 'red',
                    zIndex: '10',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                content: {
                    position: 'absolute',
                    // top: '40px',
                    // transform: 'translateY(-50%)',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    right: '40px',
                    bottom: '40px',
                    border: '1px solid #ccc',
                    // background: 'red',
                    width: '50%',
                    height: '70%',
                    overflow: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    borderRadius: '4px',
                    outline: 'none',
                    padding: '60px',
                },
            }}
            ariaHideApp={false}
        >
            <div className={cx('wrapper')}>
                <p className={cx('title')}>ACCOUNT INFORMATION</p>

                <div className={cx('body_modal')}>
                    <div className={cx('user_info')}>
                        <p>
                            <span>Role</span>: {accInfor.roleId === 3 || accInfor.roleId === 4 ? 'User' : 'Admin'}
                        </p>
                        <p>
                            <span>Account Name</span>: {accInfor.name}
                        </p>
                        <p>
                            <span>Email</span>: {accInfor.email}
                        </p>
                        <p>
                            <span>Customer Name</span>: {accInfor.fullname}
                        </p>
                        <p>
                            <span>Phone Number</span>: {accInfor.phone}
                        </p>

                        <p>
                            <span>Register Date</span>: {handleCreateAt(accInfor.createdAt)}
                        </p>
                    </div>
                    <UserOrder userID={accInfor.id} />
                </div>
                <button onClick={handleClose} className={cx('close_btn')}>
                    &times;
                </button>
            </div>
        </Modal>
    );
}

export default ModalDetailAccount;

function UserOrder(userID) {
    console.log(userID);
    const pagName = ['All', 'Confirmating', 'Delivering', 'Completed', 'Canceled'];
    const [pagCurr, setPagCurr] = useState(0);
    const state = useContext(UserContext);
    const [orders, setOrders] = useState([]);
    // console.log();
    let [deliAmount, setDeliAmount] = useState();
    useEffect(() => {
        // Get ra được tất cả những dữ liệu đơn hàng
        axios.get('http://localhost:3000' + `/orders?client_id=${userID.userID}`).then((res) => {
            console.log(res);
            // Sau đó đảo lộn response từ dưới đầu lên trên
            let orderUser = [...res.data].reverse();
            // Kiểm tra trang hiện tại là ở đâu
            // Nếu là ở trang 1 - Tất cả
            // => Lọc ra toàn bộ những phần tử con mà có status đơn hàng là 1
            if (pagCurr === 1) {
                orderUser = orderUser.filter((i) => i.status === 1);
            } else if (pagCurr === 2) {
                orderUser = orderUser.filter((i) => i.status === 2);
            } else if (pagCurr === 3) {
                orderUser = orderUser.filter((i) => i.status === 3);
            } else if (pagCurr === 4) {
                orderUser = orderUser.filter((i) => i.status === 4);
            }
            setOrders(orderUser);
            setDeliAmount(res.data.filter((i) => i.status === 2).length);
        });
    }, [pagCurr]);
    return (
        <div className={cx('wrapper-order')}>
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
                {orders.length === 0 ? (
                    <div className={cx('order-empty')}>
                        <img src={images.emptyCart} />
                        <p>Tài khoản này chưa có sản phẩm nào!!!</p>
                    </div>
                ) : (
                    <Orders orders={orders} userID={userID} />
                )}
            </div>
        </div>
    );
}

function Orders({ orders, userID }) {
    const navigator = useNavigate();
    const handleChangePage = (id) => {
        navigator(`/user/order/detail/${id}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const state = useContext(UserContext);
    // console.log();
    // console.log();
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
                                        <button
                                            onClick={() => {
                                                if (state?.cuser?.value?.id === userID.userID) {
                                                    handleChangePage(order.id);
                                                }
                                            }}
                                        >
                                            See Detail
                                        </button>
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
                        </div>
                    </div>
                );
            })}
        </>
    );
}
