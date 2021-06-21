import { combineReducers, createStore, applyMiddleware } from 'redux'
import { userState } from './reducers/user'
import thunk from 'redux-thunk'

const Reducers = combineReducers({
    userState: userState,
});

export const store = createStore(Reducers, applyMiddleware(thunk))