import React, {useState} from 'react'
import {Text, View, TextInput, Image, TouchableOpacity, Alert, SafeAreaView} from 'react-native'
import {StatusBar} from 'expo-status-bar'
import {imageStyles, inputStyles, buttonStyles, containerStyles} from '../styles/LoginStyles'
import {API} from '../api'
import deviceStorage from '../services/deviceStorage'
import Base64 from 'Base64';

let userInfo = {
    name: '',
    dob: '',
    diet: 'Halal',
    cuisine:  'Indian',
    crossIndustry: false,
    email: '',
};

export default function Profile(props) {
    const token = deviceStorage.loadJWT();
    const payload = Base64.atob(token);
    // const isAdmin = payload.isAdmin;
    console.log(payload);
    
    async function findUserInfo(){
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        await API
        .get( 
            `users/${payload.userID}`,
            config
        )
        .then(
            user => userInfo = user
            // {
            //     userInfo.image = user.image;
            //     userInfo.name = user.name;
            //     userInfo.dob = user.dob;
            //     userInfo.diet = user.diet;
            //     userInfo.cuisine = user.cuisine;
            //     userInfo.crossIndustry = user.crossIndustry;
            //     userInfo.email = user.email;
            // }
        )
        .catch(console.log);
      
    };

    const crossIndustry = userInfo.crossIndustry? 'ok' : 'not ok'
    return(
                <SafeAreaView>
                    <StatusBar style="auto"/>
                    <Text style={inputStyles.headerText}>{userInfo.name}'s Profile</Text>
                    <Image style={profileStyles.profilePic} source={userInfo.image}/>
                    <Text style={profileStyles.profileField}>Born on {userInfo.dob}</Text>
                    <Text style={profileStyles.profileField}>Your email is {userInfo.email}</Text>
                    <Text style={profileStyles.profileField}>Your dietary restriction is {userInfo.diet}</Text>
                    <Text style={profileStyles.profileField}>Your favorite cuisine is {userInfo.cuisine}</Text>
                    <Text style={profileStyles.profileField}>You are {crossIndustry} with meeting other industrial backgrounds!</Text>
                    <TouchableOpacity style={buttonStyles.loginButton} onPress={() => props.navigation.navigate('ChatRoom')}>
                        <Text style={buttonStyles.loginButtonText}>Chat</Text>
                    </TouchableOpacity>
                </SafeAreaView>
    )
}


