import { useReducer } from 'react';
import Context from './Context';
import reducer, { initialState } from './reducer';
import LoadingOverlay from 'react-loading-overlay-ts';
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader';

// import classNames from 'classnames/bind';
import '../PageLoading.css';

// const cx = classNames.bind(styles)

function Provider({ children }) {
    const [isLoading, dispatch] = useReducer(reducer, initialState);
    // console.log(isLoading);
    return (
        <LoadingOverlay
            // styles={{
            //     wrapper: {
            //         width: '400px',
            //         height: '400px',
            //         // overflow: active ? 'hidden' : 'scroll',
            //     },
            // }}
            active={isLoading}
            spinner={
                <div
                    style={{
                        marginBottom: '14px',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <ClimbingBoxLoader color="#FFFFFF" />
                </div>
            }
            // spinner
            text="Chờ xíu nhe má!!! Duma ngồi chờ xí thôi"
        >
            <Context.Provider value={[isLoading, dispatch]}>{children}</Context.Provider>
        </LoadingOverlay>
    );
}

export default Provider;
