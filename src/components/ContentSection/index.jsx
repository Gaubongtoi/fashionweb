import classNames from 'classnames/bind';
import styles from './ContentSection.module.scss';
import Button from '../Button';
// import images from '~/assets/images';
const cx = classNames.bind(styles);
function ContentSection({ navigation = false, upper = false, name = false, children }) {
    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('title')}>{name}</h2>
            {navigation && (
                <div className={cx('navigation')}>
                    <Button text upper>
                        Significant
                    </Button>
                    <Button text upper>
                        Unique
                    </Button>
                    <Button text upper>
                        Best-Selling
                    </Button>
                </div>
            )}
            {/* IMG */}
            {children}
        </div>
    );
}

export default ContentSection;
