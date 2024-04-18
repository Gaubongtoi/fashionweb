import classNames from 'classnames/bind';
import styles from './ModalRating.module.scss';
import { StoreContext } from '~/components/PageLoading/store';
import { actions } from '~/components/PageLoading/store';
import { useState, useContext, useEffect } from 'react';
import { UserContext } from '~/hooks/UserContext';
import axios from 'axios';
import Modal from 'react-modal';
import { formatPrice, priceDiscount } from '~/common';
import { useNavigate } from 'react-router-dom';
import images from '~/assets/images';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from '~/components/Button';
import { toast } from 'react-toastify';
// Rating Component
import { FaStar } from 'react-icons/fa';
const cx = classNames.bind(styles);
function ModalRating({ show, handleClose, orderId, handleReRender }) {
    const [order, setOrder] = useState();
    const [render, setRender] = useState(false);
    const navigator = useNavigate();
    const handleChangePage = (id) => {
        navigator(`/user/order/detail/${orderId}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const handleReRenderModal = (render) => {
        setRender(render);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/orders/${orderId}`);
                setOrder(response.data);
            } catch (error) {}
        };
        fetchData();
    }, [orderId, render]);
    const expectedDate = (day, shipment) => {
        const currentDate = new Date(day);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        if (shipment === 'save') {
            currentDate.setDate(currentDate.getDate() + 5);
        } else if (shipment === 'fast') {
            currentDate.setDate(currentDate.getDate() + 3);
        }
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
                    zIndex: '10',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                content: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    right: '40px',
                    bottom: '40px',
                    border: '1px solid #ccc',
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
                <p className={cx('title')}>RATINGS YOUR ORDER #2024{orderId}</p>
                <div className={cx('wrapper_modal')}>
                    <div className={cx('header-bill')}>
                        <ul className={cx('title-bill')}>
                            <li>
                                <div className={cx('status')}>
                                    <p className={cx('row-title')}>Status</p>
                                    {order?.status === 1 && <p>Confirmating</p>}
                                    {order?.status === 2 && <p>Delivering</p>}
                                    {order?.status === 3 && <p>Completed</p>}
                                    {order?.status === 4 && <p>Canceled</p>}
                                </div>
                            </li>
                            <li>
                                <div className={cx('order-id')}>
                                    <p className={cx('row-title')}>Order ID</p>
                                    <p>#2024{orderId}</p>
                                </div>
                            </li>
                            <li>
                                <div className={cx('total')}>
                                    <p className={cx('row-title')}>Total</p>
                                    <p>{formatPrice(order?.amount)}</p>
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
                        {/* <div className={cx('message-status')}>
                            {order?.status === 1 && <p>Please Waiting Confirm Your Order</p>}
                            {order?.status === 2 && (
                                <p>Estimated delivery: {expectedDate(order.createdAt, order?.shipment)}</p>
                            )}
                            {order?.status === 3 && <p>Delivered</p>}
                            {order?.status === 4 && <p>Cancellation requested</p>}
                        </div> */}
                        {order?.products.map((prod, index) => {
                            return (
                                <Rating product={prod} key={index} order={order} render={handleReRenderModal}></Rating>
                            );
                        })}
                    </div>
                </div>
                <button onClick={handleClose} className={cx('close_btn')}>
                    &times;
                </button>
            </div>
        </Modal>
    );
}

export default ModalRating;

function Rating({ product, key, order, render }) {
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(null);
    const [comment, setComment] = useState('');
    const state = useContext(UserContext);
    // console.log(product);
    const handleSubmit = () => {
        // console.log(newData);

        const fetchDataToOrder = async () => {
            let newProducts = order?.products?.map((prod, index) => {
                let prodRating = prod;
                if (prod.id === product.id) {
                    prodRating = {
                        ...prod,
                        rating: rating,
                    };
                }
                return prodRating;
            });
            let newData = {
                ...order,
                products: newProducts,
            };
            await axios.put(`http://localhost:3000/orders/${order?.id}`, newData);
            render((prev) => !prev);
        };
        const fetchDataToReviews = async () => {
            let dataPost = {
                order_id: order?.id,
                client_name: state?.cuser?.value?.name,
                rating: rating,
                comment: comment,
                product: {
                    id: product?.id,
                    name: product?.product?.name,
                    size: product?.size,
                },
            };
            await axios.post(`http://localhost:3000/reviews`, dataPost);
        };
        try {
            fetchDataToOrder();
            fetchDataToReviews();
            toast.success('Thành công');
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className={cx('wrapper-rating')}>
            <div className={cx('product')} key={key}>
                <div className={cx('product-img')}>
                    <div className={cx('product-img-wrapper')}>
                        <img src={`https://shoesshop-6n6z.onrender.com/imgs/${product?.product?.img}`} />
                    </div>
                </div>
                <div className={cx('cart-item-infor')}>
                    <div className={cx('left-infor')}>
                        <p className={cx('cart-item-name')}>{product?.product?.name}</p>

                        <div className={cx('cart-item-quantity')}>
                            <p>
                                Size: <span>{product?.size}</span>
                            </p>
                            <p>
                                x<span>{product?.quantity}</span>
                            </p>
                        </div>
                    </div>
                    <div className={cx('right-infor')}>
                        <span className={cx('cart-item-price')}>
                            {formatPrice(priceDiscount(product?.product?.price, product?.product?.discount_id))}
                        </span>
                    </div>
                </div>
            </div>
            {product?.rating === 0 ? (
                <div className={cx('rating')}>
                    <div className={cx('star')}>
                        {[
                            [...Array(5)].map((star, index) => {
                                const currentRating = index + 1;
                                return (
                                    <label>
                                        <input
                                            type="radio"
                                            name="rating"
                                            value={currentRating}
                                            onClick={() => setRating(currentRating)}
                                        />
                                        <FaStar
                                            className={cx('star-click')}
                                            size={30}
                                            color={currentRating <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
                                            onMouseEnter={() => setHover(currentRating)}
                                            onMouseLeave={() => setHover(null)}
                                        ></FaStar>
                                    </label>
                                );
                            }),
                        ]}
                    </div>
                    <div className={cx('comment')}>
                        <textarea
                            className={cx('input_textarea')}
                            // defaultValue={product?.description}
                            placeholder="Please Comment!"
                            onChange={(e) => setComment(e.target.value)}
                            // {...register("description", { required: true })}
                        ></textarea>
                    </div>
                    <div className={cx('btn-rating')}>
                        <Button primary onClick={handleSubmit}>
                            Rating your Order!
                        </Button>
                    </div>
                </div>
            ) : (
                <div className={cx('success-notification')}>
                    <p>
                        Thank you for taking the time to review our product. Your feedback is greatly appreciated and
                        helps us improve our offerings to better serve you and others like you.
                    </p>
                </div>
            )}
        </div>
    );
}
