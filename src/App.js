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
                        {role === 3 && (
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
                                    path="/user/password"
                                    element={
                                        <DefaultLayout>
                                            <LayoutUserInfor path={'Password'} title={'Password'} password={true}>
                                                <ChangePasswordUser></ChangePasswordUser>
                                            </LayoutUserInfor>
                                        </DefaultLayout>
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
