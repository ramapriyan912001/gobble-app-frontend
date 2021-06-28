import React, {useEffect, useState } from 'react'
import {Text, View, TextInput, Alert, Image, TouchableOpacity, StatusBar} from 'react-native'
import {imageStyles, containerStyles, buttonStyles, inputStyles} from '../../styles/LoginStyles'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {MESSAGES} from '../../constants/messages'
import firebaseSvc from '../../firebase/FirebaseSvc';
import {onSuccess, onFailure, cancelRegistration, createUserProfile} from '../../services/RegistrationHandlers';

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
     * Handles error from user account creation
     * 
     * @param {*} err The error encountered 
     */
    const creationFailure = (err) => {
        if (err.code === 'auth/email-already-in-use') {
            Alert.alert(err.message, 'Don\'t worry if you didn\'t complete your profile, you can log in and do so');
        } else {
            Alert.alert(err.message); console.log(err.message);
        }
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
            return false;
        } else if (!checkInfo('Password', user.password, 8, 30).valid) {
            Alert.alert(checkInfo('Password', user.password, 8, 30).message);
            return false;
        } else if (!emailRegex.test(user.email)) {
            Alert.alert('Invalid Email!');
            return false;
        } else {
            return true;
        }
    }

    /**
     * Handles the new user created if done successfully
     * 
     * @param {*} userCredential The newly created User
     */
    const creationSuccess = (userCredential) => {
        const cUser = userCredential.user;
        cUser
        .updateProfile({ displayName: name})
        .then(onSuccess('Updating Name'))
        .catch(onFailure('Name Update'));

        let userProfile = createUserProfile();
        userProfile['name'] = name;
        userProfile['email'] = email;

        firebaseSvc.updateCurrentUserCollection(userProfile, onSuccess('User Collection Update'), onFailure('User Collection Update'));
        props.navigation.navigate('RegisterPage2', {name: name});
    };

    /**
     * Starts the new user creation process
     * 
     * @param {*} user The User details to create
     * @returns undefined
     */
    const addUser = (user) => {
        if (validateInput(user)) {
            firebaseSvc.createUser(user, creationSuccess, creationFailure);
        }
    }

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

                        onPress={() => addUser({name: name, email: email, password: password})}
                    >
                        <Text style={buttonStyles.loginButtonText}>Create Account</Text>

                    </TouchableOpacity>
                    <TouchableOpacity style={buttonStyles.loginButton} onPress={() => cancelRegistration(props)}>
                        <Text style={buttonStyles.loginButtonText}>Back to Login</Text>
                    </TouchableOpacity>
            </KeyboardAwareScrollView>
    )
}