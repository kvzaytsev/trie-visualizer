import { createStore, combineReducers } from 'redux';
import * as reducers from './reducers';

const initialState = {
    trie: {},
    searchMask: ""
};
const store = createStore(
    combineReducers(reducers),
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;