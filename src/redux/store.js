import { combineReducers, createStore } from 'redux'
import { userState } from './reducers/user'

const Reducers = combineReducers({
    userState: userState,
});

export const store = createStore(Reducers)