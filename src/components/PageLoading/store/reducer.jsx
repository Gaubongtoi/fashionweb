import { SET_LOADING } from './constant';

export const initialState = false;

const reducer = (state, action) => {
    switch (action.type) {
        // ...
        case SET_LOADING:
            return action.payload;
        default:
            throw new Error(`Invalid ${action}`);
    }
};

export default reducer;
