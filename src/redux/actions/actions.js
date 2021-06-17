import { USER_STATE_CHANGE, USER_DATA_CHANGE, CLEAR_DATA, LOGGING_IN, LOGGING_OUT, GIVE_ADMIN_ACCESS, REMOVE_ADMIN_ACCESS} from './types'
import firebase from 'firebase'
import { SnapshotViewIOSComponent } from 'react-native'
import firebaseSvc from '../../firebase/FirebaseSvc'

export function clearData() {
    return ((dispatch) => {
        dispatch({type: CLEAR_DATA})
    })
}

export function fetchAuthUser() {
    return ((dispatch) => dispatch({ type: USER_STATE_CHANGE, currentUser: firebaseSvc.currentUser() }));
}

export function fetchUserData() {
    return ((dispatch) => dispatch({ type: USER_DATA_CHANGE, currentUser: firebaseSvc.getUserCollection(snapshot => snapshot.val(), err => console.log(err.message)) }));
}

export function updateUserDetails(updatedUser) {
    return ((dispatch) => {
        firebaseSvc.updateUserProfile(updatedUser, () => console.log('user updated'), (err) => console.log(err.message));
        dispatch({type: USER_STATE_CHANGE, currentUser: updatedUser})
    })
}

export function updateUserCollection(updatedUser) {
    return ((dispatch) => {
        firebaseSvc.updateUserCollection(updatedUser, () => console.log('user collection updated'), (err) => console.log(err.message));
        dispatch({type: USER_DATA_CHANGE, currentUser: updatedUser})
    })
}

export function login() {
    return ((dispatch) => {
        dispatch({type: LOGGING_IN})
    })
}

export function logout() {
    return ((dispatch) => {
        dispatch({type: LOGGING_OUT})
    })
}

export function giveAdminAccess() {
    return ((dispatch) => {
        dispatch({type: GIVE_ADMIN_ACCESS})
    })
}

export function removeAdminAccess() {
    return ((dispatch) => {
        dispatch({type: REMOVE_ADMIN_ACCESS})
    })
}