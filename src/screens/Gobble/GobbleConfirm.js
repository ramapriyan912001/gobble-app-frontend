import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import {buttonStyles, containerStyles, inputStyles} from '../../styles/LoginStyles'

export function GobbleConfirm(props) {
    let result = props.route.params.result;
    if(result) {
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
                <Text style={inputStyles.headerText}>We have not found your Gobblemate just yet!</Text>
                <Text style={inputStyles.headerText}>Click Done and Head over to Matches to see your Gobble request!</Text>
                <TouchableOpacity style={buttonStyles.loginButton} onPress={() => {
                    props.navigation.navigate('GobbleSelect')
                }}>
                    <Text style={buttonStyles.loginButtonText}>Done!</Text>
                </TouchableOpacity>
            </View>
        )
    }
}