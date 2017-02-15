import ACTION_TYPES from '../action-types';

const createTrie = (searchMask) => {
    return {
        type: ACTION_TYPES.SEARCH,
        payload: searchMask,
    }
};

export default createTrie;