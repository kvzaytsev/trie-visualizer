import { createStore, combineReducers } from 'redux';
import * as reducers from './reducers';

const initialState = {
    trie: {}
};
const store = createStore(combineReducers(reducers), initialState);

export default store;