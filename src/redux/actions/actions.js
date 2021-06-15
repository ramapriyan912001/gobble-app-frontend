import { USER_STATE_CHANGE, CLEAR_DATA, LOGGING_IN, LOGGING_OUT, GIVE_ADMIN_ACCESS, REMOVE_ADMIN_ACCESS} from './types'
import firebase from 'firebase'
import { SnapshotViewIOSComponent } from 'react-native'
require('firebase/firestore')

export function clearData() {
    return ((dispatch) => {
        dispatch({type: CLEAR_DATA})
    })
}

export function fetchUser() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() })
                }
                else {
                    console.log('does not exist')
                }
            })
    })
}

export function updateUserDetails(updatedUser) {
    return ((dispatch) => {
        dispatch({type: USER_STATE_CHANGE, currentUser: updatedUser})
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