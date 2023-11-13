import Home from '~/pages/Home';
import Product from '~/pages/Product';
import Login from '~/pages/Login';
import Signup from '~/pages/Signup';
// import LoginSignUp from '~/components/Layout/LoginSignup';
import { HasSidebar, LoginSignup } from '~/components/Layout';
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/product', component: Product, layout: HasSidebar },
    { path: '/register', component: Signup, layout: LoginSignup },
    { path: '/login', component: Login, layout: LoginSignup },
];

const privateRoutes = [];

export { publicRoutes };
