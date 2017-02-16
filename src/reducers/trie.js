import ACTION_TYPES from '../action-types';

const trie = (state = {}, action) => {
    switch (action.type) {
        case ACTION_TYPES.CREATE_TRIE:
            return Object.assign({}, state, action.payload);
        default:
            return state;
    }
};

export default trie;