export const isAuthenticated = () => {
    const user = localStorage.getItem('user');
    // console.log(user[0]);
    // Neu khong ton tai token trong localStorage => Chua dang nhap thanh cong
    if (!user || user.length <= 0) {
        return null;
    }
    return JSON.parse(user);
};
