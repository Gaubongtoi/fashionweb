import { memo, useEffect } from 'react';
import styles from './Product_Item.module.scss';
import classNames from 'classnames/bind';
import { useState, useMemo, useEffec, useContext } from 'react';
import { UserContext } from '~/hooks/UserContext';
import { Link } from 'react-router-dom';
import { formatPrice, priceDiscount } from '~/common';
import { toast } from 'react-toastify';
const cx = classNames.bind(styles);
function Product_Item({ item, index }) {
    const [size, setSize] = useState();
    const [quantity_Order, setQuantity_Order] = useState();
    const state = useContext(UserContext);
    const [sizeProd, setSizeProd] = useState(
        item?.product?.inventory.filter((prod) => {
            return prod.quantity > 0;
        }),
    );
    const size_quantity_select = useMemo(() => {
        // console.log('re-render');
        return item?.product?.inventory?.find((obj) => obj?.size === size)?.quantity;
    }, [size, quantity_Order]);
    useEffect(() => {
        setQuantity_Order(item?.quantity);
        setSize(item.size);
    }, [item]);
    useEffect(() => {
        if (size_quantity_select < quantity_Order) {
            setQuantity_Order(1);
        }
    }, [size]);
    // console.log(size_quantity_select);
    // console.log(item);
    // const avaliableSize = ;
    // console.log(avaliableSize);
    // setSizeProd(avaliableSize);
    // console.log(quantity_Order);
    const modifyQuantity = (click) => {
        let oldCart = state.cart.value;
        let product_selected = oldCart.find((i) => i.id === item.id && i.size === item.size);
        oldCart = oldCart.filter((i) => i.id + i.size !== item.id + item.size);
        let quantityUpdate = item.quantity;
        if (click) {
            setQuantity_Order((prev) => {
                if (prev + 1 > size_quantity_select) {
                    toast.info(`Vượt quá số lượng còn lại trong kho`, {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        // theme: 'light',
                        theme: 'colored',
                    });
                    return prev;
                } else {
                    // quantityUpdate = prev + 1;
                    return prev + 1;
                }
            });
            if (quantityUpdate !== quantity_Order + 1 && quantity_Order < size_quantity_select) {
                quantityUpdate = quantity_Order + 1;
            } else {
                quantityUpdate = size_quantity_select;
            }
        } else {
            if (quantity_Order === 1) {
                setQuantity_Order((prev) => prev);
                quantityUpdate = 1;
            } else if (quantity_Order > 1) {
                setQuantity_Order((pre) => pre - 1);
                // console.log(quantity_Order);
                quantityUpdate = quantity_Order - 1;
            }
        }
        // console.log();
        let newCart = [...oldCart, { ...product_selected, quantity: quantityUpdate }].sort(function (a, b) {
            return a.id * Number(a.size) - b.id * Number(b.size);
            //  lấy id x size để cố định số index trên item component khi thay đổi số lượng sản phẩm
            //  việc thay đổi số lượng làm set lại card bằng toán tử ..., các phầm tử array sẽ thay đổi vị trí
        });
        localStorage.setItem('cart', JSON.stringify(newCart));
        state.cart.setCart(newCart);
        // console.log(state.cart);
    };
    const handleChangeSize = (size) => {
        // Việc không lấy data từ dữ liệu từ localStorage => Mô phỏng lại việc lưu trữ dữ liệu của người dùng được get API từ UserContext
        // Lấy ra value của cart để sử dụng
        let oldCart = state.cart.value;
        // Khi thay đổi size, lập tức setSize lại cho những sản phẩm trong giỏ hàng thành 1 => tránh việc số lượng của sản phẩm không còn
        let quantityUpdate = 1;
        // tìm ra sản phẩm đang select
        // Thẻ find sẽ trả về ngay lập tức giá trị khi mà giá trị đó thoả mãm điều kiện của return
        let product_selected = oldCart.find((i) => i.id === item?.id && i.size === item?.size);
        // Tiến hành lọc ra những sản phẩm không được select
        oldCart = oldCart.filter((i) => i.id + i.size !== item?.id + item?.size);
        // Sau đó lấy những sản phẩm không được select và push thêm (trong trường hợp này là override lại property)
        // 2
        oldCart.push({ ...product_selected, size: size, quantity: quantityUpdate });

        let cart_sort = [...oldCart].sort(function (a, b) {
            return a.id * Number(a.size) - b.id * Number(b.size);
            //  lấy id x size để cố định số index trên item component khi thay đổi số lượng sản phẩm
            //  việc thay đổi số lượng làm set lại card bằng toán tử ..., các phầm tử array sẽ thay đổi vị trí
        });
        localStorage.setItem('cart', JSON.stringify(cart_sort));
        setQuantity_Order(1);
        state.cart.setCart(cart_sort);
    };

    return (
        <div className={cx('product-item')}>
            <div className={cx('product-img')}>
                <div className={cx('product-img-wrapper')}>
                    <img
                        src={`https://shoesshop-6n6z.onrender.com/imgs/${item?.product?.img}`}
                        // alt={prod.name}
                    />
                </div>
            </div>
            <div className={cx('product-content')}>
                <div className={cx('product-infor')}>
                    <p className={cx('product-name')}>
                        <Link to={`/product/${item?.id}`}>{item?.product?.name}</Link>
                    </p>
                    <p className={cx('product-type')}>
                        {item?.product?.type} - {size_quantity_select} Products Left
                    </p>
                    <div className={cx('product-size')}>
                        <select
                            value={size}
                            // onChange={(e) => {
                            //     setSize(e.target.value);
                            // }}
                            onChange={(e) => {
                                let cart = JSON.parse(localStorage.getItem('cart'));

                                // xử lý nếu trùng size với cùng là 1 sản phẩm (giỏ hàng có 2 sản phẩm mã giống nhưng khác size)
                                if (cart.map((i) => i.id + i.size).includes(item?.id + e.target.value)) {
                                    toast.error(
                                        `Sản phẩm ${item?.product?.name} size ${e.target.value} đã tồn tại trong giỏ hàng`,
                                        {
                                            position: 'top-center',
                                        },
                                    );
                                } else {
                                    setSize(e.target.value);
                                    handleChangeSize(e.target.value);
                                }
                            }}
                        >
                            {sizeProd &&
                                sizeProd.length > 0 &&
                                sizeProd.map((s, i) => {
                                    return (
                                        <option key={i} value={s.size}>
                                            {s.size}
                                        </option>
                                    );
                                })}
                        </select>
                    </div>
                </div>
                <div className={cx('price-quantity')}>
                    <div className={cx('price')}>
                        <p className={cx('price-discount')}>
                            {formatPrice(priceDiscount(item?.product?.price, item?.product?.discount_id))}
                            {/* {formatPrice(priceDiscount(item?.product?.price, item?.product?.discount_id))} */}
                        </p>
                        <p className={cx('price-origin')}>
                            {formatPrice(item?.product?.price)}
                            {/* {formatPrice(priceDiscount(item?.product?.price, item?.product?.discount_id))} */}
                        </p>
                    </div>

                    <div className={cx('wrapper-quantity')}>
                        <span className={cx('minus')} onClick={() => modifyQuantity(false)}>
                            -
                        </span>
                        <span className={cx('num')}>{quantity_Order}</span>
                        <span className={cx('plus')} onClick={() => modifyQuantity(true)}>
                            +
                        </span>
                    </div>
                </div>
            </div>
            <span
                className={cx('remove')}
                onClick={() => {
                    let cart = state.cart.value;
                    cart = cart.filter((i) => i.id + i.size !== item.id + item.size);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    state.cart.setCart(cart);
                }}
            >
                &times;
            </span>
        </div>
    );
}
export default memo(Product_Item);
