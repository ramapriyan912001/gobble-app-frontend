import React, {useState} from 'react'
import {Text, View, TextInput, Image, TouchableOpacity, ScrollView, Alert} from 'react-native'
import {StatusBar} from 'expo-status-bar'
import {imageStyles, inputStyles, buttonStyles, containerStyles} from '../styles/LoginStyles'
import {styles} from '../styles/RegisterStyles'
import themes from '../styles/Themes';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {API} from '../api'
import firebaseSvc from '../firebase/FirebaseSvc';
import BottomTabs from '../components/BottomTabs'
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native-appearance';

/**
 * Page for user to log in!
 * 
 * @param {*} props Props from previous screen
 * @returns Login page render function
 */
export default function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';
    
    // Login Success/Fail handlers
    const loginSuccess = (userCredential) => {
        console.log('login successful');
        const user = userCredential.user;
        // user.lastSeen === null
        // ? props.navigation.navigate('Welcome')
        // :
        props.navigation.replace('BottomTabs');
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
                <KeyboardAwareScrollView contentContainerStyle={[styles.container, themes.containerTheme(isLight)]} scrollEnabled={false}>
                    <Image style={imageStyles.gobbleImage} source = {require('../images/gobble.png')} testID={'GobbleImage'}/>
                    <StatusBar style="auto"/>
                    <View style={[styles.inputView, themes.viewTheme(isLight)]}> 
                        <TextInput
                            autoCapitalize="none"
                            style={[inputStyles.TextInput, themes.textTheme(isLight)]}
                            placeholder="Email"
                            placeholderTextColor={themes.oppositeTheme(isLight)}
                            returnKeyType = 'done'
                            onSubmitEditing={(event) => onPressLogin()}
                            onChangeText={(email) => setEmail(email)}
                        />
                    </View>
                        
                    <View style={[styles.inputView, themes.viewTheme(isLight)]}>
                        <TextInput
                            autoCapitalize="none"
                            style={[inputStyles.TextInput, themes.textTheme(isLight)]}
                            placeholder="Password"
                            placeholderTextColor={themes.oppositeTheme(isLight)}
                            returnKeyType = 'done'
                            secureTextEntry={true}
                            onSubmitEditing={(event) => onPressLogin()}
                            onChangeText={(password) => setPassword(password)}
                        />
                    </View>
                    <TouchableOpacity
                        style={buttonStyles.forgotButton}
                        onPress={()=> {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                        props.navigation.navigate('ForgotPassword');}}
                        testID={'ToForgotPasswordButton'}
                    >
                        <Text style={[buttonStyles.forgotButtonText, themes.textTheme(isLight)]}>Forgot Password?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.longButton, themes.buttonTheme(isLight)]}
                        onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                        onPressLogin();
                        }}
                        testID={'LoginButton'}
                    >
                        <Text style={[buttonStyles.loginButtonText, themes.oppositeTextTheme(isLight)]}>Log In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.longButton, themes.buttonTheme(isLight)]}
                        onPress={()=> {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                            props.navigation.navigate('Welcome');}}
                        testID={'ToWelcomeButton'}
                    >
                        <Text style={[buttonStyles.loginButtonText, themes.oppositeTextTheme(isLight)]}>Back</Text>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
    )
}