export const formatPrice = (price) => {
    if (Number.isFinite(price)) {
        return price.toLocaleString('vi', { style: 'currency', currency: 'VND' });
    }
    return 'Tham số không phải số';
};

export const priceDiscount = (price, discount) => {
    return price - price * (discount / 100);
};

export const expectedDate = (day) => {
    // const splitD = d.split('/');
    // const D = 1706322872160;
    const currentDate = new Date(day);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let date = currentDate.getDate();
    let month = currentDate.getMonth();
    const monthAbbreviation = monthNames[month];

    let year = currentDate.getFullYear();
    return `${date} ${monthAbbreviation}, ${year}`;
};
