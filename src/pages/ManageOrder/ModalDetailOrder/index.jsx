import classNames from 'classnames/bind';
import styles from './ModalDetailOrder.module.scss';
import { formatPrice, priceDiscount } from '~/common';
import { useState, useContext, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
const cx = classNames.bind(styles);
function ModalDetailOrder({ show, handleClose, order, handleReRender }) {
    console.log(order);

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
                    width: '60%',
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
                <ul className={cx('path')}>
                    <li>
                        <Link to="/user/order">
                            <p>Order</p>
                        </Link>
                    </li>
                    <span> &#62; </span>
                    <li>#2024{order?.id}</li>
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
                    </div>
                    <div className={cx('process-information')}>
                        <div className={cx('left-content')}>
                            <div className={cx('pixelplus-steps-steps')}>
                                <div className={cx('pixelplus-steps-step', 'active')} data-id="0">
                                    <div className={cx('pixelplus-steps-step__number')}></div>
                                    <div className={cx('pixelplus-steps-step__text')}>
                                        <div className={cx('pixelplus-steps-step__title')}>
                                            <strong>Order</strong>
                                        </div>
                                        <div
                                            className={cx('pixelplus-steps-step__excerpt')}
                                            style={{ display: 'block' }}
                                        >
                                            <p>{date(order?.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>
                                {order?.status === 1 && (
                                    <>
                                        <div className={cx('pixelplus-steps-step', 'active')} data-id="1">
                                            <div className={cx('pixelplus-steps-step__number')}></div>
                                            <div className={cx('pixelplus-steps-step__text')}>
                                                <div className={cx('pixelplus-steps-step__title')}>
                                                    <strong>Confirmation</strong>
                                                </div>
                                                <div
                                                    className={cx('pixelplus-steps-step__excerpt')}
                                                    style={{ display: 'block' }}
                                                >
                                                    <p>Please Waiting Confirmation for Your Order</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={cx('pixelplus-steps-step')} data-id="2">
                                            <div className={cx('pixelplus-steps-step__number')}></div>
                                            <div className={cx('pixelplus-steps-step__text')}>
                                                <div className={cx('pixelplus-steps-step__title')}>
                                                    <strong>Delivering</strong>
                                                </div>
                                                <div
                                                    className={cx('pixelplus-steps-step__excerpt')}
                                                    style={{ display: 'block' }}
                                                >
                                                    {/* <p></p> */}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={cx('pixelplus-steps-step')} data-id="3">
                                            <div className={cx('pixelplus-steps-step__number')}></div>
                                            <div className={cx('pixelplus-steps-step__text')}>
                                                <div className={cx('pixelplus-steps-step__title')}>
                                                    {' '}
                                                    <strong>Completed</strong>
                                                </div>
                                                <div
                                                    className={cx('pixelplus-steps-step__excerpt')}
                                                    style={{ display: 'block' }}
                                                >
                                                    <p></p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {order?.status === 2 && (
                                    <>
                                        <div className={cx('pixelplus-steps-step', 'active')} data-id="1">
                                            <div className={cx('pixelplus-steps-step__number')}></div>
                                            <div className={cx('pixelplus-steps-step__text')}>
                                                <div className={cx('pixelplus-steps-step__title')}>
                                                    <strong>Confirmation</strong>
                                                </div>
                                                <div
                                                    className={cx('pixelplus-steps-step__excerpt')}
                                                    style={{ display: 'block' }}
                                                >
                                                    <p></p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={cx('pixelplus-steps-step', 'active')} data-id="2">
                                            <div className={cx('pixelplus-steps-step__number')}></div>
                                            <div className={cx('pixelplus-steps-step__text')}>
                                                <div className={cx('pixelplus-steps-step__title')}>
                                                    <strong>Delivering</strong>
                                                </div>
                                                <div
                                                    className={cx('pixelplus-steps-step__excerpt')}
                                                    style={{ display: 'block' }}
                                                >
                                                    <p>Estimated {expectedDate(order?.createdAt, order?.shipment)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={cx('pixelplus-steps-step')} data-id="3">
                                            <div className={cx('pixelplus-steps-step__number')}></div>
                                            <div className={cx('pixelplus-steps-step__text')}>
                                                <div className={cx('pixelplus-steps-step__title')}>
                                                    {' '}
                                                    <strong>Completed</strong>
                                                </div>
                                                <div
                                                    className={cx('pixelplus-steps-step__excerpt')}
                                                    style={{ display: 'block' }}
                                                >
                                                    <p></p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {order?.status === 3 && (
                                    <>
                                        <div className={cx('pixelplus-steps-step', 'active')} data-id="1">
                                            <div className={cx('pixelplus-steps-step__number')}></div>
                                            <div className={cx('pixelplus-steps-step__text')}>
                                                <div className={cx('pixelplus-steps-step__title')}>
                                                    <strong>Confirmation</strong>
                                                </div>
                                                <div
                                                    className={cx('pixelplus-steps-step__excerpt')}
                                                    style={{ display: 'block' }}
                                                >
                                                    <p></p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={cx('pixelplus-steps-step', 'active')} data-id="2">
                                            <div className={cx('pixelplus-steps-step__number')}></div>
                                            <div className={cx('pixelplus-steps-step__text')}>
                                                <div className={cx('pixelplus-steps-step__title')}>
                                                    <strong>Delivering</strong>
                                                </div>
                                                <div
                                                    className={cx('pixelplus-steps-step__excerpt')}
                                                    style={{ display: 'block' }}
                                                >
                                                    <p></p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={cx('pixelplus-steps-step', 'active')} data-id="3">
                                            <div className={cx('pixelplus-steps-step__number')}></div>
                                            <div className={cx('pixelplus-steps-step__text')}>
                                                <div className={cx('pixelplus-steps-step__title')}>
                                                    {' '}
                                                    <strong>Completed</strong>
                                                </div>
                                                <div
                                                    className={cx('pixelplus-steps-step__excerpt')}
                                                    style={{ display: 'block' }}
                                                >
                                                    <p></p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {order?.status === 4 && (
                                    <>
                                        <div className={cx('pixelplus-steps-step', 'active')} data-id="1">
                                            <div className={cx('pixelplus-steps-step__number')}></div>
                                            <div className={cx('pixelplus-steps-step__text')}>
                                                <div className={cx('pixelplus-steps-step__title')}>
                                                    <strong>Confirmation</strong>
                                                </div>
                                                <div
                                                    className={cx('pixelplus-steps-step__excerpt')}
                                                    style={{ display: 'block' }}
                                                >
                                                    <p></p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={cx('pixelplus-steps-step', 'active')} data-id="2">
                                            <div className={cx('pixelplus-steps-step__number')}></div>
                                            <div className={cx('pixelplus-steps-step__text')}>
                                                <div className={cx('pixelplus-steps-step__title')}>
                                                    <strong>Cancel Order</strong>
                                                </div>
                                                <div
                                                    className={cx('pixelplus-steps-step__excerpt')}
                                                    style={{ display: 'block' }}
                                                >
                                                    <p>Your Order Have Been Canceled</p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {/* <div className={cx('pixelplus-steps-step')} data-id="1">
                                    <div className={cx('pixelplus-steps-step__number')}></div>
                                    <div className={cx('pixelplus-steps-step__text')}>
                                        <div className={cx('pixelplus-steps-step__title')}>
                                            <strong>Confirmation</strong>
                                        </div>
                                        <div
                                            className={cx('pixelplus-steps-step__excerpt')}
                                            style={{ display: 'block' }}
                                        >
                                            <p></p>
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('pixelplus-steps-step')} data-id="2">
                                    <div className={cx('pixelplus-steps-step__number')}></div>
                                    <div className={cx('pixelplus-steps-step__text')}>
                                        <div className={cx('pixelplus-steps-step__title')}>
                                            <strong>Delivering</strong>
                                        </div>
                                        <div
                                            className={cx('pixelplus-steps-step__excerpt')}
                                            style={{ display: 'block' }}
                                        >
                                            <p></p>
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('pixelplus-steps-step')} data-id="3">
                                    <div className={cx('pixelplus-steps-step__number')}></div>
                                    <div className={cx('pixelplus-steps-step__text')}>
                                        <div className={cx('pixelplus-steps-step__title')}>
                                            {' '}
                                            <strong>Completed</strong>
                                        </div>
                                        <div
                                            className={cx('pixelplus-steps-step__excerpt')}
                                            style={{ display: 'block' }}
                                        >
                                            <p></p>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                            <div className={cx('name')}>
                                <div className={cx('first-name')}>
                                    <p className={cx('label')}>Full name:</p>
                                    <p>
                                        {order?.firstname} {order?.lastname}
                                    </p>
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
                            {/* <div className={cx('order-date')}>
                                <p className={cx('label')}>Order Date: </p>
                                <p>{date(order?.createdAt)}</p>
                            </div> */}
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
        </Modal>
    );
}

export default ModalDetailOrder;
