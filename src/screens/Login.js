import React, {useState} from 'react'
import {Text, View, TextInput, Image, TouchableOpacity, Alert} from 'react-native'
import {StatusBar} from 'expo-status-bar'
import {imageStyles, inputStyles, buttonStyles, containerStyles} from '../styles/LoginStyles'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {API} from '../api'
import firebaseSvc from '../firebase/FirebaseSvc';
import deviceStorage from '../services/deviceStorage'
import BottomTabs from '../components/BottomTabs'

let userToken = '';

export default function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Login Success/Fail handlers
    const loginSuccess = (userCredential) => {
        console.log('login successful');
        const user = userCredential.user;
        user.lastSeen === null
        ? props.navigation.navigate('Welcome')
        : props.navigation.navigate('BottomTabs');
    };
    const loginFailed = (err) => {
        // const errorCode = err.code;
        const errorMessage = err.message;
        Alert.alert(errorMessage);
    };

    // add login method to handle user press Login button
    const onPressLogin = () => {
        const user = {
        email: email,
        password: password,
        };
        firebaseSvc
        .login(user, loginSuccess, loginFailed);
    };

    return(
                <KeyboardAwareScrollView contentContainerStyle={containerStyles.container} scrollEnabled={false}>
                    <Image style={imageStyles.gobbleImage}source = {require('../images/gobble.png')}/>
                    <StatusBar style="auto"/>
                    <View style={inputStyles.inputView}> 
                        <TextInput
                            autoCapitalize="none"
                            style={inputStyles.TextInput}
                            placeholder="Email"
                            placeholderTextColor="#003f5c"
                            onChangeText={(email) => setEmail(email)}
                        />
                    </View>
                        
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
                    <TouchableOpacity style={buttonStyles.loginButton} onPress={onPressLogin}>
                    <Text style={buttonStyles.loginButtonText}>Log In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={buttonStyles.loginButton}
                    onPress={()=> props.navigation.navigate('RegisterNavigator')}>
                    <Text style={buttonStyles.loginButtonText}>Sign Up</Text>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
    )
}


