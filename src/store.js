import {createStore, combineReducers} from 'redux'
import LoginReducer from './reducers/LoginReducer'

const AppReducer = combineReducers({
    loginReducer: LoginReducer
})

const configureStore = () => createStore(AppReducer)

export default configureStore