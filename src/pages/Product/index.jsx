import axios from 'axios';
import styles from './Product.module.scss';
import classNames from 'classnames/bind';
import { formatPrice, priceDiscount } from '~/common';
import images from '~/assets/images';
import { Link } from 'react-router-dom';
import { useState, useMemo, useEffect, useContext, useRef } from 'react';
import ReactPaginate from 'react-paginate';
import ProductItem from '~/components/AccountItem';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { setLoading } from '~/components/PageLoading/store/action';
import { actions } from '~/components/PageLoading/store';
import { StoreContext } from '~/components/PageLoading/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faSortUp, faSortDown, faBaseball, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import './pagination.css';

const cx = classNames.bind(styles);

function Product() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, dispatch] = useContext(StoreContext);
    const [selected, setSelected] = useState('All');
    const searchParams = new URLSearchParams(location.search);
    const page = searchParams.get('_page');
    const limit = searchParams.get('_limit');
    const brand = searchParams.get('brand_id');
    const type = searchParams.get('type');
    const price_gte = searchParams.get('price_gte');
    const price_lte = searchParams.get('price_lte');
    const filter = searchParams.get('_order');
    const sort = searchParams.get('_sort');
    const [productsPerPage, setProductPerPage] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState();
    const [display, setDisplay] = useState(false);
    const numPages = (n) => {
        const arrPage = Math.ceil(+n / 9);
        return arrPage;
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/product`, {
                    params: {
                        _page: page,
                        _limit: limit,
                        brand_id: brand,
                        type: type,
                        price_gte: price_gte,
                        price_lte: price_lte,
                        _sort: sort,
                        _order: filter,
                    },
                });
                // response.headers('X-Total-Count', )
                const xTotalCount = response.headers['x-total-count'];
                // console.log(response);
                setTotalPages(numPages(Number(+xTotalCount)));
                setProductPerPage(response.data);
                setDisplay(false);
                {
                    sort ? setSelected((prev) => prev) : setSelected('All');
                }
                dispatch(actions.setLoading(false));
            } catch (error) {
                console.error(error);
            }
        };

        dispatch(actions.setLoading(true));
        setTimeout(async () => {
            await fetchData();
        }, 2000);
    }, [brand, page, type, price_gte, price_lte, filter, sort]);
    // Handle Pagination
    const handlePageClick = (e) => {
        setCurrentPage(+e.selected + 1);
        searchParams.set('_page', +e.selected + 1);
        searchParams.set('_limit', '9');
        navigate(`/product?${searchParams.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const handleDropItem = (select, path = '') => {
        if (selected !== select) {
            setSelected(select);
            var redirectToURL = `/product?_page=1&_limit=9`;
            if (brand) {
                redirectToURL += `&brand_id=${brand}`;
            }
            if (type) {
                redirectToURL += `&type=${type}`;
            }
            if (price_gte && price_lte) {
                redirectToURL += `&price_gte=${price_gte}&price_lte${price_lte}`;
            }
            if (path === '') {
                navigate(redirectToURL);
            } else {
                navigate(redirectToURL + `&_sort=price&_order=${path}`);
            }
        }
        setDisplay(false);
    };
    return (
        <>
            <div className={cx('quantity-filter-wrapper')}>
                <div className={cx('filter')}>
                    <p>Sort by:</p>
                    <p className={cx('filter-name')} onClick={() => setDisplay((prev) => !prev)}>
                        {selected}
                    </p>
                </div>
                <div className={cx('dropdown')}>
                    <div
                        className={cx('dropdown-btn', display ? 'active' : '')}
                        onClick={() => setDisplay((prev) => !prev)}
                    >
                        {display ? <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />}
                    </div>

                    <div className={cx('dropdown-content', display ? 'active' : '')}>
                        <div className={cx('dropdown-item')} onClick={() => handleDropItem('All')}>
                            <FontAwesomeIcon icon={faBaseball} />
                            <p className={cx('option')}>All</p>
                        </div>
                        <div className={cx('dropdown-item')} onClick={() => handleDropItem('Price Low to High', 'asc')}>
                            <FontAwesomeIcon icon={faSortUp} />
                            <p className={cx('option')}>Price Low to High</p>
                        </div>
                        <div
                            className={cx('dropdown-item')}
                            onClick={() => handleDropItem('Price High to Low', 'desc')}
                        >
                            <FontAwesomeIcon icon={faSortDown} />
                            <p className={cx('option')}>Price High to Low</p>
                        </div>
                    </div>
                </div>
                {/* <div className={cx('filter')}>
                    <p>Sort by:</p>
                    <span className={cx('title')}>All</span>
                    <FontAwesomeIcon icon={faChevronDown} />
                </div> */}
            </div>
            <div className={cx('wrapper')}>
                {/* <div ></div> */}
                {/* Component */}
                {productsPerPage.length > 0 &&
                    productsPerPage.map((prod, i) => {
                        // console.log(prod);
                        return (
                            <div key={i} className={cx('item-wrapper')}>
                                <div className={cx('product-img')}>
                                    <div className={cx('product-img-wrapper')}>
                                        <img
                                            src={`https://shoesshop-6n6z.onrender.com/imgs/${prod.img}`}
                                            alt={prod.name}
                                        />
                                        <img
                                            src={`https://shoesshop-6n6z.onrender.com/imgs/${prod.imgs[0]}`}
                                            alt="rear product image"
                                            className={cx('rear-img')}
                                        />
                                    </div>
                                </div>
                                <div className={cx('content')}>
                                    {/* <p className={cx('name')}>{prod.name}</p> */}
                                    <Link
                                        to={`/product/${prod.id}`}
                                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    >
                                        <p className={cx('name')}>{prod.name}</p>
                                    </Link>
                                    <p className={cx('price')}>
                                        {formatPrice(priceDiscount(prod.price, prod.discount_id))}
                                    </p>
                                    <p className={cx('old-price')}>{formatPrice(prod.price)}</p>
                                </div>
                                <div className={cx('loved')}>
                                    <img src={images.unheart} alt="" />
                                </div>
                            </div>
                        );
                    })}
            </div>
            {productsPerPage.length == 0 && (
                <div className={cx('notification')}>
                    {/* <h1>Xin chao</h1> */}
                    <p>Không tìm thấy sản phẩm nào</p>
                </div>
            )}
            <div className={cx('pagination')}>
                {/* {console.log('Hello')} */}
                <ReactPaginate
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    // pageRangeDisplayed={10}
                    pageCount={totalPages}
                    previousLabel="<"
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

export default Product;
