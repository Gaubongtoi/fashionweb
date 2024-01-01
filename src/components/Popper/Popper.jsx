import classNames from 'classnames/bind';
import styles from './Popper.module.scss';
const cx = classNames.bind(styles);
function Popper({ children, overflow = false }) {
    return (
        <div className={cx('wrapper')} style={{ overflowY: overflow ? 'scroll' : '' }}>
            {children}
        </div>
    );
}

export default Popper;
