import ACTION_TYPES from '../action-types';

const trie = (state = '', action) => {
    switch (action.type) {
        case ACTION_TYPES.TEXT_CHANGED:
            return action.payload;
        default:
            return state;
    }
};

export default trie;