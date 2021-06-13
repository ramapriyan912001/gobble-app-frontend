
import React, {useEffect, useState, useCallback} from 'react'
import {Text, Image, TouchableOpacity, SafeAreaView} from 'react-native'
import {StatusBar} from 'expo-status-bar'
import {inputStyles, buttonStyles, profileStyles, containerStyles} from '../styles/LoginStyles'
import {API} from '../api'
import deviceStorage from '../services/deviceStorage'
import jwt from 'expo-jwt';
import firebaseSvc from '../reducers/FirebaseSvc'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, clearData } from '../actions/index'

export function Profile(props) {
    const [appIsReady, setAppIsReady] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [avatar, setAvatar] = useState('');
    // async function loadDataAsync () {
    //     await deviceStorage
    //         .loadJWT()
    //         .then(async token => {
    //             let payload = 
    //             jwt
    //             .decode(
    //             token, // the token
    //             'iuewifu398b', // the secret - find safer place to store
    //             { timeSkew: 60 }
    //             );
                
    //             const config = {
    //                 headers: { Authorization: `Bearer ${token}` }
    //             };

    //             await API
    //             .get( 
    //                 `users/${payload.userID}`,
    //                 config
    //             )
    //             .then(user => {
    //                 let temp = user.data.user;
    //                 const crossIndustryText = temp.crossIndustry? 'Yes!' : 'None';
    //                 temp.crossIndustry = crossIndustryText;
    //                 setUserInfo(temp);})
    //             .catch(err => console.log(err));
    //         })
    //         .then(() => setAppIsReady(true))
    //         .catch(console.log);
    //     };
    async function loadDataAsync () {
        setUserInfo(firebaseSvc.currentUser());
        if (userInfo === null) {
            props.navigation.goBack();
        }
        setAvatar(firebaseSvc.currentUser().photoURL);
        setAppIsReady(true);
    }

    useEffect(() => {
        loadDataAsync();
    },[]);


    if (!appIsReady) {//effect loads data, NO WARNINGS !! :)
        return null;
    }

    return(
        <SafeAreaView style={containerStyles.container}>
            <StatusBar style="auto"/>
            <Text style={inputStyles.headerText}>{userInfo.displayName}'s Profile</Text>
            <Image style={profileStyles.profilePic} source={{uri:avatar}}/>
            <Text style={profileStyles.profileField}>Your email is {userInfo.email}</Text>
            <TouchableOpacity style={buttonStyles.loginButton} onPress={() => props.navigation.navigate('ChatRoom')}>
                <Text style={buttonStyles.loginButtonText}>Chats</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buttonStyles.loginButton} onPress={() => props.navigation.goBack()}>
                <Text style={buttonStyles.loginButtonText}>Sign Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );  
}
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUser, clearData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(Profile);
//TODO: Find out how to add different fields to a user and how to access them
// <Text style={profileStyles.profileField}>Your dietary restriction is {userInfo.diet}</Text>
// <Text style={profileStyles.profileField}>Your favorite cuisine is {userInfo.cuisine}</Text>
// <Text style={profileStyles.profileField}>Cross-Industrial meetings? {userInfo.crossIndustry}</Text>

