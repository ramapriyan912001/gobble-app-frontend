import React, {useState} from 'react'
import {Text, View, TextInput, Image, TouchableOpacity, Alert} from 'react-native'
import {StatusBar} from 'expo-status-bar'
import {imageStyles, inputStyles, buttonStyles, containerStyles} from '../styles/LoginStyles'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import firebaseSvc from '../firebase/FirebaseSvc';

export default function Reauthenticate(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const user = firebaseSvc.currentUser();

    // Login Success/Fail handlers
    const authSuccess = (userCredential) => {
        console.log('auth successful');
        props.navigation.goBack();
    };
    const authFailed = (err) => {
        // const errorCode = err.code;
        const errorMessage = err.message;
        Alert.alert('Auth failed: ' + errorMessage);
    };

    // add auth method to handle user press re-auth button
    const onPressAuth = () => {
        const userAuth = {
        email: user.email,
        password: password,
        };
        firebaseSvc
        .reauthenticateUser(userAuth, authSuccess, authFailed);
    };

    return(
                <KeyboardAwareScrollView contentContainerStyle={containerStyles.container} scrollEnabled={false}>
                    <Text style={inputStyles.headerText}>Enter your Credentials</Text>
                    <Image style={imageStyles.gobbleImage}source = {require('../images/gobble.png')}/>
                    <StatusBar style="auto"/>
                    <View style={inputStyles.inputView}>
                        <TextInput
                            autoCapitalize="none"
                            style={inputStyles.TextInput}
                            placeholder="Password"
                            placeholderTextColor="#003f5c"
                            secureTextEntry={true}
                            onChangeText={(password) => setPassword(password)}
                        />
                    </View>
                    <TouchableOpacity style={buttonStyles.forgotButton} onPress={()=> props.navigation.navigate('ForgotPassword')}>
                    <Text style={buttonStyles.forgotButtonText}>Forgot Password?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={buttonStyles.loginButton} onPress={onPressAuth}>
                    <Text style={buttonStyles.loginButtonText}>Log In</Text>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
    )
}


