import { publicRoutes, privateUserAccount } from './routes';
import { Fragment, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay-ts';

import 'react-toastify/dist/ReactToastify.css';
import { DefaultLayout, LayoutUserInfor } from '~/components/Layout';
import { UserContext } from './hooks/UserContext';
import Profile from './pages/Profile';
import UserOrder from './pages/UserOrder';
import DetailOrder from './pages/DetailOrder';
import ChangePasswordUser from './pages/ChangePasswordUser';
import LayoutAdmin from './components/Layout/LayoutAdmin';
import Admin from './pages/Admin';
import Team from './pages/ManageAccount';
import AddProducts from './pages/AddProducts';
import ManageProduct from './pages/ManageProduct';
import ManageOrder from './pages/ManageOrder';
import Return from './pages/Return';
import UserReturn from './pages/UserReturn';
import DetailRefund from './pages/DetailRefund';
import ManageReturn from './pages/ManageReturn';
import Wishlist from './pages/Wishlist';
function App() {
    const state = useContext(UserContext);
    const [role, setRole] = useState();
    useEffect(() => {
        setRole(state?.cuser?.value?.Role?.id);
        // setRole()
    }, [state?.cuser?.value]);
    return (
        <>
            <div className="App">
                <ToastContainer />
                <Router>
                    <Routes>
                        {publicRoutes.map((route, index) => {
                            // Mặc đinh sẽ là Default Layout
                            let Layout = DefaultLayout;
                            if (route.layout) {
                                Layout = route.layout;
                            } else if (route.layout === null) {
                                Layout = Fragment;
                            }
                            const Page = route.component;
                            return (
                                // 1 Route sẽ chứa các attr bao gồm
                                // path: đường dẫn của trang đó
                                // exact: Giúp route hoạt động nếu URL phù hợp
                                // component:
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            {/* Children Content */}
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        })}
                        {/* Customer */}
                        {(role === 3 || role === 1) && (
                            <>
                                <Route
                                    path="/user/profile"
                                    element={
                                        <DefaultLayout>
                                            <LayoutUserInfor
                                                path={'User Profile'}
                                                title={'Personal Information'}
                                                profile={true}
                                            >
                                                <Profile></Profile>
                                            </LayoutUserInfor>
                                        </DefaultLayout>
                                    }
                                />
                                <Route
                                    path="/user/order"
                                    element={
                                        <DefaultLayout>
                                            <LayoutUserInfor path={'My Orders'} title={'My Orders'} order={true}>
                                                <UserOrder></UserOrder>
                                            </LayoutUserInfor>
                                        </DefaultLayout>
                                    }
                                />
                                <Route
                                    path="/user/order/detail/:id"
                                    element={
                                        <DefaultLayout>
                                            <LayoutUserInfor path={'My Orders'} title={'My Orders'} order={true}>
                                                <DetailOrder></DetailOrder>
                                            </LayoutUserInfor>
                                        </DefaultLayout>
                                    }
                                />
                                <Route
                                    path="/user/order/detail/return/:id"
                                    element={
                                        <DefaultLayout>
                                            <Return></Return>
                                        </DefaultLayout>
                                    }
                                />

                                <Route
                                    path="/user/password"
                                    element={
                                        <DefaultLayout>
                                            <LayoutUserInfor path={'Password'} title={'Password'} password={true}>
                                                <ChangePasswordUser></ChangePasswordUser>
                                            </LayoutUserInfor>
                                        </DefaultLayout>
                                    }
                                />
                                <Route
                                    path="/user/return"
                                    element={
                                        <DefaultLayout>
                                            <LayoutUserInfor path={'Returns'} title={'Returns'} returnn={true}>
                                                <UserReturn></UserReturn>
                                            </LayoutUserInfor>
                                        </DefaultLayout>
                                    }
                                />
                                <Route
                                    path="/user/return/detail/:id"
                                    element={
                                        <DefaultLayout>
                                            <LayoutUserInfor path={'Returns'} title={'Returns'} returnn={true}>
                                                <DetailRefund></DetailRefund>
                                            </LayoutUserInfor>
                                        </DefaultLayout>
                                    }
                                />
                                <Route
                                    path="/user/wishlist"
                                    element={
                                        <DefaultLayout>
                                            <LayoutUserInfor path={'Wishlist'} title={'Wishlist'} wishlist={true}>
                                                <Wishlist></Wishlist>
                                            </LayoutUserInfor>
                                        </DefaultLayout>
                                    }
                                />
                                <Route
                                    path="/admin"
                                    element={
                                        <LayoutAdmin>
                                            <Admin></Admin>
                                        </LayoutAdmin>
                                    }
                                />
                                <Route
                                    path="/admin/account"
                                    element={
                                        <LayoutAdmin>
                                            <Team></Team>
                                        </LayoutAdmin>
                                    }
                                />
                                <Route
                                    path="/admin/addProduct"
                                    element={
                                        <LayoutAdmin>
                                            <AddProducts></AddProducts>
                                        </LayoutAdmin>
                                    }
                                />
                                <Route
                                    path="/admin/manageProduct"
                                    element={
                                        <LayoutAdmin>
                                            <ManageProduct></ManageProduct>
                                        </LayoutAdmin>
                                    }
                                />
                                <Route
                                    path="/admin/manageOrder"
                                    element={
                                        <LayoutAdmin>
                                            <ManageOrder></ManageOrder>
                                        </LayoutAdmin>
                                    }
                                />
                                <Route
                                    path="/admin/manageReturn"
                                    element={
                                        <LayoutAdmin>
                                            <ManageReturn></ManageReturn>
                                        </LayoutAdmin>
                                    }
                                />
                            </>
                        )}
                    </Routes>
                </Router>
            </div>
            <div></div>
        </>
        // Định tuyến Router: BrownserRouter
    );
}

export default App;
