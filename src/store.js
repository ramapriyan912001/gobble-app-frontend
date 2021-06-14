import {createStore, combineReducers} from 'redux'

const AppReducer = combineReducers({
    user: LoginReducer
})

// export const configureStore = () => createStore(AppReducer)
