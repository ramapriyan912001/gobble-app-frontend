import React, {useState} from 'react'
import {Text, View, TextInput, Image, TouchableOpacity, Alert, SafeAreaView} from 'react-native'
import {StatusBar} from 'expo-status-bar'
import {imageStyles, inputStyles, buttonStyles, profileStyles, containerStyles} from '../styles/LoginStyles'
import {API} from '../api'
import deviceStorage from '../services/deviceStorage'
import jwt from 'expo-jwt';

// let userInfo = {
//     name: 'User',
//     dob: 'Loading...',
//     diet: 'Loading...',
//     cuisine:  'Loading...',
//     crossIndustry: false,
//     email: 'Loading...',
// };

export default function Profile(props) {
    async function findUserInfo() {
        let userInfo = {
            name: 'User',
            dob: 'Loading...',
            diet: 'Loading...',
            cuisine:  'Loading...',
            crossIndustry: false,
            email: 'Loading...',
        };

        await deviceStorage
        .loadJWT()
        .then(async token => {
            let payload = 
            jwt
            .decode(
            token, // the token
            'iuewifu398b', // the secret - find safer place to store
            );
            
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            await API
            .get( 
                `users/${payload.userID}`,
                config
            )
            .then(user => userInfo = user.data)
            .catch(err => console.log(err.response.data.message));
        })
        .catch(console.log);
        return userInfo;
    }
    // const isAdmin = payload.isAdmin;
    let userInfo = findUserInfo(); //ISSUE: this is async, so its a promise not a json. Need to correspondingly pass to all the text boxes below
    const crossIndustry = userInfo.crossIndustry? 'Sure!' : 'Rather Not'
    const dateString = userInfo.dob;
    console.log(userInfo);
    return(
                <SafeAreaView style={containerStyles.container}>
                    <StatusBar style="auto"/>
                    <Text style={inputStyles.headerText}>{userInfo.then(u => u.name)}'s Profile</Text>
                    <Image style={profileStyles.profilePic}/>
                    <Text style={profileStyles.profileField}>Born on {userInfo.then(u => u.dob)}</Text>
                    <Text style={profileStyles.profileField}>Your email is {userInfo.then(u => u.email)}</Text>
                    <Text style={profileStyles.profileField}>Your dietary restriction is {userInfo.then(u => u.diet)}</Text>
                    <Text style={profileStyles.profileField}>Your favorite cuisine is {userInfo.then(u => u.cuisine)}</Text>
                    <Text style={profileStyles.profileField}>Cross-Industrial meetings? {userInfo.then(u => u.crossIndustry)}</Text>
                    <TouchableOpacity style={buttonStyles.loginButton} onPress={() => props.navigation.navigate('ChatRoom')}>
                        <Text style={buttonStyles.loginButtonText}>Chats</Text>
                    </TouchableOpacity>
                </SafeAreaView>
    )
}