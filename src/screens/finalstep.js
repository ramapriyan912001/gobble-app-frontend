import React from 'react'
import {Text, SafeAreaView, View, Image, TouchableOpacity, StatusBar} from 'react-native'
import {imageStyles, containerStyles, buttonStyles, inputStyles} from '../styles/LoginStyles'

/**
 * Once user finishes registration
 * 
 * @param {*} props The props from the previous screen
 * @returns FinalStep render function
 */
export default function FinalStep(props) {
    return(
            <SafeAreaView style={containerStyles.container}>
                    <Image style={imageStyles.gobbleImage} source = {require('../images/gobble.png')}/>
                    <StatusBar style="auto"/>
                        <Text style={inputStyles.headerText}>We're all Set Up.{"\n"}You can now log in to Gobble!</Text>
                    <TouchableOpacity style={buttonStyles.loginButton} onPress={() => props.navigation.navigate('Login')}>
                        <Text style={buttonStyles.loginButtonText}>Back to Log In</Text>
                    </TouchableOpacity>
            </SafeAreaView>
    )
};