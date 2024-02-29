import classNames from 'classnames/bind';
import styles from './ModalDetailReturn.module.scss';
import { formatPrice, priceDiscount } from '~/common';
import { useState, useContext, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
const cx = classNames.bind(styles);
function ModalDetailReturn({ show, handleClose, returnOrder, handleReRender }) {
    console.log(returnOrder);
    const subtotal = useMemo(() => {
        let total = returnOrder?.order?.products?.reduce((cur, acc) => {
            return cur + acc.quantity * acc.product.price;
        }, 0);
        return total;
    });
    console.log(subtotal);
    const discount = useMemo(() => {
        let dis = returnOrder?.order?.products?.reduce((cur, acc) => {
            return cur + acc.quantity * ((acc.product.price * acc.product.discount_id) / 100);
        }, 0);
        return dis;
    });
    const totalSum = useMemo(() => {
        return subtotal - discount + 50000;
    });
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
            <>
                <div className={cx('wrapper')}>
                    <ul className={cx('path')}>
                        <li>
                            <Link to="/user/return">
                                <p>Return</p>
                            </Link>
                        </li>
                        <span> &#62; </span>
                        <li>RT_#2024{returnOrder?.id}</li>
                    </ul>
                    <div className={cx('content')}>
                        <div className={cx('message-status')}>
                            <div className="status">
                                {returnOrder?.status === 1 && (
                                    <p>Drop off the items by {expectedDate(returnOrder.datePickup)}</p>
                                )}
                                {returnOrder?.status === 2 && (
                                    <p>
                                        Item received by us
                                        {/* {expectedDate(returnOrder.createdAt, returnOrder?.shipment)} */}
                                    </p>
                                )}
                                {returnOrder?.status === 3 && <p>Refund sent within a week after we get the items</p>}
                                {returnOrder?.status === 4 && <p>Completed</p>}
                            </div>
                            {/* <div className={cx('handle-btn')}>
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
                            {order?.status === 3 &&
                                (order?.isPay === 1 ? (
                                    <button className={cx('return')} onClick={showModal}>
                                        Cancel Order
                                    </button>
                                ) : (
                                    <button className={cx('return')} onClick={handleReturn}>
                                        Return Product
                                    </button>
                                ))}
                            {order?.status === 1 && <button className={cx('cancel')}>Cancel Order</button>}
                        </div> */}
                        </div>
                        <div className={cx('process-information')}>
                            <div className={cx('left-content')}>
                                <div className={cx('pixelplus-steps-steps')}>
                                    <div className={cx('pixelplus-steps-step', 'active')} data-id="0">
                                        <div className={cx('pixelplus-steps-step__number')}></div>
                                        <div className={cx('pixelplus-steps-step__text')}>
                                            <div className={cx('pixelplus-steps-step__title')}>
                                                <strong>Return started</strong>
                                            </div>
                                            <div
                                                className={cx('pixelplus-steps-step__excerpt')}
                                                style={{ display: 'block' }}
                                            >
                                                <p>{expectedDate(returnOrder?.createdAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {returnOrder?.status === 1 && (
                                        <>
                                            <div className={cx('pixelplus-steps-step', 'active')} data-id="1">
                                                <div className={cx('pixelplus-steps-step__number')}></div>
                                                <div className={cx('pixelplus-steps-step__text')}>
                                                    <div className={cx('pixelplus-steps-step__title')}>
                                                        <strong>Drop off the items</strong>
                                                    </div>
                                                    <div
                                                        className={cx('pixelplus-steps-step__excerpt')}
                                                        style={{ display: 'block' }}
                                                    >
                                                        <p>{expectedDate(returnOrder?.datePickup)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={cx('pixelplus-steps-step')} data-id="2">
                                                <div className={cx('pixelplus-steps-step__number')}></div>
                                                <div className={cx('pixelplus-steps-step__text')}>
                                                    <div className={cx('pixelplus-steps-step__title')}>
                                                        <strong>Items received by us</strong>
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
                                                        <strong>
                                                            Refund sent within a week after we get the items
                                                        </strong>
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
                                    {returnOrder?.status === 2 && (
                                        <>
                                            <div className={cx('pixelplus-steps-step', 'active')} data-id="1">
                                                <div className={cx('pixelplus-steps-step__number')}></div>
                                                <div className={cx('pixelplus-steps-step__text')}>
                                                    <div className={cx('pixelplus-steps-step__title')}>
                                                        <strong>Drop off the items</strong>
                                                    </div>
                                                    <div
                                                        className={cx('pixelplus-steps-step__excerpt')}
                                                        style={{ display: 'block' }}
                                                    >
                                                        <p>{expectedDate(returnOrder?.datePickup)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={cx('pixelplus-steps-step', 'active')} data-id="2">
                                                <div className={cx('pixelplus-steps-step__number')}></div>
                                                <div className={cx('pixelplus-steps-step__text')}>
                                                    <div className={cx('pixelplus-steps-step__title')}>
                                                        <strong>Items received by us</strong>
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
                                                        <strong>
                                                            Refund sent within a week after we get the items
                                                        </strong>
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
                                    {returnOrder?.status === 3 && (
                                        <>
                                            <div className={cx('pixelplus-steps-step', 'active')} data-id="1">
                                                <div className={cx('pixelplus-steps-step__number')}></div>
                                                <div className={cx('pixelplus-steps-step__text')}>
                                                    <div className={cx('pixelplus-steps-step__title')}>
                                                        <strong>Drop off the items</strong>
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
                                                        <strong>Items received by us</strong>
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
                                                        <strong>
                                                            Refund sent within a week after we get the items
                                                        </strong>
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
                                    {returnOrder?.status === 4 && (
                                        <>
                                            <div className={cx('pixelplus-steps-step', 'active')} data-id="1">
                                                <div className={cx('pixelplus-steps-step__number')}></div>
                                                <div className={cx('pixelplus-steps-step__text')}>
                                                    <div className={cx('pixelplus-steps-step__title')}>
                                                        <strong>Drop off the items</strong>
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
                                                        <strong>Completed Refund</strong>
                                                    </div>
                                                    <div
                                                        className={cx('pixelplus-steps-step__excerpt')}
                                                        style={{ display: 'block' }}
                                                    >
                                                        <p>Sorry about proplem about product</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className={cx('name')}>
                                    <div className={cx('first-name')}>
                                        <p className={cx('label')}>Refund method:</p>
                                        <p>Visa ending in 4242</p>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('right-content')}>
                                <div className={cx('order-wrapper')}>
                                    <div className={cx('title-order')}>
                                        <p className={cx('order-code')}>Order #2024{returnOrder?.order?.id}</p>
                                    </div>
                                    <div className={cx('body-order')}>
                                        {returnOrder?.order?.products?.map((prod, index) => {
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
                                                            <p className={cx('cart-item-name')}>
                                                                {prod?.product?.name}
                                                            </p>

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
            </>
        </Modal>
    );
}

export default ModalDetailReturn;
