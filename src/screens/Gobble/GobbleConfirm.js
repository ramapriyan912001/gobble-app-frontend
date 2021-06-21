import React from 'react'
import {View, Text} from 'react-native'
import {containerStyles} from '../../styles/LoginStyles'

export function GobbleConfirm() {
    return(
        <View style={containerStyles.container}>
            <Text>Your Gobble Has Been Confirmed!</Text>
            <Text>Head over to Matches to see your Matches!</Text>
        </View>
    )
}