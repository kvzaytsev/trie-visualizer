import { TEXT_CHANGED } from '../action-types';

const trie = (state = '', action) => {
    switch (action.type) {
        case TEXT_CHANGED:
            return action.payload;
        default:
            return state;
    }
};

export default trie;