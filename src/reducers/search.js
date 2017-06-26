import { SEARCH } from '../action-types';

const search = (state = {}, action) => {
    switch (action.type) {
        case SEARCH:
            return action.payload;
        default:
            return state;
    }
};

export default search;