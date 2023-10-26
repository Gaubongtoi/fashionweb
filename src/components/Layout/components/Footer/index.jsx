import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import images from '~/assets/images';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
const cx = classNames.bind(styles);
function Footer() {
    return (
        <footer className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('logo-email')}>
                    <img src={images.logo} alt="Logo" />
                    <div className={cx('subcribe-wrapper')}>
                        <div className={cx('email')}>
                            <img src={images.email} alt="email" />
                            <input
                                type="text"
                                // className={cx('input-mail')}
                                placeholder="Enter your email to get the lastest news..."
                                // size="30"
                            />
                        </div>
                        <Button email>Subcribe</Button>
                    </div>
                </div>
                <div className={cx('description-wrapper')}>
                    <div className={cx('row')}>
                        <ul>
                            <li>Column One</li>
                            <li>Twenty Two</li>
                            <li>Thirty Two</li>
                            <li>Forty Three</li>
                            <li>Fifty Four</li>
                        </ul>
                    </div>
                    <div className={cx('row')}>
                        <ul>
                            <li>Column Two</li>
                            <li>Twenty Two</li>
                            <li>Thirty Two</li>
                            <li>Forty Three</li>
                            <li>Fifty Four</li>
                        </ul>
                    </div>
                    <div className={cx('row')}>
                        <ul>
                            <li>Column Three</li>
                            <li>Twenty Two</li>
                            <li>Thirty Two</li>
                            <li>Forty Three</li>
                            <li>Fifty Four</li>
                        </ul>
                    </div>
                    <div className={cx('row')}>
                        <ul>
                            <li>Column Four</li>
                            <div className={cx('download')}>
                                <img src={require('./Logo/button.png')} />
                                <img src={require('./Logo/button2.png')} />
                            </div>
                        </ul>
                        <ul>
                            <li>Join Us</li>
                            <div className={cx('social')}>
                                <img src={require('./Logo/youtube.svg').default} alt="yt" />
                                <img src={require('./Logo/facebook.svg').default} alt="yt" />
                                <img src={require('./Logo/twitter.svg').default} alt="yt" />
                                <img src={require('./Logo/instagram.svg').default} alt="yt" />
                                <img src={require('./Logo/linkedin.svg').default} alt="yt" />
                            </div>
                        </ul>
                    </div>
                </div>
                <div className={cx('copyright')}>
                    <p>CompanyName @ 202X. All rights reserved.</p>
                    <div className={cx('right-copyright')}>
                        <p>Eleven</p>
                        <p>Twelve</p>
                        <p>Thirteen</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
