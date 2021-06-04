import {createStore, combineReducers} from 'redux'
import LoginReducer from './reducers/LoginReducer'

const AppReducer = combineReducers({
    loginReducer: LoginReducer
})

// export const configureStore = () => createStore(AppReducer)
