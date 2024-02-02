import Home from '~/pages/Home';
import Product from '~/pages/Product';
import Login from '~/pages/Login';
import Signup from '~/pages/Signup';
import Cart from '~/pages/Cart';
import Profile from '~/pages/Profile';
// import LoginSignUp from '~/components/Layout/LoginSignup';
import { DefaultLayout, HasSidebar, LoginSignup, User } from '~/components/Layout';
import DetailProduct from '~/pages/DetailProduct';
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/product', component: Product, layout: HasSidebar },
    { path: '/register', component: Signup, layout: LoginSignup },
    { path: '/login', component: Login, layout: LoginSignup },
    { path: '/product/:id', component: DetailProduct, layout: DefaultLayout },
    { path: '/user/cart', component: Cart, layout: DefaultLayout },
];

const privateUserAccount = [{ path: '/user/profile', component: Profile, layout: DefaultLayout }];

const privateRoutes = [];

export { publicRoutes, privateUserAccount };
