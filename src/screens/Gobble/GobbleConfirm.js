import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import {buttonStyles, containerStyles} from '../../styles/LoginStyles'

export function GobbleConfirm(props) {
    return(
        <View style={containerStyles.container}>
            <Text>Your Gobble Has Been Confirmed!</Text>
            <Text>Head over to Matches to see your Matches!</Text>
            <TouchableOpacity style={buttonStyles.loginButton} onPress={() => props.navigation.navigate('GobbleSelect')}>
                <Text style={buttonStyles.loginButtonText}>Done!</Text>
            </TouchableOpacity>
        </View>
    )
}