import { useEffect, useState, useRef, useMemo, useCallback, useContext } from 'react';
import { StoreContext } from '~/components/PageLoading/store';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import axios from 'axios';

import styles from './DetailProduct.module.scss';
import { formatPrice, priceDiscount } from '~/common';
import images from '~/assets/images';
import Button from '~/components/Button';
import Carousel from '~/components/Carousel/Carousel_Detail_Product';
import Slider from '~/components/Carousel/Slider';
import { setLoading } from '~/components/PageLoading/store/action';
import { actions } from '~/components/PageLoading/store';

// Constance
const cx = classNames.bind(styles);

function DetailProduct() {
    const tabs = ['Description', 'Reviews'];
    const benefits = [
        'Durable leather is easily cleanable so you can keep your look fresh.',
        'Water-repellent finish and internal membrane help keep your feet dry.',
        'Toe piece with star pattern adds durability.',
        'Synthetic insulation helps keep you warm.',
        'Originally designed for performance hoops, the Air unit delivers lightweight cushioning.',
        'Plush tongue wraps over the ankle to help keep out the moisture and cold.',
    ];
    const details = [
        'Not intended for use as Personal Protective Equipment (PPE)',
        'Water-repellent finish and internal membrane help keep your feet dry.',
        'Lunarlon midsole delivers ultra-plush responsiveness',
        'Encapsulated Air-Sole heel unit for lightweight cushioning',
        'Colour Shown: Ale Brown/Black/Goldtone/Ale Brown',
        'Style: 805899-202',
    ];

    const [isLoading, dispatch] = useContext(StoreContext);
    // console.log(isLoading);
    const [type, setType] = useState('Description');
    const [product, setProduct] = useState({});
    const [image, setImage] = useState([]);
    const [size, setSize] = useState([]);
    const [checked, setChecked] = useState('');
    const [quantity_Order, setQuantity_Order] = useState(1);
    const [size_Order, setSize_Order] = useState('');
    // useParam: lấy được param được route bên thẻ App.js (được nhận biết bằng dấu : ở trước param)
    // => {id: ...}
    const param = useParams();
    console.log(product);
    // Fake API: Sử dụng json-server => custom lại data trả về
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/product/${param.id}`);
                setProduct(res.data);
                setImage(res?.data?.imgs);
                const sizes = res.data.inventory.reduce((total, currentValue) => {
                    total.push(currentValue.size);
                    return total;
                }, []);
                setSize(sizes);
                setQuantity_Order(1);
                dispatch(actions.setLoading(false));
            } catch (err) {
                // Cập nhật trạng thái loading thành false nếu xảy ra lỗi
            }
        };
        dispatch(actions.setLoading(true));
        setTimeout(async () => {
            await fetchData();
        }, 5000);
    }, [param]);
    const size_quantity_select = product?.inventory?.find((obj) => obj?.size === size_Order)?.quantity;
    console.log(size_quantity_select);
    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('product-first')}>
                    <Carousel images={image} product={product} reset={param}></Carousel>
                    <div className={cx('product-option')}>
                        <ul className={cx('path')}>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <span> &#62; </span>
                            <li>
                                <Link to="/product">Products</Link>
                            </li>
                            <span> &#62; </span>
                            <li>
                                <Link to="#">{product?.type}</Link>
                            </li>
                            <span> &#62; </span>
                            <li>
                                <a href="#">
                                    <strong>{product?.name}</strong>
                                </a>
                            </li>
                        </ul>
                        <div className={cx('product-header')}>
                            <div className={cx('product-title')}>
                                <p>{product?.name}</p>
                                <span>Mã sản phẩm: {product?.id}</span>
                            </div>
                        </div>
                        <div className={cx('product-price-assess')}>
                            <div className={cx('product-price-assess-wrapper')}>
                                <div className={cx('price-wrapper')}>
                                    <p className={cx('price')}>
                                        {'$' + formatPrice(priceDiscount(product?.price, product?.discount_id))}
                                    </p>
                                    <p className={cx('price-old')}>{'$' + formatPrice(product?.price)}</p>
                                </div>
                                <div className={cx('assess-wrapper')}>
                                    <div className={cx('star-reviews')}>
                                        <div className={cx('star')}>
                                            <img src={images.star} alt="" />
                                            <span>4.8</span>
                                        </div>
                                        <div className={cx('previews')}>
                                            <img src={images.reviews} alt="" />
                                            <span>67 Reviews</span>
                                        </div>
                                        <div className={cx('heart')}>
                                            <img src={images.heart} alt="" />
                                            <span>109</span>
                                        </div>
                                    </div>
                                    <div className={cx('ratio-wrapper')}>
                                        <p>
                                            <span>93%</span> of buyers have recommended this
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={cx('product-size')}>
                            <div className={cx('product-size-wrapper')}>
                                <p>Choose a Size</p>

                                {size.map((size, index) => {
                                    return (
                                        <label className={cx('size')} key={index}>
                                            <input
                                                type="radio"
                                                name="radio"
                                                // type="radio"
                                                // value={}
                                                checked={checked === size} //logic neu nhu checked === "size" thi no se check
                                                onChange={() => setChecked(size)}
                                            />
                                            <span>{size}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                        <div className={cx('quantity_product')}>
                            {/* <p className={cx('quantity')}>Số Lượng: </p> */}
                            <div className={cx('wrapper-quantity')}>
                                <span
                                    className={cx('minus')}
                                    onClick={() => setQuantity_Order((prev) => (prev === 1 ? prev : prev - 1))}
                                >
                                    -
                                </span>
                                <span className={cx('num')}>{quantity_Order}</span>
                                <span className={cx('plus')} onClick={() => setQuantity_Order((prev) => prev + 1)}>
                                    +
                                </span>
                            </div>
                            <Button
                                primary
                                rounded
                                shopping
                                leftIcon={<img className={cx('shopping-img')} src={images.shopping} />}
                            >
                                Add to Cart!
                            </Button>
                            {/* <img className={cx('cart-img')} src={images.cart} alt="logo-cart" /> */}
                            {/* <p className={cx("mess_quantity_prod")}>{size_quantiry_select < quantity_Order ? `Size của sản phẩm này không đủ số lượng mà bạn cần. Hiện có ${product?.inventory?.find(i => i.size === size_Order).quantity} sản phẩm` : ""}</p> */}
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
                                            Free 30 days Delivery Return. Details
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('product-second')}>
                    <div className={cx('info-container')}>
                        <ul className={cx('product-info-menu')}>
                            {tabs.map((tab, i) => {
                                return (
                                    <li
                                        style={
                                            type === tab
                                                ? {
                                                      color: '#AB8A37',
                                                      //   backgroundColor: '#333',
                                                  }
                                                : {}
                                        }
                                        key={i}
                                        className={cx('p-info-list')}
                                        onClick={() => setType(tab)}
                                    >
                                        {tab}
                                    </li>
                                );
                            })}
                        </ul>
                        {type === 'Description' && tabs ? (
                            <>
                                <div id="desc" className={cx('infor-container-description')}>
                                    <h1>Product Description</h1>
                                    <p>{product.description}</p>
                                </div>
                                <div className={cx('infor-container-description')}>
                                    <h1>Benefits</h1>
                                    <ul className={cx('list-benefit')}>
                                        {benefits.map((benefit, i) => {
                                            return (
                                                <div key={i} className={cx('benefit')}>
                                                    <img src={images.check_icon} alt="" />
                                                    <li className={cx('benefit-line')}>{benefit}</li>
                                                </div>
                                            );
                                        })}
                                    </ul>

                                    {/* <p>{product.description}</p> */}
                                </div>
                                <div className={cx('infor-container-description')}>
                                    <h1>Product Details</h1>
                                    <ul className={cx('list-benefit')}>
                                        {details.map((details, i) => {
                                            return (
                                                <div key={i} className={cx('benefit')}>
                                                    <img src={images.check_icon} alt="" />
                                                    <li className={cx('benefit-line')}>{details}</li>
                                                </div>
                                            );
                                        })}
                                    </ul>

                                    {/* <p>{product.description}</p> */}
                                </div>
                            </>
                        ) : (
                            <>
                                <div></div>
                            </>
                        )}

                        <div className={cx('infor-container-description')}>
                            <h1>Also You Like</h1>
                            <Slider param={param}></Slider>
                        </div>
                    </div>
                </div>
                <div className={cx('product-third')}></div>
            </div>
        </>
    );
}

export default DetailProduct;
