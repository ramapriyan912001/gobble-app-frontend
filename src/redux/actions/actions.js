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
    return ((dispatch) => dispatch({ type: USER_STATE_CHANGE, currentUserState: firebaseSvc.currentUser() }));
}

/**
 * Fetching user data and updating state so multiple firebase calls
 * do not have to be made
 * @returns user object
 */
export function fetchUserData() {
    return (dispatch) => {
        firebaseSvc.userRef(firebaseSvc.currentUser().uid).on("value", (snapshot) => {
            dispatch({ type: USER_DATA_CHANGE, currentUserData: snapshot.val()})
        })
    }
}

export const getError = (props) => (err) => {
    console.log('Insufficient data');
    Alert.alert('Registration Error: ' + err.message);
    props.navigation.navigate('Register');
    return {};
};

export function updateUserDetails(updatedUser) {
    return ((dispatch) => {
        firebaseSvc.updateUserProfile(updatedUser, () => console.log('user updated'), (err) => console.log(err.message));
        dispatch({type: USER_STATE_CHANGE, currentUser: updatedUser})
    })
}

export function updateCurrentUserCollection(updatedUser) {
    return ((dispatch) => {
        firebaseSvc.updateCurrentUserCollection(updatedUser, () => console.log('user collection updated'), (err) => console.log(err.message));
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

export function getPendingMatches(pendingMatches) {
    return ((dispatch) => {
        firebaseSvc.getPendingMatchIDs();
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