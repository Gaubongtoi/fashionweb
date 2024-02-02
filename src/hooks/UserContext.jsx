import { createContext, useState, useEffect } from 'react';
import { isAuthenticated } from '~/service/AuthService';
// Khoi tao UserContext bang createContext
const UserContext = createContext();
// Khoi tao Provider
const UserProvider = ({ children }) => {
    // Khoi tao bien State de luu tru trang thai nguoi dung
    const [currentUser, setCurrentUser] = useState(null);
    const [cart, setCart] = useState([]);
    // console.log(JSON.parse(cart));
    const state = {
        cart: {
            value: cart,
            setCart,
        },
        cuser: {
            value: currentUser,
            setCurrentUser,
        },
    };
    // useEffect se duoc goi moi khi Component Mounted lan dau tien
    // Y tuong: Se boc lai toan bo Web (index.js) => Toan bo children trong UserProvider se duoc phep su dung
    // nhung gia tri duoc truyen trong prop value cua Component UserContext.Provider cung nhu useEffect
    useEffect(() => {
        const checkedLogin = async () => {
            // tien hanh kiem tra de cap quyen truy cap
            // Ham isAuthenticated co the tra ve hai gia tri: null (trong truong hop ko co token)
            // va tra ve 1 token da duoc parse(da duoc xu ly ben ham isAuthenticated)
            let cuser = isAuthenticated();
            // Neu cuser tra ve null =>
            if (cuser === null) {
                // Tien hanh lam rong lai localStorage
                localStorage.removeItem('user');
                cuser = '';
            }
            // Set lai state cho currentUser
            setCurrentUser(cuser);
        };
        checkedLogin();
    }, []);

    useEffect(() => {
        if (!Boolean(localStorage.getItem('cart'))) {
            localStorage.setItem('cart', JSON.stringify([]));
        }
        // const cart = localStorage.getItem('cart');
        let cart = JSON.parse(localStorage.getItem('cart'));
        setCart(cart);
    }, []);
    //
    // console.log(currentUser);
    return (
        <UserContext.Provider value={state}>
            {children}
            {/* Logic: 
            + Neu nhu ton tai token thi no se duoc Routes, con neu khong se bat buoc phai Login truoc khi duoc quyen truy cap
            {currentUser ? children : <Login/>}
        */}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };
