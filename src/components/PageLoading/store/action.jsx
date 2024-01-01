// import { useState, useCallback, useContext } from 'react';
// import LoadingOverlay from 'react-loading-overlay-ts';

import { SET_LOADING } from './constant';

export const setLoading = (payload) => {
    return {
        type: SET_LOADING,
        payload,
    };
};
