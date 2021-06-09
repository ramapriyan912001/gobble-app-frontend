import React, { useState } from 'react'
import {TouchableOpacity, SafeAreaView, Text, TextInput} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firebaseSvc from '../reducers/FirebaseSvc';
import {buttonStyles, containerStyles, inputStyles} from '../styles/LoginStyles'

export default function ForgotPassword(props) {
    const [email, setEmail] = useState('');

    //Handlers for reset Password success/failure:
    const resetAuthorized = () => console.log('Reset Password Email Sent');
    const resetNotAuthorized = (err) => console.log(err.message);

    const resetPassword = (email) => firebaseSvc.resetPassword(email, resetAuthorized, resetNotAuthorized);

    return (
        <KeyboardAwareScrollView contentContainerStyle={containerStyles.container} scrollEnabled={false}>
            <Text style={inputStyles.headerText}>So you forgot your Password?</Text>
            <Text style={inputStyles.subHeader}>No Problem!{'\n'}Leave your e-mail behind{'\n'}We'll tell you what to do next</Text>
            <TextInput
                style={inputStyles.resetTextInput}
                placeholder="Enter your Email here"
                placeholderTextColor="#003f5c"
                onChangeText={(email) => setEmail(email)}
            />
            <Text style={inputStyles.subText}>Note: If you have not registered before, no email will be sent</Text>
            <TouchableOpacity style={buttonStyles.loginButton} onPress={() => resetPassword(email)}>
                <Text style={buttonStyles.loginButtonText}>Send Reset Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buttonStyles.loginButton} onPress={() => props.navigation.goBack()}>
                <Text style={buttonStyles.loginButtonText}>Back</Text>
            </TouchableOpacity>
        </KeyboardAwareScrollView>
    )
}