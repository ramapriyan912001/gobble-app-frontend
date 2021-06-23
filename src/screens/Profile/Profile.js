
import React, {useEffect, useState, useCallback} from 'react'
import {Text, Image, TouchableOpacity, SafeAreaView, Alert, View, Button} from 'react-native'
import {StatusBar} from 'expo-status-bar'
import {inputStyles, buttonStyles, profileStyles, containerStyles} from '../../styles/LoginStyles'
import { getError, onSuccess, onFailure, industryCodes } from '../../services/RegistrationHandlers'
import firebaseSvc from '../../firebase/FirebaseSvc'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAuthUser, fetchUserData } from '../../redux/actions/actions'

function Profile(props) {
    const [hasAvatar, setHasAvatar] = useState(false);

    const signOutSuccess = () => {
        console.log('Signed Out');
        props.navigation.navigate('Login');
    }

    const signOutFailure = (err) => {
        console.warn('Sign Out Error: ' + err.message);
        Alert.alert('Sign Out Error. Try Again Later');
    }
    
    const signOutUser = () => firebaseSvc.signOut(signOutSuccess, signOutFailure);

    const loadPic = () => hasAvatar
                            ? (<Image style={profileStyles.profilePic} source={{uri:userInfo.avatar}}/>)
                            : (<Text style={inputStyles.subText}>You haven't chosen any avatar!</Text>)

    async function loadDataAsync () {
        const user = await firebaseSvc
                            .getCurrentUserCollection(
                                (snapshot) => snapshot.val(),
                                getError(props))
                            .then(x => x)
                            .catch(getError(props));
        setUserInfo(user);
        await props.fetchUserData();
        if (userInfo === null) {
            props.navigation.goBack();
        } else if (userInfo.avatar == null || userInfo.avatar === '') {
            //Do Nothing
        } else {
            console.log(userInfo.avatar);
            setHasAvatar(true);
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
            {loadPic()}
            <Text style={profileStyles.profileField}>Your dietary restriction is {userInfo.diet}</Text>
            <Text style={profileStyles.profileField}>Your favorite cuisine is {userInfo.cuisine}</Text>
            <Text style={profileStyles.profileField}>You work in the {industryCodes[userInfo.industry]} industry</Text>
            <Text style={profileStyles.profileField}>Cross-Industrial meetings? {userInfo.crossIndustry?'Sure!':'Nope!'}</Text>           
            <Text style={profileStyles.profileField}>{userInfo.email}</Text>
            <TouchableOpacity style={buttonStyles.loginButton} onPress={() => props.navigation.navigate('UpdateProfile', {name: userInfo.name, email: userInfo.email})}>
                <Text style={buttonStyles.loginButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buttonStyles.loginButton} onPress={() => {
                signOutUser();
                props.navigation.navigate('Login')}}>
                <Text style={buttonStyles.loginButtonText}>Sign Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );  
}

const mapStateToProps = (store) => ({
    currentUserData: store.userState.currentUserData,
    loggedIn: store.userState.loggedIn,
    isAdmin: store.userState.isAdmin
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchAuthUser, fetchUserData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(Profile);
