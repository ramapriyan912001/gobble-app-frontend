import React from 'react'
import {Text, SafeAreaView, View, Image, TouchableOpacity, StatusBar} from 'react-native'
import {imageStyles, containerStyles, buttonStyles, inputStyles} from '../styles/LoginStyles'
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native-appearance';
import themes from '.././styles/Themes';
import {styles} from '.././styles/RegisterStyles';

/**
 * Once user finishes registration
 * 
 * @param {*} props The props from the previous screen
 * @returns FinalStep render function
 */
export default function FinalStep(props) {
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';

    return(
            <SafeAreaView style={[styles.container, themes.containerTheme(isLight)]}>
                    <Image style={imageStyles.gobbleImage} source = {require('../images/gobble.png')}/>
                    <StatusBar style="auto"/>
                    <Text style={[inputStyles.headerText, themes.textTheme(isLight)]}>We're all Set Up.{"\n"}You can now log in to Gobble!</Text>
                    <TouchableOpacity style={[styles.longButton, themes.buttonTheme(isLight)]} onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        props.navigation.navigate('Login');}}>
                        <Text style={[buttonStyles.loginButtonText, themes.textTheme(!isLight)]}>Log In</Text>
                    </TouchableOpacity>
            </SafeAreaView>
    )
};