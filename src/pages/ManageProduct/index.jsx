import classNames from 'classnames/bind';
import styles from './ManageProduct.module.scss';
import Header from '~/chartComp/Header';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenNib } from '@fortawesome/free-solid-svg-icons';
import { priceDiscount, formatPrice } from '~/common';
import { actions } from '~/components/PageLoading/store';
import { toast } from 'react-toastify';
import { StoreContext } from '~/components/PageLoading/store';
import { Modal } from 'antd';
import ModalDetailProduct from './ModalDetailProduct';
// import './pagination.css';
import '~/pages/Product/pagination.css';
import SearchProd from './SearchProd';
const cx = classNames.bind(styles);
function ManageProduct() {
    const [product, setProduct] = useState([]);
    // console.log(product);
    const [itemId, setItemId] = useState();
    const [prodInfor, setProdInfor] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    // const productsPerPage = 10; // Số sản phẩm hiển thị trên mỗi trang
    const pageCount = Math.ceil(product.length / 5); // Tổng số trang
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };
    const offset = currentPage * 5;
    const currentPageData = product.slice(offset, offset + 5);
    // console.log();
    const [isLoading, dispatch] = useContext(StoreContext);
    const [render, setRender] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    // Modal Detail
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleReRender = () => {
        setRender((prev) => !prev);
    };
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
            setRender((prev) => !prev);
            dispatch(actions.setLoading(false)); // Kết thúc hiển thị trạng thái loading
        }
    };
    const showModalDelete = () => {
        setIsModalOpen(true);
    };
    console.log(product);
    useEffect(() => {
        axios.get('http://localhost:3000/product').then((res) => {
            setProduct(res.data);
        });
    }, [render]);
    return (
        <>
            <div className={cx('wrapper')}>
                <Header title="MANAGER PRODUCT" subtitle="View & Managing Product!" />
                <div className={cx('total-prod-search')}>
                    <p>
                        Showing {currentPage + 1} - {pageCount} <span>out of {product?.length} Products</span>
                        {/* TOTAL PRODUCTS: <span> products</span> */}
                    </p>
                    <SearchProd></SearchProd>
                </div>
                <ul className={cx('responsive-table')}>
                    <li className={cx('table-header')}>
                        <div className={cx('col', 'col-1')}>
                            {/* <FontAwesomeIcon icon={faImage}></FontAwesomeIcon> */}
                            Picture
                        </div>
                        <div className={cx('col', 'col-2')}>ID</div>
                        <div className={cx('col', 'col-3')}>Product Name</div>
                        <div className={cx('col', 'col-4')}>Price</div>
                        <div className={cx('col', 'col-5')}>Discount</div>
                        <div className={cx('col', 'col-6')}></div>
                        <div className={cx('col', 'col-7')}></div>
                    </li>
                    {currentPageData.map((item, index) => {
                        return (
                            <li key={index} className={cx('table-row')}>
                                <div className={cx('col', 'col-1', 'name')} data-label="Picture">
                                    <div className={cx('product-img')}>
                                        <div className={cx('product-img-wrapper')}>
                                            <img src={`https://shoesshop-6n6z.onrender.com/imgs/${item?.img}`} />
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('col', 'col-2', 'name')} data-label="ID">
                                    {item.id}
                                </div>
                                <div className={cx('col', 'col-3', 'name')} data-label="Product Name">
                                    {item.name}
                                </div>
                                <div className={cx('col', 'col-4', 'name')} data-label="Price">
                                    {/* {item.price} */}
                                    {formatPrice(item?.price)}
                                </div>
                                <div className={cx('col', 'col-5', 'name')} data-label="Discount">
                                    {item?.discount_id}%
                                </div>
                                <div
                                    className={cx('col', 'col-6', 'name', 'btn-hover')}
                                    data-label="Remove"
                                    onClick={() => {
                                        showModalDelete();
                                        setItemId(item?.id);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                                    Remove
                                </div>
                                <div
                                    className={cx('col', 'col-7', 'name', 'btn-hover')}
                                    data-label="Modify"
                                    onClick={() => {
                                        handleShow();
                                        setProdInfor(item);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPenNib}></FontAwesomeIcon>
                                    Modify
                                </div>
                                {/* <div className={cx('col', 'col-5', 'name')} data-label="Phone">
                    {item.phone}
                </div>
                <div className={cx('col', 'col-6')} data-label="Role">
                    {item.roleId === 1 ? (
                        <span className={cx(['role', 'i'])}>Admin</span>
                    ) : (
                        <span className={cx(['role', 'ii'])}>Client</span>
                    )}
                </div>
                <div
                    className={cx('col', 'col-7', 'btn-detail')}
                    data-label="Detail"
                    onClick={() => {
                        handleShow();
                        setAccInfor(item);
                    }}
                >
                    <FontAwesomeIcon icon={faPenToSquare} />
                    Detail
                </div>
                <div className={cx('col', 'col-8')} data-label="Payment Status">
                    {item.roleId === 3 || item.roleId === 4 ? (
                        item.roleId !== 4 ? (
                            <button
                                className={cx(['status_btn', 'lock'])}
                                onClick={() => handleLockAcc(item.id, 4)}
                            >
                                <FontAwesomeIcon icon={faLock} />
                                <span>Khóa</span>
                            </button>
                        ) : (
                            <button
                                className={cx(['status_btn', 'unlock'])}
                                onClick={() => handleLockAcc(item.id, 3)}
                            >
                                <FontAwesomeIcon icon={faUnlock} />
                                <span>Mở</span>
                            </button>
                        )
                    ) : (
                        <div
                            className={cx(['status_btn_admin', 'unlock'])}
                            // onClick={() => handleLockAcc(item.id, 3)}
                        >
                            <FontAwesomeIcon icon={faUserTie} />
                            <span>Admin</span>
                        </div>
                    )}
                </div> */}
                            </li>
                        );
                    })}
                </ul>

                <Modal title="Thông báo" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <p>Bạn có muốn xoá sản phẩm này không?</p>
                </Modal>
                <ModalDetailProduct
                    show={showModal}
                    handleClose={handleClose}
                    handleReRender={handleReRender}
                    prodID={prodInfor?.id}
                ></ModalDetailProduct>
            </div>
            <div className={cx('pagination')}>
                <ReactPaginate
                    previousLabel={'Previous'}
                    nextLabel={'Next'}
                    breakLabel={'...'}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageChange}
                    renderOnZeroPageCount={null}
                    pageClassName={cx('page-item')}
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination"
                    activeClassName="active"
                />
            </div>
        </>
    );
}

export default ManageProduct;
