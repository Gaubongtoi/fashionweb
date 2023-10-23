import Home from '~/pages/Home';
import Product from '~/pages/Product';
import { HasSidebar } from '~/components/Layout';
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/product', component: Product, layout: HasSidebar },
];

const privateRoutes = [];

export { publicRoutes };
