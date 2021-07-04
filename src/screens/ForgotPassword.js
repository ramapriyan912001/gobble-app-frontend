import React, { useState } from 'react'
import {TouchableOpacity, SafeAreaView, Text, TextInput} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firebaseSvc from '../firebase/FirebaseSvc';
import {buttonStyles, containerStyles, inputStyles} from '../styles/LoginStyles'
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native-appearance';
import themes from '.././styles/Themes';
import {styles} from '.././styles/RegisterStyles';

/**
 * Page for users to send a reset password link
 * 
 * @param {*} props Props from previous screen
 * @returns ForgotPassword render method
 */
export default function ForgotPassword(props) {
    const [email, setEmail] = useState('');
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';

    //Handlers for reset Password success/failure:
    const resetAuthorized = () => console.log('Reset Password Email Sent');
    const resetNotAuthorized = (err) => console.log(err.message);

    /**
     * Calls the firebaseSvc's resetPassword method.
     * @param {*} email Takes in email of user to send a reset password email to
     */
    const resetPassword = (email) => firebaseSvc.resetPassword(email, resetAuthorized, resetNotAuthorized);

    return (
        <KeyboardAwareScrollView contentContainerStyle={[styles.container, themes.containerTheme(isLight)]} scrollEnabled={false}>
            <Text style={[inputStyles.headerText, themes.textTheme(isLight)]}>So you forgot your Password?</Text>
            <Text style={[inputStyles.subHeader, themes.textTheme(isLight)]}>No Problem!{'\n'}Leave your e-mail behind{'\n'}We'll tell you what to do next</Text>
            <TextInput
                style={[inputStyles.resetTextInput, themes.textTheme(isLight)]}
                placeholder="Enter your Email here"
                placeholderTextColor={themes.oppositeTheme(isLight)}
                autoCapitalize="none"
                onChangeText={(email) => setEmail(email)}
            />
            <Text style={[inputStyles.subText, themes.textTheme(isLight)]}>Note: If you have not registered before, no email will be sent</Text>
            <TouchableOpacity style={[styles.longButton, themes.buttonTheme(isLight)]} onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                resetPassword(email)
                props.navigation.goBack()}}>
                <Text style={[buttonStyles.loginButtonText, themes.textTheme(!isLight)]}>Send Reset Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.longButton, themes.buttonTheme(isLight)]} onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                props.navigation.goBack();}}>
                <Text style={[buttonStyles.loginButtonText, themes.textTheme(!isLight)]}>Back</Text>
            </TouchableOpacity>
        </KeyboardAwareScrollView>
    )
}