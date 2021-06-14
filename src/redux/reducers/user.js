import { USER_STATE_CHANGE, CLEAR_DATA, LOGGING_IN, 
    GIVE_ADMIN_ACCESS, REMOVE_ADMIN_ACCESS, LOGGING_OUT} from "../actions/types"

const initialState = {
    currentUser: {},
    loggedIn: false,
    isAdmin: false
}

export const userState = (state = initialState, action) => {
    switch (action.type) {
        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser
            }
        case CLEAR_DATA:
            return initialState
        case LOGGING_IN:
            return {
                ...state,
                loggedIn: true
            }
        case LOGGING_OUT:
            return {
                ...state,
                loggedIn: false
            }
        case GIVE_ADMIN_ACCESS:
            return {
                ...state,
                isAdmin: true
            }
        case REMOVE_ADMIN_ACCESS:
            return {
                ...state,
                isAdmin: false
            }
        default:
            return state;
    }
}