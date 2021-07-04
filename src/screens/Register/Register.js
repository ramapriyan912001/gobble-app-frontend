import React, {useEffect, useState } from 'react'
import {Text, View, TextInput, Alert, Image, StyleSheet, TouchableOpacity, StatusBar} from 'react-native'
import {imageStyles, containerStyles, buttonStyles, inputStyles} from '../../styles/LoginStyles'
import {styles} from '../../styles/RegisterStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {MESSAGES} from '../../constants/messages'
import firebaseSvc from '../../firebase/FirebaseSvc';
import {onSuccess, onFailure, cancelRegistration, createUserProfile} from '../../services/RegistrationHandlers';
import { EMPTY_AVATAR } from '../../constants/objects'
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native-appearance';
import themes from '../../styles/Themes';

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
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';
    
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
            <KeyboardAwareScrollView contentContainerStyle = {[styles.container, themes.containerTheme(isLight)]} scrollEnabled={false}>
                    <Image style={imageStyles.gobbleImage} source = {require('../../images/gobble.png')}/>
                    <StatusBar style="auto"/>
                    <Text style={[inputStyles.headerText, themes.textTheme(isLight)]}>Introduce Yourself!</Text>
                    <View style={[styles.inputView, themes.viewTheme(isLight)]}>
                        <TextInput
                            autoCapitalize="none"
                            textContentType="username"
                            autoCompleteType="username"
                            style={[inputStyles.TextInput, themes.textTheme(isLight)]}
                            placeholder="Name"
                            placeholderTextColor={themes.oppositeTheme(isLight)}
                            onChangeText={(username) => setName(username)}

                        />
                    </View>
                        
                    <View style={[styles.inputView, themes.viewTheme(isLight)]}>
                        <TextInput
                            autoCapitalize="none"
                            textContentType="emailAddress"
                            autoCompleteType="email"
                            style={[inputStyles.TextInput, themes.textTheme(isLight)]}
                            placeholder="Email"
                            placeholderTextColor={themes.oppositeTheme(isLight)}
                            secureTextEntry={false}
                            onChangeText={(email) => setEmail(email)}
                        />
                    </View>

                    <View style={[inputStyles.inputView, themes.viewTheme(isLight)]}>
                        <TextInput
                            autoCapitalize="none"
                            passwordRules="minlength: 8; required: lower; required: upper; required: digit; required: [-];"
                            textContentType="password"
                            style={[inputStyles.TextInput, themes.textTheme(isLight)]}
                            placeholder="Password"
                            returnKeyType='done'
                            onSubmitEditing={() => {
                                let user = createUserProfile();
                                validateInput({...user, name: name, email: email, password: password});
                            }}
                            placeholderTextColor={themes.oppositeTheme(isLight)}
                            secureTextEntry={true}
                            onChangeText={(password) => setPassword(password)}
                        />
                    </View>
                    
                    <TouchableOpacity style={[styles.longButton, themes.buttonTheme(isLight)]} 

                        onPress={() => {
                                let user = createUserProfile();
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                validateInput({...user, name: name, email: email, password: password});
                            }}
                    >
                        <Text style={[buttonStyles.longButtonText, themes.oppositeTextTheme(isLight)]}>Create Account</Text>

                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.longButton, themes.buttonTheme(isLight)]} onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        props.navigation.navigate('Welcome');}}>
                        <Text style={[buttonStyles.longButtonText, themes.oppositeTextTheme(isLight)]}>Back</Text>
                    </TouchableOpacity>
            </KeyboardAwareScrollView>
    )
}