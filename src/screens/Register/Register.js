import React, {useEffect, useState } from 'react'
import {Text, View, TextInput, Alert, Image, TouchableOpacity, StatusBar} from 'react-native'
import {imageStyles, containerStyles, buttonStyles, inputStyles} from '../../styles/LoginStyles'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {MESSAGES} from '../../constants/messages'
import firebaseSvc from '../../firebase/FirebaseSvc';
import {onSuccess, onFailure, cancelRegistration, createUserProfile} from '../../services/RegistrationHandlers';
import { EMPTY_AVATAR } from '../../constants/objects'

/**
 * The first page to register a new user
 * 
 * @param {*} props Props from previous screen
 * @returns Register render function
 */
export default function register(props) {
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    
    //Handlers for Action Failure:
    /**
     * Handles error from email validation
     * 
     * @param {*} err The error encountered 
     */
    const creationFailure = (err) => {
        Alert.alert('Error Registering', err.message);
    }

    const validateInput = (user) => {
        const shortMessage = (infoString, len) => infoString + MESSAGES.TOO_SHORT + `${len} characters!`;
        const longMessage = (infoString, len) => infoString + MESSAGES.TOO_LONG + `${len} characters!`;
        const emailRegex = /@gmail.com|@yahoo.com|@icloud.com|@u.nus.edu|@hotmail.com|@live.com|@yahoo.co.uk|@nus.edu.sg/;
        function checkInfo(infoString, info, minLength, maxLength) {
            if (info.length < minLength) {
                return {
                    message: shortMessage(infoString, minLength),
                    valid: false
                };
            } else if (info.length > maxLength) {
                return {
                    message: longMessage(infoString, maxLength),
                    valid: false
                };
            } else {
                return {
                    message: '',
                    valid: true
                }
            }

        }
        if (!checkInfo('Username', user.name, 5, 20).valid) {
            Alert.alert(checkInfo('Username', user.name, 5, 20).message);
        } else if (!checkInfo('Password', user.password, 8, 30).valid) {
            Alert.alert(checkInfo('Password', user.password, 8, 30).message);
        } else if (!emailRegex.test(user.email)) {
            Alert.alert('Invalid Email!');
        } else {
            //Check if email has been taken
            firebaseSvc.validateEmail(user, creationSuccess, creationFailure);
        }
    }

    /**
     * Handles the new user created if done successfully
     * 
     * @param {*} userCredential The newly created User
     */
    const creationSuccess = user => (signInMethods) => {
        if (signInMethods.length) {
            //Email Exists
            Alert.alert('Sorry!', 'This E-mail has already been taken');
        } else {
            props.navigation.navigate('RegisterPage2', {user});
        }
    };

    return(
            <KeyboardAwareScrollView contentContainerStyle = {containerStyles.container} scrollEnabled={false}>
                    <Image style={imageStyles.gobbleImage} source = {require('../../images/gobble.png')}/>
                    <StatusBar style="auto"/>
                    <Text style={inputStyles.headerText}>Introduce Yourself!</Text>
                    <View style={inputStyles.inputView}>
                        <TextInput
                            autoCapitalize="none"
                            textContentType="username"
                            autoCompleteType="username"
                            style={inputStyles.TextInput}
                            placeholder="Name"
                            placeholderTextColor="#003f5c"
                            onChangeText={(username) => setName(username)}

                        />
                    </View>
                        
                    <View style={inputStyles.inputView}>
                        <TextInput
                            autoCapitalize="none"
                            textContentType="emailAddress"
                            autoCompleteType="email"
                            style={inputStyles.TextInput}
                            placeholder="Email"
                            placeholderTextColor="#003f5c"
                            secureTextEntry={false}

                            onChangeText={(email) => setEmail(email)}

                        />
                    </View>

                    <View style={inputStyles.inputView}>
                        <TextInput
                            autoCapitalize="none"
                            passwordRules="minlength: 8; required: lower; required: upper; required: digit; required: [-];"
                            textContentType="password"
                            style={inputStyles.TextInput}
                            placeholder="Password"
                            placeholderTextColor="#003f5c"
                            secureTextEntry={true}

                            onChangeText={(password) => setPassword(password)}

                        />
                    </View>
                    
                    <TouchableOpacity style={buttonStyles.loginButton} 

                        onPress={() => {
                                let user = createUserProfile();
                                validateInput({...user, name: name, email: email, password: password});
                            }}
                    >
                        <Text style={buttonStyles.loginButtonText}>Create Account</Text>

                    </TouchableOpacity>
                    <TouchableOpacity style={buttonStyles.loginButton} onPress={() => props.navigation.navigate('Login')}>
                        <Text style={buttonStyles.loginButtonText}>Back to Login</Text>
                    </TouchableOpacity>
            </KeyboardAwareScrollView>
    )
}