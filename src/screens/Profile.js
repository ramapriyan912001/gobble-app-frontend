import React, {useEffect, useState, useCallback} from 'react'
import {Text, Image, TouchableOpacity, SafeAreaView} from 'react-native'
import {StatusBar} from 'expo-status-bar'
import {inputStyles, buttonStyles, profileStyles, containerStyles} from '../styles/LoginStyles'
import {API} from '../api'
import deviceStorage from '../services/deviceStorage'
import jwt from 'expo-jwt';

export default function Profile(props) {
    const [appIsReady, setAppIsReady] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    async function loadDataAsync () {
        await deviceStorage
            .loadJWT()
            .then(async token => {
                let payload = 
                jwt
                .decode(
                token, // the token
                'iuewifu398b', // the secret - find safer place to store
                { timeSkew: 60 }
                );
                
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                await API
                .get( 
                    `users/${payload.userID}`,
                    config
                )
                .then(user => {
                    let temp = user.data.user;
                    const crossIndustryText = temp.crossIndustry? 'Yes!' : 'None';
                    temp.crossIndustry = crossIndustryText;
                    setUserInfo(temp);})
                .catch(err => console.log(err));
            })
            .then(() => setAppIsReady(true))
            .catch(console.log);
        };
    
    useEffect(() => {
        loadDataAsync();
    },[]);


    if (!appIsReady) {//effect loads data, NO WARNINGS !! :)
        return null;
    }

    return(
        <SafeAreaView style={containerStyles.container}>
            <StatusBar style="auto"/>
            <Text style={inputStyles.headerText}>{userInfo.name}'s Profile</Text>
            <Image style={profileStyles.profilePic}/>
            <Text style={profileStyles.profileField}>Born on {userInfo.dob}</Text>
            <Text style={profileStyles.profileField}>Your email is {userInfo.email}</Text>
            <Text style={profileStyles.profileField}>Your dietary restriction is {userInfo.diet}</Text>
            <Text style={profileStyles.profileField}>Your favorite cuisine is {userInfo.cuisine}</Text>
            <Text style={profileStyles.profileField}>Cross-Industrial meetings? {userInfo.crossIndustry}</Text>
            <TouchableOpacity style={buttonStyles.loginButton} onPress={() => props.navigation.navigate('ChatRoom')}>
                <Text style={buttonStyles.loginButtonText}>Chats</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buttonStyles.loginButton} onPress={() => props.navigation.goBack()}>
                <Text style={buttonStyles.loginButtonText}>Sign Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );  
}