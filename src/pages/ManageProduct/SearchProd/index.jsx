import HeadlessTippy from '@tippyjs/react/headless';
// import * as searchService from '~/apiServices/searchService';
import { Wrapper as PopperWrapper } from '~/components/Popper';
// import AccountItem from '~/components/AccountItem';
import { faCircleXmark, faSpinner, faPenNib } from '@fortawesome/free-solid-svg-icons';
import { SearchIcon } from '~/components/Icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './SearchProd.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect, useRef, useContext } from 'react';
// import { useDebounce } from "~/hooks";
import useDebounce from '~/hooks/useDebounce';
import { actions } from '~/components/PageLoading/store';
import { StoreContext } from '~/components/PageLoading/store';

import axios from 'axios';
import ModalDetailProduct from '../ModalDetailProduct';
import { Modal } from 'antd';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);
function SearchProd() {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [prodInfor, setProdInfor] = useState({});
    const [isLoading, dispatch] = useContext(StoreContext);
    const [itemId, setItemId] = useState();

    // console.log(!!searchValue);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showResults, setShowResults] = useState(true);
    const [loading, setLoading] = useState(false);
    console.log(loading);
    const handleOk = async () => {
        setIsModalOpen(false);
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        // .then((res) => console.log(res));
        try {
            // console.log(dataPost);
            // console.log(state?.cuser?.value);
            dispatch(actions.setLoading(true));
            await delay(2000); // Chờ 2 giây
            const res = await axios.delete(`http://localhost:3000/product/${itemId}`);
            console.log(res);
            // setOrder(dataUpdate);
            toast.success('Xoá sản phẩm thành công', {
                // autoClose: 2000,
                theme: 'colored',
                position: 'top-right',
                autoClose: 3000,
            });
        } catch (error) {
            // Xử lý lỗi nếu có
            toast.error(`Xoá sản phẩm thất bại => Error: ${error}`, {
                // autoClose: 2000,
                theme: 'colored',
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            // navigator('/user/order');
            dispatch(actions.setLoading(false)); // Kết thúc hiển thị trạng thái loading
        }
    };
    const debounce = useDebounce(searchValue, 3000);
    const inputRef = useRef();
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const [showModal, setShowModal] = useState(false);
    // Call API get data
    // Sau khi Web duoc mounted (lan dau tien) => thuc hien call API get data bang useEffect
    //
    useEffect(() => {
        // fetch : Lay duong link API
        // Cấu trúc URL:
        // + https:// -> là giao thức http
        // + //tiktok (subdomain): Tên miền con của tên miền chính
        // .fullstack (second-level domain): tên của website mà người dùng đặt cho nó
        // .edu()
        // .api/users/search: đường dẫn (path)
        // ? : ngăn cách giữa path và Query parameter
        // q=hoaa : Query parameter
        // & Kết hợp nhiều query
        // Kiểm tra khoảng trắng
        if (!debounce.trim()) {
            setSearchResult([]);
            return;
        }
        const fetchApi = async () => {
            setLoading(true);
            const result = await axios.get(`http://localhost:3000/product/`, {
                params: {
                    name_like: debounce,
                    // _limit: 6,
                },
            });
            // setSearchResult(result);
            setSearchResult(result.data);
            setLoading(false);
        };
        fetchApi();

        // searchValue constraints: Bởi vì sau mỗi lần nhập (thay đổi state), nó sẽ cho ra những kết quả tìm kiếm khác nhau
        // => render ra được kqtk
    }, [debounce]);

    const handleClear = () => {
        setSearchValue('');
        setSearchResult([]);
        inputRef.current.focus();
    };

    const handleHideResult = () => {
        setShowResults(false);
    };

    const showModalDelete = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <HeadlessTippy
                // Cho phep duoc active thanh phan trong Tippy
                interactive={true}
                //
                appendTo={() => document.body}
                // Xuất hiện (visible) với 1 điều kiện nào đó
                visible={showResults && searchResult.length > 0}
                placement="bottom-end"
                // attr render
                render={(attrs) => (
                    <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                        <PopperWrapper>
                            <h4 className={cx('search-title')}>Search Results: {searchResult.length} result</h4>
                            <div className={cx('search-result-wrapper')}>
                                {searchResult?.map((result) => (
                                    <div className={cx('result')}>
                                        {/* <img
                                    className={cx('avatar')}
                                    src={`https://shoesshop-6n6z.onrender.com/imgs/${result?.img}`}
                                    alt={result?.name}
                                /> */}
                                        <div className={cx('product-img')}>
                                            <div className={cx('product-img-wrapper')}>
                                                <img src={`https://shoesshop-6n6z.onrender.com/imgs/${result?.img}`} />
                                            </div>
                                        </div>
                                        <div className={cx('info')}>
                                            <h4
                                                className={cx('name')}
                                                onClick={() => {
                                                    handleClear();
                                                    handleShow();
                                                    setProdInfor(result);
                                                }}
                                            >
                                                <span>{result?.name}</span>
                                            </h4>
                                            <span className={cx('prod-id')}>Product ID: {result.id}</span>
                                            <div
                                                className={cx('remove-btn')}
                                                data-label="Remove"
                                                onClick={() => {
                                                    showModalDelete();
                                                    handleHideResult();
                                                    setItemId(result?.id);
                                                }}
                                            >
                                                Remove
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </PopperWrapper>
                    </div>
                )}
                onClickOutside={handleHideResult}
            >
                {/* + Search */}
                <div className={cx('search')}>
                    <input
                        ref={inputRef}
                        value={searchValue}
                        placeholder="Using name to Search Product"
                        spellCheck={false}
                        onChange={(e) => {
                            e.target.value = e.target.value.trimStart();
                            setSearchValue(e.target.value);
                        }}
                        onFocus={() => setShowResults(true)}
                    />
                    {!!searchValue && !loading && (
                        <button className={cx('clear')} onClick={handleClear}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                    )}
                    {loading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />}
                    <button className={cx('search-btn')}>
                        <SearchIcon />
                    </button>
                </div>
            </HeadlessTippy>
            <ModalDetailProduct show={showModal} handleClose={handleClose} prodID={prodInfor?.id}></ModalDetailProduct>
            <Modal title="Thông báo" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Bạn có muốn xoá sản phẩm này không?</p>
            </Modal>
        </>
    );
}

export default SearchProd;
