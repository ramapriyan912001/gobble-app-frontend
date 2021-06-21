import { USER_STATE_CHANGE, CLEAR_DATA, LOGGING_IN, LOGGING_OUT, GIVE_ADMIN_ACCESS, REMOVE_ADMIN_ACCESS} from './types'
import firebase from 'firebase'
import firebaseSvc from '../../firebase/FirebaseSvc'
require('firebase/firestore')

export function clearData() {
    return ((dispatch) => {
        dispatch({type: CLEAR_DATA})
    })
}

export function fetchUser() {
    return (dispatch) => {
        firebaseSvc.userRef(firebaseSvc.currentUser().uid).on("value",
            (snapshot) => {
                dispatch({type: USER_STATE_CHANGE, currentUser: snapshot.val()})
                console.log(snapshot.data)
            }
        )
    }
}

export const getError = (props) => (err) => {
    console.warn('Insufficient data');
    Alert.alert('Registration Error: ' + err.message);
    props.navigation.navigate('Register');
    return {};
};

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