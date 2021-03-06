import { USER_STATE_CHANGE, CLEAR_DATA, LOGGING_IN, 
    GIVE_ADMIN_ACCESS, REMOVE_ADMIN_ACCESS, LOGGING_OUT, USER_DATA_CHANGE, GET_PENDING_MATCHES_LIST, GET_MATCHES_LIST} from "../actions/types"

const initialState = {
    currentUserState: {},
    currentUserData: {},
    loggedIn: false,
    isAdmin: false,
    awaitingMatches: {},
    matches: {}
}

export const userState = (state = initialState, action) => {
    switch (action.type) {
        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUserState: action.currentUserState
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
        case USER_DATA_CHANGE:
            return {
                ...state,
                currentUserData: action.currentUserData
            }
        case GET_PENDING_MATCHES_LIST:
            return {
                ...state,
                awaitingMatches: action.awaitingMatches
            }
        case GET_MATCHES_LIST:
            return {
                ...state,
                matches: action.matches
            }
        default:
            return state;
    }
}