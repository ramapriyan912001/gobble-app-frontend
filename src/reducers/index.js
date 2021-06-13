import { combineReducers, createStore } from 'redux'
import { user } from './user'

const Reducers = combineReducers({
    userState: user,
});

export default createStore(Reducers)