import ACTION_TYPES from '../action-types';

const createTrie = (trie) => {
    return {
        type: ACTION_TYPES.CREATE_TRIE,
        payload: trie,
    }
};

export default createTrie;