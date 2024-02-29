import classNames from 'classnames/bind';
import styles from './ModalDetailProduct.module.scss';
import { faClose, faCross, faCloudArrowUp, faFileImage, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
const cx = classNames.bind(styles);
function ModalDetailProduct({ show, handleClose, prodID, handleReRender }) {
    console.log(prodID);
    const [product, setProduct] = useState();
    const [isFormDirty, setIsFormDirty] = useState(false);
    const [inventory, setInventory] = useState([]);
    const [updateInventory, setUpdateInventory] = useState([]);
    const [isLoading, dispatch] = useContext(StoreContext);
    const [render, setRender] = useState(false);
    const handleKeyDownSize = (e) => {
        const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace'];
        const key = e.key;
        if (!allowedKeys.includes(key)) {
            e.preventDefault();
        }
    };
    useEffect(() => {
        axios
            .get(`http://localhost:3000/product/${prodID}`)
            .then((res) => {
                setProduct(res.data);
            })
            .catch((err) => console.log(err));
    }, [prodID, render]);
    const schema = yup
        .object()
        .shape({
            name: yup.string().required('Bạn cần nhập trường này'),
            brand_id: yup.string().required('Bạn cần lựa chọn Thương hiệu'),
            type: yup.string().required('Bạn cần lựa chọn Loại giày'),
            // brand: yup.string().required('Bạn cần lựa chọn thành phố'),
            discount_id: yup.string().required('Trường này là bắt buộc'),
            price: yup.string().required('Trường này là bắt buộc'),
            description: yup.string().required('Trường này là bắt buộc'),
        })
        .required();
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, dirtyFields },
    } = useForm({
        resolver: yupResolver(schema),
    });
    // const defaultValues = {
    //     name: product?.name,
    //     brand_id: product?.brand_id,
    //     type: product?.type,
    //     discount_id: product?.discount_id,
    //     price: product?.price,
    //     description: product?.description,
    // };
    useEffect(() => {
        const defaultValues = {
            name: product?.name,
            brand_id: product?.brand_id,
            type: product?.type,
            discount_id: product?.discount_id,
            price: product?.price,
            description: product?.description,
        };
        reset(defaultValues);
    }, [product, reset]);
    useEffect(() => {
        setInventory(
            product?.inventory?.map((item, index) => {
                return {
                    size: item?.size,
                    quantity: item?.quantity,
                };
            }),
        );
        setUpdateInventory(
            product?.inventory?.map((item, index) => {
                return {
                    size: item?.size,
                    quantity: item?.quantity,
                };
            }),
        );
    }, [product]);
    // const [currentValues, setCurrentValues] = useState(defaultValues);
    // console.log(currentValues);

    // const currentValues = {
    //     name: watch('name', defaultValues.name),
    //     productId: watch('productId', defaultValues.productId),
    //     type: watch('type', defaultValues.type),
    //     discount: watch('discount', defaultValues.discount),
    //     price: watch('price', defaultValues.price),
    //     description: watch('description', defaultValues.description),
    // };
    const formValues = watch();
    useEffect(() => {
        if (formValues) {
            // Kiểm tra xem có bất kỳ trường nào đã thay đổi (dirty) hay không
            const isFormChanged = Object.keys(dirtyFields).some((fieldName) => {
                return formValues[fieldName] != product[fieldName];
            });
            if (isFormChanged === false && JSON.stringify(inventory) === JSON.stringify(updateInventory)) {
                console.log('Form changed: false');
                setIsFormDirty(false);
            } else {
                console.log('Form changed: true');
                setIsFormDirty(true);
            }
        }
    }, [formValues, product, dirtyFields]);
    const checkIsDirty = (e, item, index) => {
        setUpdateInventory((prev) => {
            let newArr = [...prev];
            newArr[index] = {
                ...newArr[index],
                quantity: Number(e.target.value),
            };
            return newArr;
        });
    };
    console.log(updateInventory);

    // console.log('re-render');
    // console.log(defaultValues);
    // console.log(currentValues);
    // useEffect(() => {
    //     const isDirty = Object.keys(dirtyFields).some(
    //         (fieldName) => currentValues[fieldName] !== defaultValues[fieldName],
    //     );
    //     setIsFormDirty(isDirty);
    // }, [dirtyFields, currentValues, defaultValues]);
    const onSubmit = async (data) => {
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const infor = {
            ...product,
            name: data.name,
            brand_id: data.brand_id || 'ADIDAS',
            price: +data.price,
            description: data.description,
            type: data.type,
            discount_id: +data.discount_id,
            inventory: updateInventory,
            // BC_color: 'color_4',
        };
        // console.log(JSON.stringify(infor));
        try {
            dispatch(actions.setLoading(true));
            await delay(2000); // Chờ 2 giây
            const res = await axios.put(`http://localhost:3000/product/${product?.id}`, infor);
            handleReRender();
            setRender((prev) => !prev);
            toast.success('Chỉnh sửa thông tin thành công', {
                // autoClose: 2000,
                theme: 'colored',
                position: 'top-right',
                autoClose: 3000,
            });
            // console.log(res);
        } catch (error) {
            console.log(error);
            toast.error('Chỉnh sửa thông tin thất bại', {
                // autoClose: 2000,
                theme: 'colored',
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            dispatch(actions.setLoading(false)); // Kết thúc hiển thị trạng thái loading
        }
        console.log(infor);
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
                    width: '90%',
                    height: '90%',
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
                <p className={cx('title')}>PRODUCT INFORMATION</p>
                <div className={cx('wrapper_modal')}>
                    <div className={cx('wrapper-left-side')}>
                        {/* <Carousel images={product?.imgs} product={product}></Carousel> */}
                        {/* <input
                            type="file"
                            // onChange={handlePreviewImg_main}
                            id="file"
                            className={cx('add_imgSub_btn-off')}
                        /> */}
                        <div className={cx(['product_img'])}>
                            <label className={cx(['add_btn-on', 'img_main__add'])} htmlFor="file">
                                <FontAwesomeIcon icon={faFileImage} />
                            </label>
                            <div className={cx('img-wrapper')}>
                                <img
                                    className={cx('img')}
                                    src={`https://shoesshop-6n6z.onrender.com/imgs/${product?.img}`}
                                />
                            </div>
                        </div>
                        <div className={cx('product_img--sub')}>
                            {product?.imgs?.map((item, index) => {
                                return (
                                    <div className={cx('img_sub')} key={index}>
                                        <img src={`https://shoesshop-6n6z.onrender.com/imgs/${item}`} />
                                    </div>
                                );
                            })}
                            <div className={cx('img_sub')}>
                                <label className={cx(['add_btn-on', 'img_sub__add'])} htmlFor="file2">
                                    <FontAwesomeIcon icon={faSquarePlus} size="4x" />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className={cx('wrapper-right-side')}>
                        <div className={cx('input_product')}>
                            <label className={cx('label-product')}>Brands: </label>
                            <select {...register('brand_id')}>
                                {
                                    // atri_prod?.brands?.map(i => <option key={i.brand_id} value={i.brand_id}>{i.brand_id}</option>)
                                }
                                {/* <option value="">---Chọn Thương Hiệu---</option> */}
                                <option value="ADIDAS" selected={product?.brand_id === 'ADIDAS'}>
                                    ADIDAS
                                </option>
                                <option value="CONVERSE" selected={product?.brand_id === 'CONVERSE'}>
                                    CONVERSE
                                </option>
                                <option value="NIKE" selected={product?.brand_id === 'NIKE'}>
                                    NIKE
                                </option>
                                <option value="PUMA" selected={product?.brand_id === 'PUMA'}>
                                    PUMA
                                </option>
                                <option value="VANS" selected={product?.brand_id === 'VANS'}>
                                    VANS
                                </option>
                            </select>
                            {errors.productId && <p className={cx('form-message')}>{errors.brand_id.message}</p>}
                        </div>
                        <div className={cx('input_product')}>
                            <label className={cx('label-product')}>Types: </label>
                            <select {...register('type')}>
                                {/* <option value="">---Chọn Loại Giày---</option> */}
                                <option value="Sneaker" selected={product?.brand_id === 'Sneaker'}>
                                    Sneaker
                                </option>
                                <option value="Boot" selected={product?.brand_id === 'Boot'}>
                                    Boot
                                </option>
                                <option value="Sandal" selected={product?.brand_id === 'Sandal'}>
                                    Sandal
                                </option>
                                <option value="Dep" selected={product?.brand_id === 'Dep'}>
                                    Dép
                                </option>
                            </select>
                            {errors.type && <p className={cx('form-message')}>{errors.type.message}</p>}
                        </div>
                        <div className={cx('input_product')}>
                            <label className={cx('label-product')}>name: </label>
                            <input defaultValue={product?.name} {...register('name')} />
                            {errors.name && <p className={cx('form-message')}>{errors.name.message}</p>}
                        </div>
                        <div className={cx('input_product')}>
                            <label className={cx('label-product')}>price (VND): </label>
                            <input
                                defaultValue={Number(product?.price)}
                                // onChange={(e) => {
                                //     setPrice(e.target.value);
                                //     console.log(price);
                                // }}
                                onKeyDown={handleKeyDownSize}
                                {...register('price')}
                            />
                            {errors.price && <span className={cx('form-message')}>{errors.price.message}</span>}
                        </div>
                        <div className={cx('input_product')}>
                            <label className={cx('label-product')}>discount (%): </label>
                            <input
                                defaultValue={Number(product?.discount_id)}
                                // onChange={(e) => {
                                //     setPrice(e.target.defaultValue);
                                //     console.log(price);
                                // }}
                                onKeyDown={handleKeyDownSize}
                                {...register('discount_id')}
                            />
                            {errors.discount_id && (
                                <span className={cx('form-message')}>{errors.discount_id.message}</span>
                            )}
                        </div>
                        <div className={cx('input_product')}>
                            <label className={cx('label-product')}>size: </label>
                            <div className={cx('size-wrapper')}>
                                {product?.inventory?.map((item, i) => {
                                    // console.log(item?.size + ':' + item?.quantity);
                                    return (
                                        <div key={i} className={cx('size-section')}>
                                            {item?.size}
                                            {/* console.log(item?.); */}
                                            <input
                                                placeholder="0"
                                                id="quantity"
                                                defaultValue={Number(item?.quantity)}
                                                pattern="[0-9]*"
                                                type="numeric"
                                                // type="text"
                                                onChange={(e) => {
                                                    // console.log('Change');
                                                    checkIsDirty(e, item, i);
                                                }}
                                                // onKeyDown={handleKeyDownSize}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                            {/* {
                errors.name && <span className={cx('message_err')}>không được bỏ trống mục này</span>
            } */}
                        </div>
                        <div className={cx('input_product')}>
                            <label style={{ display: 'block' }} className={cx('label-product')}>
                                Description:{' '}
                            </label>
                            <textarea
                                className={cx('input_textarea')}
                                defaultValue={product?.description}
                                {...register('description')}
                                // {...register("description", { required: true })}
                            ></textarea>
                            {errors.description && (
                                <span className={cx('form-message')}>{errors.description.message}</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className={cx('btn-change')}>
                    {isFormDirty === true ? (
                        <>
                            {/* <button className="hello" onClick={() => setEdit((prev) => !prev)}>
                                Cancel
                            </button> */}
                            <Button
                                primary
                                // onClick={(e) => {
                                //     handleSubmit(onSubmit)(e);
                                // }}
                                type="submit"
                                onClick={(e) => {
                                    // console.log('Hello');
                                    handleSubmit(onSubmit)(e);
                                }}
                            >
                                Change
                            </Button>
                        </>
                    ) : (
                        <>
                            {/* <button onClick={() => setEdit((prev) => !prev)}>Cancel</button> */}
                            <Button primary disabled>
                                Change
                            </Button>
                        </>
                    )}
                </div>

                {/* <button
                    onClick={(e) => {
                        handleSubmit(onSubmit)(e);
                    }}
                >
                    Click me!
                </button> */}
                <button onClick={handleClose} className={cx('close_btn')}>
                    &times;
                </button>
            </div>
        </Modal>
    );
}

export default ModalDetailProduct;

// function UserOrder(userID) {
//     console.log(userID);
//     const pagName = ['All', 'Confirmating', 'Delivering', 'Completed', 'Canceled'];
//     const [pagCurr, setPagCurr] = useState(0);
//     const state = useContext(UserContext);
//     const [orders, setOrders] = useState([]);
//     // console.log();
//     let [deliAmount, setDeliAmount] = useState();
//     useEffect(() => {
//         // Get ra được tất cả những dữ liệu đơn hàng
//         axios.get('http://localhost:3000' + `/orders?client_id=${userID.userID}`).then((res) => {
//             console.log(res);
//             // Sau đó đảo lộn response từ dưới đầu lên trên
//             let orderUser = [...res.data].reverse();
//             // Kiểm tra trang hiện tại là ở đâu
//             // Nếu là ở trang 1 - Tất cả
//             // => Lọc ra toàn bộ những phần tử con mà có status đơn hàng là 1
//             if (pagCurr === 1) {
//                 orderUser = orderUser.filter((i) => i.status === 1);
//             } else if (pagCurr === 2) {
//                 orderUser = orderUser.filter((i) => i.status === 2);
//             } else if (pagCurr === 3) {
//                 orderUser = orderUser.filter((i) => i.status === 3);
//             } else if (pagCurr === 4) {
//                 orderUser = orderUser.filter((i) => i.status === 4);
//             }
//             setOrders(orderUser);
//             setDeliAmount(res.data.filter((i) => i.status === 2).length);
//         });
//     }, [pagCurr]);
//     return (
//         <div className={cx('wrapper-order')}>
//             <ul className={cx('navigate')}>
//                 {pagName.map((item, index) => (
//                     <li
//                         key={item}
//                         className={cx({ li_active: index === pagCurr })}
//                         onClick={() => {
//                             setPagCurr(index);
//                         }}
//                     >
//                         {item} {index === 2 && <span>({deliAmount})</span>}
//                     </li>
//                 ))}
//             </ul>
//             <div className={cx('table')}>
//                 {orders.length === 0 ? (
//                     <div className={cx('order-empty')}>
//                         <img src={images.emptyCart} />
//                         <p>Tài khoản này chưa có sản phẩm nào!!!</p>
//                     </div>
//                 ) : (
//                     <Orders orders={orders} userID={userID} />
//                 )}
//             </div>
//         </div>
//     );
// }

// function Orders({ orders, userID }) {
//     const navigator = useNavigate();
//     const handleChangePage = (id) => {
//         navigator(`/user/order/detail/${id}`);
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     };
//     const state = useContext(UserContext);
//     // console.log();
//     // console.log();
//     const expectedDate = (day, shipment) => {
//         // const splitD = d.split('/');
//         // const D = 1706322872160;
//         const currentDate = new Date(day);
//         const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

//         if (shipment === 'save') {
//             currentDate.setDate(currentDate.getDate() + 5);
//         } else if (shipment === 'fast') {
//             currentDate.setDate(currentDate.getDate() + 3);
//         }
//         // console.log(typeof currentDate);
//         // console.log(currentDate.);
//         let date = currentDate.getDate();
//         let month = currentDate.getMonth();
//         const monthAbbreviation = monthNames[month];

//         let year = currentDate.getFullYear();
//         return `${date} ${monthAbbreviation}, ${year}`;
//         // return currentDate;
//         // const dv = new Date(`${splitD[2]}-${splitD[1]}-${splitD[0]}`);
//         // console.log(dv);

//         // let expecDay = new Date(dv);
//         // expecDay.setDate(dv.getDate() + 3);

//         // expecDay = expecDay.toLocaleDateString().split('/');

//         // return `${expecDay[1]}/${expecDay[0]}/${expecDay[2]}`;
//     };
//     // console.log(expectedDate());
//     return (
//         <>
//             {orders.map((order, i) => {
//                 // console.log(order);

//                 return (
//                     <div className={cx('order')} key={i}>
//                         <div className={cx('header-bill')}>
//                             <ul className={cx('title-bill')}>
//                                 <li>
//                                     <div className={cx('status')}>
//                                         <p className={cx('row-title')}>Status</p>
//                                         {order.status === 1 && <p>Confirmating</p>}
//                                         {order.status === 2 && <p>Delivering</p>}
//                                         {order.status === 3 && <p>Completed</p>}
//                                         {order.status === 4 && <p>Canceled</p>}
//                                     </div>
//                                 </li>
//                                 <li>
//                                     <div className={cx('order-id')}>
//                                         <p className={cx('row-title')}>Order ID</p>
//                                         <p>#2024{order.id}</p>
//                                     </div>
//                                 </li>
//                                 <li>
//                                     <div className={cx('total')}>
//                                         <p className={cx('row-title')}>Total</p>
//                                         <p>{formatPrice(order.amount)}</p>
//                                     </div>
//                                 </li>
//                                 <li>
//                                     <div className={cx('detail')}>
//                                         <button
//                                             onClick={() => {
//                                                 if (state?.cuser?.value?.id === userID.userID) {
//                                                     handleChangePage(order.id);
//                                                 }
//                                             }}
//                                         >
//                                             See Detail
//                                         </button>
//                                     </div>
//                                 </li>
//                             </ul>
//                         </div>
//                         <div className={cx('body-bill')}>
//                             <div className={cx('message-status')}>
//                                 {order.status === 1 && <p>Please Waiting Confirm Your Order</p>}
//                                 {order.status === 2 && (
//                                     <p>Estimated delivery: {expectedDate(order.createdAt, order?.shipment)}</p>
//                                 )}
//                                 {order.status === 3 && <p>Delivered</p>}
//                                 {order.status === 4 && <p>Cancellation requested</p>}
//                             </div>
//                             {order.products.map((prod, index) => {
//                                 return (
//                                     <div className={cx('product')} key={index}>
//                                         <div className={cx('product-img')}>
//                                             <div className={cx('product-img-wrapper')}>
//                                                 <img
//                                                     src={`https://shoesshop-6n6z.onrender.com/imgs/${prod?.product?.img}`}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className={cx('cart-item-infor')}>
//                                             <div className={cx('left-infor')}>
//                                                 <p className={cx('cart-item-name')}>{prod?.product?.name}</p>

//                                                 <div className={cx('cart-item-quantity')}>
//                                                     <p>
//                                                         {/* Size: <span>{prod?.size}</span> */}
//                                                         Size: <span>{prod?.size}</span>
//                                                     </p>
//                                                     <p>
//                                                         {/* x<span>{prod?.quantity}</span> */}x
//                                                         <span>{prod?.quantity}</span>
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                             <div className={cx('right-infor')}>
//                                                 <span className={cx('cart-item-price')}>
//                                                     {formatPrice(
//                                                         priceDiscount(prod?.product?.price, prod?.product?.discount_id),
//                                                     )}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </div>
//                 );
//             })}
//         </>
//     );
// }
