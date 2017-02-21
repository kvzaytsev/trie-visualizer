import { createStore, combineReducers } from 'redux';
import * as reducers from './reducers';
import {textMock} from  './mocks';

const initialState = {
    searchMask: "",
    text: textMock
};

const store = createStore(
    combineReducers(reducers),
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;