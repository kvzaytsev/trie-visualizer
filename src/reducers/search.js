import ACTION_TYPES from '../action-types';

const search = (state = {}, action) => {
    switch (action.type) {
        case ACTION_TYPES.SEARCH:
            return action.payload;
        default:
            return state;
    }
};

export default search;