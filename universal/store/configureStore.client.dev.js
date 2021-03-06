/**
 * Created by x22a on 25.02.16.
 */

import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { routerReducer } from 'react-router-redux';
import objectAssign from 'object-assign';

import DevTools from '../containers/devTools';
import reducers from '../reducers';

// Grab the state from a global injected into server-generated HTML
const initialState = window.__INITIAL_STATE__;

const rootReducer = combineReducers(objectAssign({}, reducers, {
    routing: routerReducer,
}));

const loggerMiddleware = createLogger({
    level: 'info',
    collapsed: true,
});

const enhancer = compose(
    applyMiddleware(thunkMiddleware, loggerMiddleware),
    DevTools.instrument()
);

const store = createStore(rootReducer, initialState, enhancer);

if (module.hot) {
    module.hot.accept('../reducers', () =>
        store.replaceReducer(combineReducers({
            routing: routerReducer,
            app: require('../reducers'),
        }))
    );
}

export default store;
