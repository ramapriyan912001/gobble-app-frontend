import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import {buttonStyles, containerStyles, inputStyles} from '../../styles/LoginStyles'
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native-appearance';
import themes from '../../styles/Themes';
import {styles} from '../../styles/RegisterStyles';

/**
 * Page to show confirmation of match request submission
 * 
 * @param {*} props Props from previous screen
 * @returns GobbleConfirm Render Method
 */
export function GobbleConfirm(props) {
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';
    let result = props.route.params.result;
    if(result) {
        return(
            <View style={[styles.container, themes.containerTheme(isLight)]}>
                <Text style={[inputStyles.subHeader, themes.textTheme(isLight)]}>We found your Gobblemate!</Text>
                <Text style={[inputStyles.subHeader, themes.textTheme(isLight)]}>Click Done and head over to Matches to who you have matched with!</Text>
                <TouchableOpacity style={[styles.longButton, themes.buttonTheme(isLight)]} onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                    props.navigation.navigate('GobbleSelect');
                }}>
                    <Text style={[buttonStyles.loginButtonText, themes.textTheme(!isLight)]}>Done!</Text>
                </TouchableOpacity>
            </View>
        )
    } else {
        return (
            <View style={[styles.container, themes.containerTheme(isLight)]}>
                <Text style={[inputStyles.subHeader, themes.textTheme(isLight)]}>We have not found your Gobblemate just yet!</Text>
                <Text style={[inputStyles.subHeader, themes.textTheme(isLight)]}>Click Done and Head over to Matches to see your Gobble request!</Text>
                <TouchableOpacity style={[styles.longButton, themes.buttonTheme(isLight)]} onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                    props.navigation.navigate('GobbleSelect');

                }}>
                    <Text style={[buttonStyles.loginButtonText, themes.textTheme(!isLight)]}>Done!</Text>
                </TouchableOpacity>
            </View>
        )
    }
}