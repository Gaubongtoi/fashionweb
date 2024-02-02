import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

import './priceSlider.css';
// import { search } from '~/service/customAPI';

const cx = classNames.bind(styles);
function Sidebar() {
    // const types = ['Tất cả', 'Sneaker', 'Boot', 'Sandal', 'Dép'];
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const brand = searchParams.get('brand_id');
    const type = searchParams.get('type');
    // const filter = searchParams.get('_order');
    // const sort = searchParams.get('_sort');
    // const brandParam = brand;
    const types = [
        {
            id: 'Sneaker',
            name: 'Sneaker',
        },
        {
            id: 'Boot',
            name: 'Boot',
        },
        {
            id: 'Sandal',
            name: 'Sandal',
        },
        {
            id: 'Dep',
            name: 'Dép',
        },
    ];
    const [checked, setChecked] = useState('All');
    const [price, setprice] = useState([0, 30000000]);
    // console.log(price);
    const navigator = useNavigate();
    // console.log(brand !== brandCurrent);
    // console.log(checked);
    const handleNavigator = (id) => {
        const redirectToURL = brand
            ? `/product?_page=1&_limit=9&brand_id=${brand}&type=${id}`
            : `/product?_page=1&_limit=9&type=${id}`;
        navigator(redirectToURL);
    };
    const handleNavigatorForAll = () => {
        const redirectToURL = brand ? `/product?_page=1&_limit=9&brand_id=${brand}` : `/product?_page=1&_limit=9`;
        navigator(redirectToURL);
    };
    const handleFilterPrice = () => {
        var redirectToURL = `/product?_page=1&_limit=9`;
        if (brand) {
            redirectToURL += `&brand_id=${brand}`;
        }
        if (type) {
            redirectToURL += `&type=${type}`;
        }
        navigator(redirectToURL + `&price_gte=${price[0]}&price_lte=${price[1]}`);
        // const l = brand
        //     ? `/product?_page=1&_limit=9&brand_id=${brand}&type=${id}`
        //     : `/product?_page=1&_limit=9&type=${id}`;
        // navigator(redirectToURL);
    };
    // const handleDeleteType = () => {
    //     if (brand === brandCurrent) {
    //         const brandOnly = searchParams.delete('type');
    //         console.log(brandOnly);
    //         // '/product?_page=1&_limit=9&brand='
    //     }
    // };
    useEffect(() => {
        setChecked('All');
    }, [brand]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('sidebar-wrapper')}>
                <div className={cx('sidebar-section')}>
                    <p className={cx('title')}>Prices</p>
                    <div className={cx('range')}>
                        <p>Range</p>
                        <div className={cx('number')}>
                            <span>{price[0].toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span> -{' '}
                            <span>{price[1].toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
                        </div>
                    </div>
                    <RangeSlider
                        id="range-slider-yellow"
                        value={price}
                        onInput={setprice}
                        min={0}
                        max={10000000}
                        step={10000}
                    />
                    <div className={cx('filter-wrapper')}>
                        <button className={cx('filter_price_btn')} onClick={() => handleFilterPrice()}>
                            Lọc
                        </button>
                    </div>
                </div>
                <div className={cx('sidebar-section')}>
                    <p className={cx('title')}>Brands</p>
                    <ul className={cx('list')}>
                        <li>
                            <Link to={'/product?_page=1&_limit=9'}>Tất cả</Link>
                        </li>
                        <li>
                            {type === 'null' ? (
                                <Link to={`/product?_page=1&_limit=9&brand_id=ADIDAS&type=${type}`}>Adidas</Link>
                            ) : (
                                <Link to={'/product?_page=1&_limit=9&brand_id=ADIDAS'}>Adidas</Link>
                            )}
                        </li>
                        <li>
                            {type === 'null' ? (
                                <Link to={`/product?_page=1&_limit=9&brand_id=NIKE&type=${type}`}>Nike</Link>
                            ) : (
                                <Link to={'/product?_page=1&_limit=9&brand_id=NIKE'}>Nike</Link>
                            )}
                        </li>
                        <li>
                            {type === 'null' ? (
                                <Link to={`/product?_page=1&_limit=9&brand_id=PUMA&type=${type}`}>Puma</Link>
                            ) : (
                                <Link to={'/product?_page=1&_limit=9&brand_id=PUMA'}>Puma</Link>
                            )}
                        </li>
                        <li>
                            {type === 'null' ? (
                                <Link to={`/product?_page=1&_limit=9&brand_id=CONVERSE&type=${type}`}>Converse</Link>
                            ) : (
                                <Link to={'/product?_page=1&_limit=9&brand_id=CONVERSE'}>Converse</Link>
                            )}
                        </li>
                        <li>
                            {type === 'null' ? (
                                <Link to={`/product?_page=1&_limit=9&brand_id=VANS&type=${type}`}>Vans</Link>
                            ) : (
                                <Link to={'/product?_page=1&_limit=9&brand_id=VANS'}>Vans</Link>
                            )}
                        </li>
                    </ul>
                </div>
                <div className={cx('sidebar-section')}>
                    <p className={cx('title')}>Categories</p>
                    <ul className={cx('type')}>
                        <li>
                            <input
                                type="radio"
                                checked={checked === 'All'}
                                onChange={() => (handleNavigatorForAll(), setChecked('All'))}
                            />
                            <label>Tất cả</label>
                        </li>
                        {types.map((type) => {
                            return (
                                <li key={type.id}>
                                    <input
                                        id={type.id}
                                        type="radio"
                                        checked={checked === type.id}
                                        onChange={() => (handleNavigator(type.id), setChecked(type.id))}
                                    />
                                    <label htmlFor={type.id}>{type.name}</label>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
