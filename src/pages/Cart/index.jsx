import styles from './Cart.module.scss';
import classNames from 'classnames/bind';
import { useContext, useEffect, useState, useMemo, memo } from 'react';
import images from '~/assets/images';
import { Link, useNavigate } from 'react-router-dom';
import useDebounce from '~/hooks/useDebounce';
import { UserContext } from '~/hooks/UserContext';
import { formatPrice, priceDiscount } from '~/common';
import { toast } from 'react-toastify';
import ModalComp from '~/components/Modal';
import Product_Item from './Product_Item';
import axios from 'axios';
import Button from '~/components/Button';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import '~/CustomModal.css';
const cx = classNames.bind(styles);

function Cart() {
    const [product, setProduct] = useState([]);
    console.log(product);
    const [display, setDisplay] = useState(false);
    const [city, setCity] = useState('');
    const [shipment, setShipment] = useState('save');
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const navigate = useNavigate();
    // console.log(city);
    const schema = yup
        .object()
        .shape({
            firstname: yup.string().required('Bạn cần nhập trường này'),
            lastname: yup.string().required('Bạn cần nhập trường này'),
            address: yup.string().required('Bạn cần nhập trường này'),
            select: yup.string().required('Bạn cần lựa chọn thành phố'),
        })
        .required();
    // console.log(product);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            // userName: '',
            // email: '',
            // phoneNumber: '',
        },
        resolver: yupResolver(schema),
    });
    const totalProduct = useMemo(() => {
        return product.reduce((acc, cur) => {
            // console.log(cur.quantity);
            return acc + Number(cur?.quantity);
        }, 0);
    }, [product]);

    // console.log(totalProduct);
    // console.log(product);
    const state = useContext(UserContext);
    // console.log(state?.cart?.value);
    useEffect(() => {
        let product_id = state.cart.value.map((i) => i.id);
        const fetchProducts = async () => {
            try {
                const baseUrl = 'http://localhost:3000/product';
                const requests = product_id?.map((id) => axios.get(`${baseUrl}/${id}`));
                const responses = await Promise.all(requests);
                const products = responses.map((response) => response.data);
                let product_cart = state?.cart?.value;
                // console.log(product_cart);
                let a = product_cart?.map((item) => {
                    let prodRating = {
                        ...item,
                        rating: 0,
                    };
                    return {
                        ...prodRating,
                        product: products?.find((i) => i.id == item.id),
                    };
                });
                // console.log('Hello');
                // console.log(products);
                setProduct(a);
                // setProduct(products);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            }
        };

        // Gọi hàm lấy danh sách sản phẩm
        fetchProducts();
        // axios.get(`https://shoesshop-6n6z.onrender.com/shoesList/${product_id}`).then((res) => {
        //     let product_cart = state?.cart?.value;
        //     // console.log(res.data);
        //     let a = product_cart?.map((item) => {
        //         return {
        //             ...item,
        //             product: res.data.find((i) => i.id == item.id),
        //         };
        //     });
        //     setProduct(a);
        //     // console.log(a);
    }, [state.cart.value]);

    const subtotal = useMemo(() => {
        let total = product.reduce((cur, acc) => {
            return cur + acc.quantity * acc.product.price;
        }, 0);
        return total;
    }, [product]);
    const discount = useMemo(() => {
        let dis = product.reduce((cur, acc) => {
            return cur + acc.quantity * ((acc.product.price * acc.product.discount_id) / 100);
        }, 0);
        return dis;
    }, [product]);
    const totalSum = useMemo(() => {
        return subtotal - discount + 50000;
    }, [product]);
    // console.log(discount);
    // console.log(subtotal);
    const handlePay = (data) => {
        // console.log(data);
        // let productRating = [...product];
        let dataPost = {
            client_id: state.cuser.value.id,
            firstname: data.firstname,
            lastname: data.lastname,
            address: data.address,
            city: data.select,
            shipment: shipment,
            status: 1,
            payment: 'cod',
            amount: totalSum,
            isPay: 0,
            products: product,
        };
        // console.log(dataPost);
        axios.post('http://localhost:3000/orders', dataPost).then((res) => {
            localStorage.setItem('cart', JSON.stringify([]));
            // console.log('Dizmemay');
            state.cart.setCart([]);
            setShowModal(false);
            toast.success(`Đặt hàng thành công!!!`, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });
        });
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                <div className={cx('header-title')}>
                    <h1>Cart</h1>
                    <p className="total-product">
                        ( <span>{totalProduct}</span> Products )
                    </p>
                </div>
                <div className={cx('product')}>
                    {product?.map((item, i) => {
                        return <Product_Item item={item} key={i} index={i}></Product_Item>;
                    })}
                </div>
            </div>
            <div className={cx('payment')}>
                <div className={cx('payment-wrapper')}>
                    <div className={cx('payment-display')}>
                        <p className={cx('label')}>Subtotal</p>
                        <p className={cx('price')}>{formatPrice(subtotal)}</p>
                    </div>
                    <div className={cx('payment-display')}>
                        <p className={cx('label')}>Discount</p>
                        <p className={cx('discount-price')}>- {formatPrice(discount)}</p>
                    </div>
                    <div className={cx('payment-display')}>
                        <p className={cx('label')}>Shipping Costs</p>
                        <p className={cx('discount-price')}>+ {formatPrice(50000)}</p>
                    </div>
                    {product && product.length > 0 ? (
                        <Button
                            // className={cx('btn_payment')}

                            onClick={() => handleShow()}
                            payment
                            // onClick={(e) => {
                            //     const user = JSON.parse(localStorage.getItem("tokens"))
                            //     if(!user.status) {
                            //         alert("Hãy đăng nhập để mua hàng")
                            //         navigate("/signin")
                            //     }

                            //     handleSubmit(handleOrder)(e)

                            // }}
                        >
                            Checkout - {formatPrice(totalSum)}
                        </Button>
                    ) : (
                        <Button
                            // className={cx('btn_payment')}
                            onClick={() => handleShow()}
                            payment
                            disabled
                        >
                            Checkout
                        </Button>
                    )}

                    <Link to={`/product?_page=1&_limit=9`}>
                        <button className={cx('btn_continue_shopping')}>Continue Shopping</button>
                    </Link>
                </div>
                <div className={cx('delivery')}>
                    <div className={cx('delivery-wrapper')}>
                        <div className={cx('delivery-promotion')}>
                            <div className={cx('icon-delivery')}>
                                <img src={images.truck} alt="" />
                            </div>
                            <div className={cx('content-delivery-promotion')}>
                                <p className={cx('delivery-title')}>Free Delivery</p>
                                <p className={cx('delivery-sub-title')}>
                                    Enter your Postal code for Delivery Availability
                                </p>
                            </div>
                        </div>

                        <div className={cx('refund-delivery-detail')}>
                            <div className={cx('icon-delivery')}>
                                <img src={images.cart_red} alt="" />
                            </div>
                            <div className={cx('content-delivery-promotion')}>
                                <p className={cx('delivery-title')}>Return Delivery</p>
                                <p className={cx('delivery-sub-title')}>
                                    30 days to return it to us for a refund. We have made returns SO EASY - you can now
                                    return your order to a store or send it with FedEx FOR FREE
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalComp showModal={showModal} handleClose={handleClose}>
                <div className={cx('modal-wrapper')}>
                    <div className={cx('left-modal')}>
                        <div className={cx('left-title')}>
                            <p>Product</p>
                        </div>
                        <div className={cx('product-modal')}>
                            <div className={cx('product-frame')}>
                                {product.map((item, i) => {
                                    return (
                                        <div key={i} className={cx('item-modal')}>
                                            <div className={cx('img-item')}>
                                                <img
                                                    src={`https://shoesshop-6n6z.onrender.com/imgs/${item?.product?.img}`}
                                                    alt=""
                                                />
                                            </div>
                                            <div className={cx('item-infor')}>
                                                <p className={cx('name-prod')}>{item?.product?.name}</p>
                                                <p className={cx('price-prod')}>
                                                    {formatPrice(
                                                        priceDiscount(item?.product?.price, item?.product?.discount_id),
                                                    )}
                                                </p>
                                                <div className={cx('size-quantity-prod')}>
                                                    <div className={cx('size-wrapper')}>
                                                        <p>
                                                            Size: <span>{item?.size}</span>
                                                        </p>
                                                    </div>
                                                    <p>
                                                        x<span>{item?.quantity}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
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
                                <p className={cx('label-modal', 'total')}>Total (include Shipment Fee)</p>
                                <p className={cx('discount-price-modal')}>+ {formatPrice(totalSum)}</p>
                            </div>
                        </div>
                    </div>
                    <div className={cx('right-modal')}>
                        <p className={cx('modal-title')}>Shipping Detail</p>
                        <div className={cx('content-right')}>
                            <div className={cx('customer-name')}>
                                <div className={cx('first-name')}>
                                    <label htmlFor="firstname" className="form-label">
                                        First Name: *
                                    </label>
                                    <input
                                        id="firstname"
                                        name="ho"
                                        type="text"
                                        className="form-control"
                                        {...register('firstname')}
                                    />
                                    {errors.firstname && (
                                        <span className={cx('form-message')}>{errors.firstname.message}</span>
                                    )}
                                </div>
                                <div className={cx('last-name')}>
                                    <label htmlFor="lastname" className="form-label">
                                        Last Name: *
                                    </label>
                                    <input
                                        id="lastname"
                                        name="ten"
                                        type="text"
                                        className="form-control"
                                        {...register('lastname')}
                                    />
                                    {errors.lastname && (
                                        <span className={cx('form-message')}>{errors.lastname.message}</span>
                                    )}
                                </div>
                            </div>
                            <div className={cx('city')}>
                                <label htmlFor="ten" className="form-label">
                                    City: *
                                </label>

                                <select
                                    onChange={(e) => {
                                        // setCity(e.target.value);
                                        setCity(e.target.value);
                                    }}
                                    className={cx('city-dropdown')}
                                    {...register('select')}
                                >
                                    <option value="">---Chọn Thành phố---</option>
                                    <option value="Đà Nẵng">Đà Nẵng</option>
                                    <option value="Quảng Nam">Quảng Nam</option>
                                    <option value="Huế">Huế</option>
                                </select>
                                {errors.select && <span className={cx('form-message')}>{errors.select.message}</span>}
                            </div>
                            <div className={cx('address')}>
                                <label htmlFor="address" className="form-label">
                                    Address: *
                                </label>
                                <input
                                    id="address"
                                    name="address"
                                    type="text"
                                    className="form-control"
                                    {...register('address')}
                                />
                                {errors.address && <span className={cx('form-message')}>{errors.address.message}</span>}
                            </div>
                            {/* <button onClick={() => callAPI()}>Click me!</button> */}
                        </div>
                        <p className={cx('modal-title')}>Shipment Method</p>
                        <ul className={cx('shipment-method')}>
                            <li className={cx('method')}>
                                <input
                                    type="radio"
                                    id="save"
                                    checked={shipment === 'save'}
                                    onChange={() => {
                                        setShipment('save');
                                    }}
                                />
                                <label htmlFor="save">Vận chuyển Tiết kiệm (từ 3 - 5 ngày)</label>
                            </li>
                            <li className={cx('method')}>
                                <input
                                    type="radio"
                                    name=""
                                    id="fast"
                                    checked={shipment === 'fast'}
                                    onChange={() => {
                                        setShipment('fast');
                                    }}
                                />
                                <label htmlFor="fast">Vận chuyển Nhanh (từ 2 - 3 ngày)</label>
                            </li>
                        </ul>
                        <p className={cx('modal-title')}>Payment Method</p>
                        <ul className={cx('payment-method')}>
                            <li className={cx('method')}>
                                <input type="radio" id="cod" defaultChecked />
                                <label htmlFor="cod">COD (Cash On Delivery)</label>
                            </li>
                        </ul>
                        <div className={cx('btn-pay')}>
                            <Button
                                onClick={(e) => {
                                    const user = JSON.parse(localStorage.getItem('user'));
                                    if (!user) {
                                        alert('Hãy đăng nhập để mua hàng');
                                        navigate('/login');
                                    } else {
                                        handleSubmit(handlePay)(e);
                                    }
                                }}
                                primary
                                rounded
                                order
                            >
                                Xác nhận đặt hàng
                            </Button>
                        </div>
                    </div>

                    <button className={cx('modal-close')} onClick={handleClose}>
                        &times;
                    </button>
                </div>
            </ModalComp>
        </div>
    );
}

export default memo(Cart);
