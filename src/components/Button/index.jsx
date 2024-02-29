import { faL } from '@fortawesome/free-solid-svg-icons';
import styles from './Button.module.scss';
import classNames from 'classnames/bind';
import { forwardRef } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);
const Button = forwardRef(
    (
        {
            type,
            onClick,
            children,
            to,
            href,
            primary = false,
            outline = false,
            disabled = false,
            rounded = false,
            text = false,
            icon = false,
            leftIcon = false,
            upper = false,
            email = false,
            shopping = false,
            order = false,
            payment = false,
            edit = false,
            managerOrder = false,
            manageReturn = false,
            ...passProps
        },
        ref,
    ) => {
        let Comp = 'button';
        // Moi button se co 1 su kien onClick => mac dinh se co onClick vao trong props
        const props = {
            type,
            onClick,
            ...passProps,
        };
        if (disabled) {
            // Su dung Object.keys để lấy ra những key
            // ex : onClick: function
            //      key : value
            // và lọc qua những key
            Object.keys(props).forEach((key) => {
                // Nếu key bắt đầu bằng chữ 'on' và nó là 1 hàm
                if (key.startsWith('on') && typeof props[key] === 'function') {
                    // Xóa bỏ event => tránh trường hợp người ngoài có thể chọt vào => phá
                    delete props[key];
                }
            });
        }

        // Day se la noi chua nhung class
        const classes = cx('wrapper', {
            primary,
            outline,
            disabled,
            rounded,
            text,
            upper,
            email,
            shopping,
            order,
            payment,
            edit,
            managerOrder,
            manageReturn,
        });

        // Neu co ton tai prop la to
        if (to) {
            // Router dinh tuyen noi bo trong trang web
            // Them attributes vao trong props, doi the Comp thanh Link
            props.to = to;
            Comp = Link;
        } else if (href) {
            // Neu ton tai prop href => Them attributes vao trong props, doi the Comp thanh a
            props.href = href;
            Comp = 'a';
        }
        return (
            // <Comp classNames={classes} {...props}>
            //     <span>{children}</span>
            // </Comp>
            <button ref={ref} className={classes} {...props}>
                {leftIcon && <div className={cx('logo')}>{leftIcon}</div>}
                {children && <span>{children}</span>}

                {icon && <div className={cx('cart-logo')}>{icon}</div>}
            </button>
        );
    },
);

export default Button;
