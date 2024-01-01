import Home from '~/pages/Home';
import Product from '~/pages/Product';
import Login from '~/pages/Login';
import Signup from '~/pages/Signup';
// import LoginSignUp from '~/components/Layout/LoginSignup';
import { DefaultLayout, HasSidebar, LoginSignup } from '~/components/Layout';
import DetailProduct from '~/pages/DetailProduct';
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/product', component: Product, layout: HasSidebar },
    { path: '/register', component: Signup, layout: LoginSignup },
    { path: '/login', component: Login, layout: LoginSignup },
    { path: '/product/:id', component: DetailProduct, layout: DefaultLayout },
];

const privateRoutes = [];

export { publicRoutes };
