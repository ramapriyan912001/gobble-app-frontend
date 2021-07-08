import React from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import firebaseSvc from '../firebase/FirebaseSvc'
import { inputStyles, buttonStyles } from '../styles/LoginStyles'

export default function DeleteAccount(props) {

    return (
        <SafeAreaView>
            <View style={{marginTop: '20%'}}>
                <Text style={inputStyles.headerText}>
                    {`This is an irreversible action.`}
                </Text>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{...inputStyles.subHeader, marginRight: '4%', alignSelf: 'flex-start'}}>
                        {`\u2022`}
                    </Text>
                    <Text style={{...inputStyles.subHeader, paddingLeft: '0%', textAlign: 'left', marginLeft: '0%'}}>
                        {`Your data will be deleted from Gobble's servers.`}
                    </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                <Text style={{...inputStyles.subHeader, marginRight: '4%', alignSelf: 'flex-start'}}>
                    {`\u2022`}
                </Text>
                <Text style={{...inputStyles.subHeader, paddingLeft: '0%', textAlign: 'left', marginLeft: '0%'}}>
                    {`You will not be able to retrieve your data.`}
                </Text>
                </View>
            
                <TouchableOpacity style={buttonStyles.loginButton}
                    onPress={() => {
                        //TODO: Verify if the below function is functional
                        // firebaseSvc.deleteUser();
                        Alert.alert('Your account has been deleted', 'You will be logged out of the app now.')
                        // props.navigation.navigate('Welcome')
                    }}>
                    <Text style={buttonStyles.loginButtonText}>
                        Delete Account
                    </Text>
                </TouchableOpacity>
            </View>
            
        </SafeAreaView>
    )
}

