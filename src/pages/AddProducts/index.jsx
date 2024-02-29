import classNames from 'classnames/bind';
import styles from './AddProducts.module.scss';
import { toast } from 'react-toastify';
import { faClose, faCross, faCloudArrowUp, faFileImage, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import * as yup from 'yup';
import { Button, Modal } from 'antd';
// import AddBoxIcon from '@mui/icons-material/AddBox';
import { Box } from '@mui/material';
import Header from '~/chartComp/Header';
import axios from 'axios';
const cx = classNames.bind(styles);
function AddProducts() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigator = useNavigate();
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const schema = yup
        .object()
        .shape({
            name: yup.string().required('Bạn cần nhập trường này'),
            productId: yup.string().required('Bạn cần lựa chọn Thương hiệu'),
            type: yup.string().required('Bạn cần lựa chọn Loại giày'),
            // brand: yup.string().required('Bạn cần lựa chọn thành phố'),
            price: yup.string().required('Trường này là bắt buộc'),
            description: yup.string().required('Trường này là bắt buộc'),
        })
        .required();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const [img, setImg] = useState('');
    console.log(img);
    const [imgs_v2, setImgs_v2] = useState([]);
    // console.log(img);
    console.log(imgs_v2);
    const [price, setPrice] = useState(0);
    console.log(typeof price);
    const formatCurr = (number) => {
        let curr = Number(number.replaceAll('.', '')).toLocaleString('vi', { style: 'currency', currency: 'VND' });
        return curr.slice(0, curr.length - 2);
    };
    const formatNum = (str) => {
        return str.replaceAll('.', '');
    };
    // console.log(price);
    const sizeValues = ['36', '37', '38', '39', '40', '41', '42', '43'];
    const [inventory, setInventory] = useState(
        sizeValues.map((item, index) => {
            return {
                size: item,
                quantity: 0,
            };
        }),
    );
    const handlePreviewImg_main = (e) => {
        console.log('Hello');
        try {
            const file = e?.target?.files[0];
            console.log(e?.target?.files[0]?.name);
            // console.log(e?.target?.files[0] + '-removebg-preview.png');
            file.preview = URL.createObjectURL(file);
            setImg(file);
        } catch {
            console.log('Error');
        }
    };
    const handleChange = (e, item) => {
        let tmpList = [...inventory];
        let newList = tmpList.map((item2, index2) => {
            if (item.size === item2.size) return { ...item2, quantity: +e.target.value.replace(/[^0-9]/g, '') };
            return item2;
        });
        setInventory(newList);
        console.log(newList);
    };
    const handleKeyDownSize = (e) => {
        const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace'];
        const key = e.key;
        if (!allowedKeys.includes(key)) {
            e.preventDefault();
        }
    };
    const onSubmit = (data) => {
        // console.log(data);
        if (img === '' || imgs_v2.length < 3) {
            // console.log('Hello');
            showModal();
        } else {
            // console.log(data);
            console.log(data.type);
            const infor = {
                name: data.name,
                brand_id: data.productId || 'ADIDAS',
                price: +data.price,
                img: img && img.name,
                imgs: imgs_v2.map((i) => i.name),
                description: data.description,
                type: data.type,
                discount_id: 0,

                inventory: inventory,
                BC_color: 'color_4',
            };
            console.log(infor);
            axios
                .post('http://localhost:3000/product', infor)
                .then((res) => {
                    console.log(res);
                    navigator('/admin/product');
                    toast.success('Thêm thành công');
                })
                .catch((err) => toast.error('ERRORRRRRRRRRRR'));

            const formdata_imgs = new FormData();
            for (let i = 0; i < imgs_v2.length; i++) {
                formdata_imgs.append('files', imgs_v2[i]);
            }
            axios
                .post('https://shoesshop-6n6z.onrender.com' + '/upload_imgs', formdata_imgs)
                .then((res) => console.log('Hello'))
                .catch((err) => console.log(err));

            // img
            const formdata_img = new FormData();
            formdata_img.append('file', img);
            axios
                .post('https://shoesshop-6n6z.onrender.com' + '/upload_img', formdata_img)
                .then((res) => console.log(res))
                .catch((err) => console.log(err));
        }
    };
    return (
        <>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="ADD PRODUCT" subtitle="" />
            </Box>
            <div className={cx('wrapper')}>
                <div className={cx('left_side')}>
                    <input
                        type="file"
                        onChange={handlePreviewImg_main}
                        id="file"
                        className={cx('add_imgSub_btn-off')}
                    />
                    <div className={cx(['product_img'])}>
                        <label className={cx(['add_btn-on', 'img_main__add'])} htmlFor="file">
                            <FontAwesomeIcon icon={faFileImage} />
                        </label>
                        <div className={cx('img-wrapper')}>
                            {img && <img className={cx('img')} src={img.preview} />}
                            {img === '' && (
                                // <i className=" m-3 d-inline-block ">
                                //     Supported formates: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT
                                // </i>
                                <FontAwesomeIcon icon={faCloudArrowUp} size="4x" className={cx('icon-upload')} />
                            )}
                            {/* {errors.mainImg && console.log('Hello')} */}
                            {/* {errors.mainImg && <p className={cx('form-message')}>{errors.mainImg.message}</p>} */}
                        </div>
                    </div>
                    {/* <img src={`https://shoesshop-6n6z.onrender.com/imgs/0f057058-06b1-4c7c-b164-549ccc83dac2.png`} /> */}
                    <div className={cx('product_img--sub')}>
                        {Boolean(imgs_v2.length) &&
                            imgs_v2.map((item, index) => (
                                <div className={cx('img_sub')} key={index}>
                                    <button
                                        onClick={() => {
                                            URL.revokeObjectURL(imgs_v2[index]);
                                            setImgs_v2((e) => {
                                                let arr = [...e];
                                                return arr.filter((item2, index2) => {
                                                    return index2 !== index;
                                                });
                                            });
                                        }}
                                    >
                                        X
                                    </button>
                                    <img src={item.preview} />
                                </div>
                            ))}
                        <div className={cx('img_sub')}>
                            <label className={cx(['add_btn-on', 'img_sub__add'])} htmlFor="file2">
                                <FontAwesomeIcon icon={faSquarePlus} size="4x" />

                                {/* Add */}
                                {/* <AddBoxIcon /> */}
                            </label>
                            {/* <div className={'btn-add-sub'}>
                            
                        </div> */}
                        </div>
                    </div>

                    <input
                        type="file"
                        onChange={(e) => {
                            try {
                                const file = e?.target?.files[0];
                                console.log(e?.target?.files[0]?.name);
                                file.preview = URL.createObjectURL(file);
                                setImgs_v2((pre) => [...pre, file]);
                            } catch {
                                console.log('Error');
                            }
                        }}
                        id="file2"
                        className={cx('add_imgSub_btn-off')}
                    />

                    {/* <img src={require('../../imgData/shoe-removebg-preview.png')} />
                <img src={require('../../imgData/A02095C_A_107X1-removebg-preview.png')} /> */}
                </div>

                <div className={cx('right_side')}>
                    <div className={cx('input_product')}>
                        <label className={cx('label-product')}>Brands: </label>
                        <select {...register('productId')}>
                            {
                                // atri_prod?.brands?.map(i => <option key={i.brand_id} value={i.brand_id}>{i.brand_id}</option>)
                            }
                            <option value="">---Chọn Thương Hiệu---</option>
                            <option value="ADIDAS">ADIDAS</option>
                            <option value="CONVERSE">CONVERSE</option>
                            <option value="NIKE">NIKE</option>
                            <option value="PUMA">PUMA</option>
                            <option value="VANS">VANS</option>
                        </select>
                        {/* <FontAwesomeIcon
                            className={cx('addAtribute_btn')}
                            icon={faPlus}
                            // onClick={() => {
                            //     // setAtribName("brands")
                            //     // handleShow()
                            // }}
                        /> */}
                        {errors.productId && <p className={cx('form-message')}>{errors.productId.message}</p>}
                    </div>
                    <div className={cx('input_product')}>
                        <label className={cx('label-product')}>Types: </label>
                        <select {...register('type')}>
                            <option value="">---Chọn Loại Giày---</option>
                            <option value="Sneaker">Sneaker</option>
                            <option value="Boot">Boot</option>
                            <option value="Sandal">Sandal</option>
                            <option value="Dep">Dép</option>
                        </select>
                        {errors.type && <p className={cx('form-message')}>{errors.type.message}</p>}
                    </div>
                    <div className={cx('input_product')}>
                        <label className={cx('label-product')}>name: </label>
                        <input placeholder="..." {...register('name')} />
                        {errors.name && <p className={cx('form-message')}>{errors.name.message}</p>}
                    </div>
                    <div className={cx('input_product')}>
                        <label className={cx('label-product')}>price: </label>
                        <input
                            placeholder="..."
                            onChange={(e) => {
                                setPrice(e.target.value);
                                console.log(price);
                            }}
                            onKeyDown={handleKeyDownSize}
                            {...register('price')}
                        />
                        {errors.price && <span className={cx('form-message')}>{errors.price.message}</span>}
                    </div>

                    <div className={cx('input_product')}>
                        <label className={cx('label-product')}>size: </label>
                        <div className={cx('size-wrapper')}>
                            {inventory.map((item, i) => {
                                return (
                                    <div key={i} className={cx('size-section')}>
                                        {item.size}
                                        <input
                                            placeholder="0"
                                            id="quantity"
                                            // value={item.quantity}
                                            pattern="[0-9]*"
                                            type="numeric"
                                            // type="text"
                                            onChange={(e) => {
                                                handleChange(e, item);
                                            }}
                                            onKeyDown={handleKeyDownSize}
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
                            {...register('description')}
                            // {...register("description", { required: true })}
                        ></textarea>
                        {errors.description && <span className={cx('form-message')}>{errors.description.message}</span>}
                    </div>
                    <button
                        onClick={(e) => {
                            handleSubmit(onSubmit)(e);
                        }}
                    >
                        Click me!
                    </button>
                </div>
            </div>
            <Modal title="Thông báo" open={isModalOpen} onOk={handleCancel} onCancel={handleCancel}>
                <p>Bạn chưa dán ảnh đầy đủ!!</p>
                {/* <p>Bạn chưa dán ảnh đầy đủ!!</p> */}
                <ul>
                    <li>Tối thiểu 1 ảnh chính (Khuyến khích ảnh đã được removeBackground)</li>
                    <li>Tối thiểu 3 ảnh phụ</li>
                </ul>
            </Modal>
        </>
    );
}

export default AddProducts;
