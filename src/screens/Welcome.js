import React from 'react'
import {Text, View, Image, TouchableOpacity} from 'react-native'
import {imageStyles, inputStyles, containerStyles, buttonStyles} from '../styles/LoginStyles'
import deviceStorage from '../services/deviceStorage'

export default function Welcome(props) {
    //Use this page later as intro for new registrants

    return (
    <View style={containerStyles.container}>
        <Text style={inputStyles.headerText}>Welcome to</Text>
        <Image style={imageStyles.gobbleImage} source = {require('../images/gobble.png')}/>
        <TouchableOpacity style={buttonStyles.loginButton}
                    onPress={()=> props.navigation.navigate('Profile')}>
            <Text style={buttonStyles.loginButtonText}>Tap to Continue</Text>
        </TouchableOpacity>
    </View>
    );
};


