import React, {useState} from 'react'
import {Text, SafeAreaView, View, Image, TouchableOpacity, StatusBar} from 'react-native'
import {imageStyles, containerStyles, buttonStyles, inputStyles} from '../styles/LoginStyles'

export default function step2(props) {
    const [state, setState] = useState(props);
    const nextStep = () => {
        const { next, saveState } = props;
        // Save state for use in other steps
        saveState(state);
        // Go to next step
        next();
      };
      
    return(
            <SafeAreaView contentContainerStyle={containerStyles.container}>
                <Image style={imageStyles.gobbleImage}source = {require('../images/gobble.png')}/>
                <StatusBar style="auto"/>
                <View style={inputStyles.inputHeader}>
                    <Text style={inputStyles.headerText}>All Done! You can now log in</Text>
                </View>
                
                <TouchableOpacity style={buttonStyles.loginButton} onPress={() => props.navigation.navigate('Login')}>
                    <Text style={buttonStyles.loginButtonText}>Continue</Text>
                </TouchableOpacity>
            </SafeAreaView>
    )
}