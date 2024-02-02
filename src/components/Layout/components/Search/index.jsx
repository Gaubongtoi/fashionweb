import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import HeadlessTippy from '@tippyjs/react/headless';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import ProductItem from '~/components/AccountItem';
import images from '~/assets/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import useDebounce from '~/hooks/useDebounce';
import axios from 'axios';

const cx = classNames.bind(styles);
function Search() {
    // const [searchResult, setSearchResult] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [products, setProducts] = useState([]);
    const [showResults, setShowResults] = useState(true);
    const [loading, setLoading] = useState(true);
    const debounce = useDebounce(searchValue, 800); // trả về data sau 1 khoảng trễ
    const inputRef = useRef();

    const handleClear = () => {
        setSearchValue('');
        setSearchResult([]);

        inputRef.current.focus();
    };

    // Call API
    useEffect(() => {
        axios.get('http://localhost:3000/product').then((res) => {
            // Trả về 1 mảng [sản phẩm]
            setProducts(res.data);
        });
    }, []);

    // Tra ve 1 mang chua nhung product = searchValue
    const filterSearch = useMemo(() => {
        const productFilter = products.filter((product) => {
            if (!debounce.trim()) {
                setSearchResult([]);
                return;
            }
            let indexItem = product.name.toLowerCase().includes(debounce.toLowerCase());
            return indexItem;
        });

        return productFilter;
    }, [debounce]);

    // Xu ly hien thi ket qua
    useEffect(() => {
        setSearchResult(filterSearch);
    }, [filterSearch]);
    // const handleClear = () => {
    //     setSearchValue('');
    //     setSearchResult([]);

    //     inputRef.current.focus();
    // };
    const handleHideResult = () => {
        setShowResults(false);
    };
    return (
        <HeadlessTippy
            // Cho phep duoc active thanh phan trong Tippy
            interactive
            //
            appendTo={() => document.body}
            //
            visible={showResults && searchResult.length > 0}
            // trigger="click"
            // placement="bottom-end"
            // Attribute cho phep render ra popup voi dieu kien la
            // visible
            render={(attrs) => {
                return (
                    <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                        <PopperWrapper overflow>
                            <p className={cx('title-search-result')}>Gợi ý sản phẩm</p>
                            {searchResult.map((result) => (
                                <Link key={result.id} to={'/product/' + result.id} onClick={() => handleClear()}>
                                    <ProductItem data={result} />
                                </Link>
                            ))}
                        </PopperWrapper>
                    </div>
                );
            }}
            onClickOutside={handleHideResult}
        >
            <div className={cx('search')}>
                <button className={cx('search-btn')}>
                    <img className={cx('search-logo')} src={images.search} alt="search" />
                </button>

                <input
                    ref={inputRef}
                    value={searchValue}
                    onChange={(e) => {
                        e.target.value = e.target.value.trimStart();
                        setSearchValue(e.target.value);
                    }}
                    placeholder="Search for an Item..."
                    onFocus={() => setShowResults(true)}
                />
                {!!searchValue && (
                    <button className={cx('clear')} onClick={handleClear}>
                        {/* Cài đặt thư viện fontawesome 
                            Với mỗi icon sẽ bao gồm chuẩn fa+tên icon
                        */}
                        <FontAwesomeIcon icon={faCircleXmark} />
                    </button>
                )}
                {/* {loading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />} */}
            </div>
        </HeadlessTippy>
    );
}

export default Search;
