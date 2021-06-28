import React, {useState} from 'react'
import {Text, View, TextInput, Image, TouchableOpacity, Alert} from 'react-native'
import {StatusBar} from 'expo-status-bar'
import {imageStyles, inputStyles, buttonStyles, containerStyles} from '../styles/LoginStyles'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {API} from '../api'
import firebaseSvc from '../firebase/FirebaseSvc';
import BottomTabs from '../components/BottomTabs'

/**
 * Page for user to log in!
 * 
 * @param {*} props Props from previous screen
 * @returns Login page render function
 */
export default function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Login Success/Fail handlers
    const loginSuccess = (userCredential) => {
        console.log('login successful');
        const user = userCredential.user;
        user.lastSeen === null
        ? props.navigation.navigate('Welcome')
        : props.navigation.replace('BottomTabs');
    };
    const loginFailed = (err) => {
        // const errorCode = err.code;
        const errorMessage = err.message;
        Alert.alert(errorMessage);
    };

    /**
     * Login to user account. Uses the email password and user details from function state.
     * Calls firebaseSvc.login() to log in the user
     */
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
                    <Image style={imageStyles.gobbleImage} source = {require('../images/gobble.png')}/>
                    <StatusBar style="auto"/>
                    <View style={inputStyles.inputView}> 
                        <TextInput
                            autoCapitalize="none"
                            style={inputStyles.TextInput}
                            placeholder="Email"
                            placeholderTextColor="#003f5c"
                            returnKeyType = 'done'
                            onSubmitEditing={(event) => onPressLogin()}
                            onChangeText={(email) => setEmail(email)}
                        />
                    </View>
                        
                    <View style={inputStyles.inputView}>
                        <TextInput
                            autoCapitalize="none"
                            style={inputStyles.TextInput}
                            placeholder="Password"
                            placeholderTextColor="#003f5c"
                            returnKeyType = 'done'
                            secureTextEntry={true}
                            onSubmitEditing={(event) => onPressLogin()}
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


