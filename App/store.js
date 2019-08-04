import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger'
import rootReducer from './reducers'

const initialState = {}

const logger = createLogger({
    //empty options
});

const middleware = [thunk];

const store = createStore(
    rootReducer, 
    initialState, 
    applyMiddleware(...middleware)
);

export default store;