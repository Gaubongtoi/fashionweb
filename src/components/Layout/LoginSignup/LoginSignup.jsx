import styles from './LoginSignup.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';
const cx = classNames.bind(styles);
function LoginSignUp({ children }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('left-side')}>{children}</div>
            <div className={cx('right-side')}>{/* <img src={images.logoLogin} alt="Login" /> */}</div>
        </div>
    );
}

export default LoginSignUp;
