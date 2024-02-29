import classNames from 'classnames/bind';
import styles from './SidebarAdm.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
const cx = classNames.bind(styles);
function SidebarAdm() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('side-bar-admin')}>
                <ul className={cx('list-admin')}>
                    {/* <li className={cx(profile ? 'isActive' : '')}>
                            <Link to="/user/profile">Personal Information</Link>
                            <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
                        </li>
                        <li className={cx(password ? 'isActive' : '')}>
                            <Link to="/user/password">Password</Link>
                            <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
                        </li>
                        <li className={cx(order ? 'isActive' : '')}>
                            <Link to="/user/order">My Orders</Link>
                            <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
                        </li> */}
                    <li>
                        <Link to="/user/profile">Personal Information</Link>
                        <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
                    </li>
                    <li>
                        <Link to="/user/profile">Personal Information</Link>
                        <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
                    </li>
                    <li>
                        <Link to="/user/profile">Personal Information</Link>
                        <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default SidebarAdm;
