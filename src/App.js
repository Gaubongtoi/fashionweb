import { publicRoutes } from './routes';
import { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay-ts';

import 'react-toastify/dist/ReactToastify.css';
import { DefaultLayout } from '~/components/Layout';

function App() {
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
                    </Routes>
                </Router>
            </div>
            <div></div>
        </>
        // Định tuyến Router: BrownserRouter
    );
}

export default App;
