import styles from './AccountItem.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';

const cx = classNames.bind(styles);
function AccountItem() {
    return (
        <div className={cx('wrapper')}>
            <img className={cx('search-icon')} src={images.search} alt="search-btn" />
            <p className={cx('product')}>Helmet</p>
        </div>
    );
}

export default AccountItem;
