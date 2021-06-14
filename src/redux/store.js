import { combineReducers, createStore } from 'redux'
import { userState } from './user'

const Reducers = combineReducers({
    userState: userState,
});

export default createStore(Reducers)