import { publicRoutes } from './routes';
import { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { DefaultLayout } from '~/components/Layout';
function App() {
    return (
        // Định tuyến Router: BrownserRouter
        <Router>
            <div className="App">
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
            </div>
        </Router>
    );
}

export default App;
