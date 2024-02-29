import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '~/chartComp/Header';
import classNames from 'classnames/bind';
import styles from './ManageAccount.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUnlock, faUserTie, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import ModalDetailAccount from './ModalDetailAccount';

const cx = classNames.bind(styles);
const Team = () => {
    const [user, setUser] = useState([]);
    const [rr_lock, setRr_lock] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [accInfor, setAccInfor] = useState({});
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const handleLockAcc = (id, value) => {
        axios.put('http://localhost:4000' + `/auth/user/update/${id}`, { roleId: value, RoleId: value });
        // .then(res => console.log(res))
        setRr_lock((pre) => !pre);
    };
    useEffect(() => {
        const accessToken = JSON.parse(localStorage.getItem('accessToken'));
        axios
            .get('http://localhost:4000/auth/all-user', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => console.log(err));
    }, [rr_lock]);

    return (
        <>
            <Header title="MANAGER USER" subtitle="View & Managing Account!" />

            <ul className={cx('responsive-table')}>
                <li className={cx('table-header')}>
                    <div className={cx('col', 'col-1')}>ID</div>
                    <div className={cx('col', 'col-2')}>Cus Name</div>
                    <div className={cx('col', 'col-3')}>Acc Name</div>
                    <div className={cx('col', 'col-4')}>Email</div>
                    <div className={cx('col', 'col-5')}>Phone</div>
                    <div className={cx('col', 'col-6')}>Role</div>
                    <div className={cx('col', 'col-7')}>Detail</div>
                    <div className={cx('col', 'col-8')}>Access Level</div>
                </li>
                {user.map((item, index) => {
                    return (
                        <li key={index} className={cx('table-row')}>
                            <div className={cx('col', 'col-1', 'name')} data-label="Id">
                                {index + 1}
                            </div>
                            <div className={cx('col', 'col-2', 'name')} data-label="Customer Name">
                                {item.fullname}
                            </div>
                            <div className={cx('col', 'col-3', 'name')} data-label="Account Name">
                                {item.name}
                            </div>
                            <div className={cx('col', 'col-4', 'name')} data-label="Payment Status">
                                {item.email}
                            </div>
                            <div className={cx('col', 'col-5', 'name')} data-label="Phone">
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
                            </div>
                        </li>
                    );
                })}
            </ul>
            <ModalDetailAccount show={showModal} handleClose={handleClose} accInfor={accInfor}></ModalDetailAccount>
        </>
    );
};

export default Team;
