export const formatPrice = (price) => {
    if (Number.isFinite(price)) {
        let result = price / 25000;
        return result.toFixed(2).toLocaleString('en-US', { style: 'currency', currency: '$' });
    }
    return 'Tham số không phải số';
};

export const priceDiscount = (price, discount) => {
    return price - price * (discount / 100);
};
