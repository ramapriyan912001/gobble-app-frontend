import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import {buttonStyles, containerStyles, inputStyles} from '../../styles/LoginStyles'

/**
 * Page to show confirmation of match request submission
 * 
 * @param {*} props Props from previous screen
 * @returns GobbleConfirm Render Method
 */
export function GobbleConfirm(props) {

    if(props.route.params) {
        return(
            <View style={containerStyles.container}>
                <Text style={inputStyles.headerText}>We found your Gobblemate!</Text>
                <Text style={inputStyles.headerText}>Click Done and head over to Matches to who you have matched with!</Text>
                <TouchableOpacity style={buttonStyles.loginButton} onPress={() => {
                    props.navigation.navigate('GobbleSelect')
                }}>
                    <Text style={buttonStyles.loginButtonText}>Done!</Text>
                </TouchableOpacity>
            </View>
        )
    } else {
        return (
            <View style={containerStyles.container}>
                <Text style={inputStyles.subHeader}>We have not found your Gobblemate just yet!</Text>
                <Text style={inputStyles.subHeader}>Click Done and Head over to Matches to see your Gobble request!</Text>
                <TouchableOpacity style={buttonStyles.loginButton} onPress={() => {
                    props.navigation.navigate('GobbleSelect')
                }}>
                    <Text style={buttonStyles.loginButtonText}>Done!</Text>
                </TouchableOpacity>
            </View>
        )
    }
}