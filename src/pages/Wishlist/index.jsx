import { useContext, useEffect, useState } from 'react';
import styles from './Wishlist.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '~/hooks/UserContext';
import { formatPrice, priceDiscount } from '~/common';
const cx = classNames.bind(styles);
function Wishlist() {
    const state = useContext(UserContext);
    const [wishlist, setWishlist] = useState([]);
    const handleRemoveProduct = (id) => {
        const fetchData = async () => {
            await axios.delete(`http://localhost:3000/wishlist/${id}`);
            state?.render?.setRender((prev) => !prev);
        };
        fetchData();
    };
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`http://localhost:3000/wishlist`, {
                params: {
                    client_id: state?.cuser?.value?.id,
                },
            });
            console.log(response);
            setWishlist(response.data);
        };
        fetchData();
    }, [state?.wishlist?.value, state?.cuser?.value]);
    return (
        <>
            <div className={cx('wrapper')}>
                {wishlist.length > 0 &&
                    wishlist.map((prod, index) => {
                        return (
                            <div key={index} className={cx('item-wrapper')}>
                                <div className={cx('product-img')}>
                                    <div className={cx('product-img-wrapper')}>
                                        <img
                                            src={`https://shoesshop-6n6z.onrender.com/imgs/${prod.product.img}`}
                                            alt={prod.product.name}
                                        />
                                        <img
                                            src={`https://shoesshop-6n6z.onrender.com/imgs/${prod.product.imgs[0]}`}
                                            alt="rear product image"
                                            className={cx('rear-img')}
                                        />
                                    </div>
                                </div>
                                <div className={cx('content')}>
                                    {/* <p className={cx('name')}>{prod.name}</p> */}
                                    <Link
                                        to={`/product/${prod.product.id}`}
                                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    >
                                        <p className={cx('name')}>{prod.product.name}</p>
                                    </Link>
                                    <p className={cx('price')}>
                                        {formatPrice(priceDiscount(prod.product.price, prod.product.discount_id))}
                                    </p>
                                    <p className={cx('old-price')}>{formatPrice(prod.product.price)}</p>
                                </div>
                                <div className={cx('loved')} onClick={() => handleRemoveProduct(prod.id)}>
                                    <span className={cx('delete')}>&times;</span>
                                </div>
                            </div>
                        );
                    })}
            </div>
            {wishlist.length === 0 && (
                <div className={cx('notification')}>
                    {/* <h1>Xin chao</h1> */}
                    <p>Không có sản phẩm yêu thích</p>
                </div>
            )}
        </>
    );
}

export default Wishlist;
