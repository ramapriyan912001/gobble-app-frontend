import React from 'react'
import {SafeAreaView, Text, TextInput, InputView, Image} from 'react-native'
import {containerStyles} from '../styles/LoginStyles'

export default function ForgotPassword() {
    return (
        <SafeAreaView style={containerStyles.container}>
            <Text style={{fontSize:20, fontWeight:'bold', alignSelf:'center'}}>Oops {'\n'}Swipe Left</Text>
        </SafeAreaView>
    )
}