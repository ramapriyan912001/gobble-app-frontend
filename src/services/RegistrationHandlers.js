import firebaseSvc from "../firebase/FirebaseSvc";
import { Alert } from 'react-native';

export function createUserProfile() {//factory method
    return {
        name: '',
        email: '',
        password: '',
        avatar: '',
        cuisine: '',
        diet: '',
        crossIndustrial: false,
        dob: new Date().toDateString()
    };
}

export const onFailure = (level) => (err) => console.warn(level + ' error: ' + err.message);
    
export const onSuccess = (level) => () => console.log(level + ' successfully done');

export const cancelRegistration = (props) => {
    firebaseSvc.updateUserCollection(null, onSuccess('User Collection Delete'), onFailure('User Collection Delete'));
    if (!firebaseSvc.deleteUser()) {
        Alert.alert('Unable to delete profile, please re-authenticate for ' + firebaseSvc.currentUser().email);
        props.navigation.navigate('Reauthenticate');
    } else {
        console.log('Cancelled Registration - Back to Login');
        props.navigation.navigate('Login');
    }
};

export const getError = (props) => (err) => {
    console.warn('Insufficient data');
    Alert.alert('Registration Error: ' + err.message);
    props.navigation.navigate('Register');
    return {};
};