import React from 'react'
import {Text, View, Image, TouchableOpacity} from 'react-native'
import {imageStyles, inputStyles, containerStyles} from '../styles/LoginStyles'

export default function Welcome(props) {

    //Use this page later as intro for new registrants

    return (
    <View style={containerStyles.container}>
        <Text style={inputStyles.headerText}>Welcome to</Text>
        <Image style={imageStyles.gobbleImage} source = {require('../images/gobble.png')}/>
        <TouchableOpacity style={buttonStyles.loginButton}
                    onPress={()=> props.navigation.navigate('Profile', {token: token})}>
            <Text style={buttonStyles.loginButtonText}>Tap to Continue</Text>
        </TouchableOpacity>
    </View>
    );
};


