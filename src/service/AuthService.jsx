export const isAuthenticated = () => {
    const user = localStorage.getItem('token');
    // Neu khong ton tai token trong localStorage => Chua dang nhap thanh cong
    if (!user) {
        return {};
    }
    return JSON.parse(user);
};
