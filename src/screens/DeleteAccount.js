import React from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import firebaseSvc from '../firebase/FirebaseSvc'
import { inputStyles, buttonStyles } from '../styles/LoginStyles'

export default function DeleteAccount(props) {

    return (
        <SafeAreaView>
            <Text style={inputStyles.headerText}>
                {`This is an irreversible action.`}
            </Text>
            <Text style={inputStyles.subHeader}>
                {`\u2022 Your data will be deleted from Gobble's servers.`}
            </Text>
            <Text style={inputStyles.subHeader}>
                {`\u2022 You will not be able to retrieve your data.`}
            </Text>
            <TouchableOpacity style={buttonStyles.loginButton}
                onPress={() => {
                    firebaseSvc.deleteUser();
                    Alert.alert('Your account has been deleted', 'You will be logged out of the app now.')
                    props.navigation.navigate('Welcome')
                }}>
                <Text style={buttonStyles.loginButtonText}>
                    Delete Account
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

