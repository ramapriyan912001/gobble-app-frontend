
import React, {useEffect, useState, useCallback} from 'react'
import {Text, Image, TouchableOpacity, SafeAreaView, Alert, View, Button} from 'react-native'
import {StatusBar} from 'expo-status-bar'
import {inputStyles, buttonStyles, profileStyles, containerStyles} from '../../styles/LoginStyles'
import { getError, onSuccess, onFailure } from '../../services/RegistrationHandlers'
import firebaseSvc from '../../firebase/FirebaseSvc'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, clearData, updateUserDetails } from '../../redux/actions/actions'

export function Profile(props) {
    const [appIsReady, setAppIsReady] = useState(false);
    const [userInfo, setUserInfo] = useState({});

    const signOutSuccess = () => {
        console.log('Signed Out');
        props.navigation.navigate('Login');
    }

    const signOutFailure = (err) => {
        console.warn('Sign Out Error: ' + err.message);
        Alert.alert('Sign Out Error. Try Again Later');
    }
    
    const signOutUser = () => firebaseSvc.signOut(signOutSuccess, signOutFailure);

    async function loadDataAsync () {
        const user = await firebaseSvc
                            .getUserCollection(
                                (snapshot) => snapshot.val(),
                                getError(props))
                            .then(x => x)
                            .catch(getError(props));
        setUserInfo(user);
        if (userInfo === null) {
            props.navigation.goBack();
        }
    }

    useEffect(() => {
        loadDataAsync();
    },[]);

    // if (!appIsReady) {//effect loads data, NO WARNINGS !! :)
    //     return null;
    // }

    return(
        <SafeAreaView style={containerStyles.container}>
            <StatusBar style="auto"/>
            <Text style={inputStyles.headerText}>{userInfo.name}'s Profile</Text>
            <Image style={profileStyles.profilePic} source={{uri:userInfo.avatar}}/>
            <Text style={profileStyles.profileField}>Your dietary restriction is {userInfo.diet}</Text>
            <Text style={profileStyles.profileField}>Your favorite cuisine is {userInfo.cuisine}</Text>
            <Text style={profileStyles.profileField}>Cross-Industrial meetings? {userInfo.crossIndustry?'Sure!':'Nope!'}</Text>           
            <Text style={profileStyles.profileField}>{userInfo.email}</Text>
            <TouchableOpacity style={buttonStyles.loginButton} onPress={() => props.navigation.navigate('UpdateProfile')}>
                <Text style={buttonStyles.loginButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buttonStyles.loginButton} onPress={() => {
                signOutUser
                props.navigation.navigate('Login')}}>
                <Text style={buttonStyles.loginButtonText}>Sign Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );  
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    loggedIn: store.userState.loggedIn,
    isAdmin: store.userState.isAdmin
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUser }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(Profile);
//TODO: Find out how to add different fields to a user and how to access them
// <Text style={profileStyles.profileField}>Your dietary restriction is {userInfo.diet}</Text>
// <Text style={profileStyles.profileField}>Your favorite cuisine is {userInfo.cuisine}</Text>
// <Text style={profileStyles.profileField}>Cross-Industrial meetings? {userInfo.crossIndustry}</Text>

