import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import {buttonStyles, containerStyles, inputStyles} from '../../styles/LoginStyles'

export function GobbleConfirm(props) {
    return(
        <View style={containerStyles.container}>
            <Text style={inputStyles.headerText}>Your Gobble Has Been Confirmed!</Text>
            <Text style={inputStyles.headerText}>Head over to Matches to see your Matches!</Text>
            <TouchableOpacity style={buttonStyles.loginButton} onPress={() => {
                props.navigation.navigate('GobbleSelect')
            }}>
                <Text style={buttonStyles.loginButtonText}>Done!</Text>
            </TouchableOpacity>
        </View>
    )
}