import React, {useEffect, useState} from 'react'
import {Text, SafeAreaView, Image, TouchableOpacity, Alert, LogBox} from 'react-native'
import {imageStyles, inputStyles, containerStyles, profileStyles, buttonStyles} from '../styles/LoginStyles'
import deviceStorage from '../services/deviceStorage'
import {API} from '../api'
import jwt from 'expo-jwt';

LogBox.ignoreLogs(['Unhandled promise rejection: Error: Native splash screen is already hidden. Call this method before rendering any view.'])

//TODO: This shouldn't be part of a stack navigator. Users can swipe left from profile page and see this.

export default function Welcome(props) {
    async function postDataAsync() {
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
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'}
                };

                await API
                .put( 
                    `users/${payload.userID}/lastseen`,
                    {
                        lastSeen: Date.now(),
                        method: 'PUT'
                    }
                    ,config
                )
                .then(res => {
                    if (!res.data.success) {
                        Alert.alert('Could not update user details - Network Problem');
                }})
                .catch(err => console.log(err.response.data.message));
            })
            .catch(err => console.log(err));
        };
        
    useEffect(() => {
        postDataAsync();
    },[]);

    return (
        <SafeAreaView style={containerStyles.container}>
            <Text style={inputStyles.headerText}>Welcome to</Text>
            <Image style={imageStyles.gobbleImage} source = {require('../images/gobble.png')}/>
            <Text style={profileStyles.profileField}>Gobble is the app that connects you to the world over a simple meal</Text>
            <Text style={profileStyles.profileField}>Use the Matches Page to search for a Match based on your own criteria</Text>
            <Text style={profileStyles.profileField}>Once you find a match, you can chat with them from your chats screen!</Text>
            <Text style={profileStyles.profileField}>After you confirm the details with your match, it's Gobble time!</Text>
            <Text style={profileStyles.profileField}>Tap Next to Start</Text>
            <TouchableOpacity style={buttonStyles.loginButton}
                        onPress={()=> {props.navigation.navigate('Profile')}}>
                <Text style={buttonStyles.loginButtonText}>Next</Text>
            </TouchableOpacity>
        </SafeAreaView>
        );
};


