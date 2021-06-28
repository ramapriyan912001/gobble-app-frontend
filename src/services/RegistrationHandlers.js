import firebaseSvc from "../firebase/FirebaseSvc";
import { Alert } from 'react-native';
import { INDUSTRY_CODES } from "../constants/objects";
//TODO: Shift to redux 

/**
 * Creates new User Object
 * @returns Empty Geneir User Object
 */
export function createUserProfile() {//factory method
    return {
        name: '',
        email: '',
        avatar: '',
        cuisine: '',
        diet: '',
        industry: 0,
        crossIndustrial: false,
        dob: new Date().toDateString(),
        match_list:[],
        blocked_users:[],
        completed:false,
    };
}

/**
 * Curried Generic Failure Handler
 * 
 * @param {*} level Error Level
 * @returns Level-based Failure Handler
 */
export const onFailure = (level) => (err) => console.log(level + ' error: ' + err.message);
    
/**
 * Curried Generic Success Handler
 * 
 * @param {*} level Success Level
 * @returns level-based success handler
 */
export const onSuccess = (level) => () => console.log(level + ' successfully done');

/**
 * Function to delete user from authentication database
 * 
 * @param {*} props Props passed from parent screen (Register)
 */
const deleteAuthUser = (props) => {
    const deleteSuccess = () => {
        console.log('Cancelled Registration - Back to Login');
        return;
    };
    const deleteFailure = (err) => {
        if (err.code === 'auth/requires-recent-login') {
            Alert.alert('Unable to delete profile created, please re-authenticate for ' + firebaseSvc.currentUser().email);
            const cleanupFunction = () => deleteAuthUser(props);
            props.navigation.navigate('Reauthenticate', {cleanup: cleanupFunction});
        } else {
            console.log('DeleteAuthUserError: ' + err.message);
        }
    };

    firebaseSvc.deleteUser(deleteSuccess, deleteFailure);
};

/**
 * Cancel the Registration of a user
 * 
 * @param {*} props Props from Parent Screen (Register)
 */
export const cancelRegistration = (props) => {
    const userData = firebaseSvc.getCurrentUserCollection((snapshot) => snapshot.val(), err => console.log('GetError: ' + err.message));
    if (userData != null) {
        userData
        .then((user) => {
            if (user != null) { 
                if (!user.completed) {
                firebaseSvc.updateCurrentUserCollection(null, onSuccess('User Collection Delete'), onFailure('User Collection Delete'));
                deleteAuthUser();
                } else {
                    console.log('Complete User Exists - No need to delete');
                    props.navigation.navigate('Login');            
                }
            } else {
                console.log('Only Auth to be deleted');
                deleteAuthUser(props);
                props.navigation.navigate('Login');
            }
        })
        .catch(err => console.log(err.message));
    } else {
        console.log('Complete User Exists - No need to delete');
        props.navigation.navigate('Login');
    }
};

/**
 * Error Handler for the Register
 * 
 * @param {*} props 
 * @returns 
 */
export const getError = (props) => (err) => {
    console.log('Insufficient data');
    Alert.alert('Registration Error: ' + err.message);
    props.navigation.navigate('Register');
    return {};
};