import React, {useState} from 'react'
import {Text, View, TextInput, Image, TouchableOpacity, Alert} from 'react-native'
import {StatusBar} from 'expo-status-bar'
import {imageStyles, inputStyles, buttonStyles, containerStyles} from '../styles/LoginStyles'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import firebaseSvc from '../firebase/FirebaseSvc';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native-appearance';
import themes from '.././styles/Themes';
import {styles} from '.././styles/RegisterStyles';

/**
 * The page to re-authenticate a user if required
 * 
 * @param {*} props Props from previous screen
 * @returns Reauthenticate render function
 */
export default function Reauthenticate(props) {
    const cleanup = props.route.params.cleanup;
    const [password, setPassword] = useState('');
    const user = firebaseSvc.currentUser();
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';

    // Login Success/Fail handlers
    const authSuccess = (userCredential) => {
        console.log('Auth Successful');
        cleanup();
        props.navigation.goBack();
    };
    const authFailed = (err) => {
        // const errorCode = err.code;
        const errorMessage = err.message;
        Alert.alert('Auth failed: ' + errorMessage);
    };

    /**
     * Used to re-authenticate user if user goes offline for too long before performing any major action.
     */
    const onPressAuth = () => {
        const userAuth = {
        email: user.email,
        password: password,
        };
        firebaseSvc
        .reauthenticateUser(userAuth, authSuccess, authFailed);
    };

    return(
                <KeyboardAwareScrollView contentContainerStyle={[styles.container, themes.containerTheme(isLight)]} scrollEnabled={false}>
                    <Text style={[inputStyles.headerText, themes.textTheme(isLight)]}>Enter your Credentials</Text>
                    <Image style={imageStyles.gobbleImage} source = {require('../images/gobble.png')}/>
                    <StatusBar style="auto"/>
                    <Text style={[inputStyles.subText, themes.textTheme(isLight)]}>{user.email === null? 'Unknown Email' : user.email}</Text>
                    <View style={inputStyles.inputView}>
                        <TextInput
                            autoCapitalize="none"
                            style={[inputStyles.TextInput, themes.textTheme(isLight)]}
                            placeholder="Password"
                            placeholderTextColor={themes.oppositeTheme(isLight)}
                            secureTextEntry={true}
                            onChangeText={(password) => setPassword(password)}
                        />
                    </View>
                    <TouchableOpacity style={[buttonStyles.forgotButton, themes.buttonTheme(isLight)]} onPress={()=> {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                        props.navigation.navigate('ForgotPassword');}}>
                    <Text style={[buttonStyles.forgotButtonText, themes.textTheme(!isLight)]}>Forgot Password?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.longButton, themes.buttonTheme(isLight)]} onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                        onPressAuth();}}>
                    <Text style={[buttonStyles.loginButtonText, themes.textTheme(!isLight)]}>Log In</Text>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
    )
}


