import classNames from 'classnames/bind';
import style from './AvatarAuto.module.scss';
const cx = classNames.bind(style);

function AvatarAuto({ nameU = 'User' }) {
    let bgRand = nameU.lastIndexOf(' ')
        ? nameU[nameU.lastIndexOf(' ') + 1].charCodeAt(0) % 10
        : nameU[0].charCodeAt(0) % 10;
    bgRand = bgRand > 0 ? bgRand : bgRand + 1;
    const sumaryU = () => {
        let n = nameU.lastIndexOf(' ') + 1;
        let splitName = nameU.split(' ');
        // return nameU[n]
        return splitName.length > 1
            ? splitName[splitName.length - 2][0] + splitName[splitName.length - 1][0]
            : nameU[0];
    };

    return (
        <div className={cx(['wrapper', `bgA_${bgRand}`])}>
            <span>{sumaryU()}</span>
        </div>
    );
}

export default AvatarAuto;
