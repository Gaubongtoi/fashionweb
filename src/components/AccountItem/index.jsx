import styles from './AccountItem.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);
function ProductItem({ data }) {
    return (
        <div className={cx('wrapper')}>
            <img className={cx('search-icon')} src={images.search} alt="search-btn" />
            <p className={cx('product')}>{data.name}</p>
        </div>
    );
}

export default ProductItem;
