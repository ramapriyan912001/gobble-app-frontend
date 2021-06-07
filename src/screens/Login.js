import React, {useState} from 'react'
import {Text, View, TextInput, Image, TouchableOpacity, Alert} from 'react-native'
import {StatusBar} from 'expo-status-bar'
import {imageStyles, inputStyles, buttonStyles, containerStyles} from '../styles/LoginStyles'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {API} from '../api'
import deviceStorage from '../services/deviceStorage'

let userToken = '';

export default function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function verifyLogin() {
        let reply = '';
        await API.post('users/login',
        {
            validateStatus: (status => status < 500), // Resolve only if the status code is less than 500
            method: 'POST',
            body: {
                email: email,
                password: password
            }
        })
        .then(res => {
            console.log('Going to Log in....');
            try{
                reply = res.data.success? '' : res.data.message;
                    /* BRING THE PERSON TO THE PROFILE PAGE
                    NAVIGATION.NAVIGATE(PROFILE.JS WITH PROPS STATING EMAIL AND
                    PW, USE A COMPONENTDIDMOUNT() METHOD TO SEND GET REQUEST TO API
                    AND LOAD THE PROFILE PAGE ACCORDINGLY)*/
                userToken = res.data.token;
            } catch(err) {
                console.log(err);
            }
        })
        .catch(err => {
            console.log(err)
            const status = err.response.status;
            reply = status < 500? err.response.data.message : 'Internal Error';
        });
        return reply;
    };

    return(
                <KeyboardAwareScrollView contentContainerStyle={containerStyles.container}>
                    <Image style={imageStyles.gobbleImage}source = {require('../images/gobble.png')}/>
                    <StatusBar style="auto"/>
                    <View style={inputStyles.inputView}> 
                        <TextInput
                            style={inputStyles.TextInput}
                            placeholder="Email"
                            placeholderTextColor="#003f5c"
                            onChangeText={(email) => setEmail(email)}
                        />
                    </View>
                        
                    <View style={inputStyles.inputView}>
                        <TextInput
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
                    <TouchableOpacity style={buttonStyles.loginButton} onPress={
                      () => verifyLogin() //returns a Promise
                            .then(message => {
                                if (message === '') {
                                    deviceStorage.saveItem('token', userToken);
                                    props.navigation.navigate('Welcome');
                                } else {Alert.alert(message);}})
                            .catch(console.log)
                    }>
                    <Text style={buttonStyles.loginButtonText}>Log In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={buttonStyles.loginButton}
                    onPress={()=> props.navigation.navigate('Register')}>
                    <Text style={buttonStyles.loginButtonText}>Sign Up</Text>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
    )
}


