import React from 'react'
import {View} from 'react-native'
import {containerStyles, pickerStyles} from '../styles/LoginStyles'
import API from '../api'

export default function RegisterPage3(props) {
    const initialState = props.navigation.getParams('state');
    return(
    <View styles={containerStyles.container}>
        <View>
            <Text style={pickerStyles.switchText}>Would you like to be matched with other Industrial Backgrounds?</Text>
            <Switch 
                value={cross} 
                onValueChange={() => {setCrossIndustryPreference(!cross);initialState.crossIndustry = !initialState.crossIndustry;}} 
                style={pickerStyles.switch}
            />
        </View>
        <View>
            <Text style={inputStyles.headerText}>Tell us your Birthday!</Text>
            <DateTimePicker
            value={date}
            is24Hour={true}
            onChange={(event, selectedDate) => {setDate(selectedDate);initialState.dob = selectedDate;}}
            style={pickerStyles.datePicker}
            />
        </View>
        <TouchableOpacity style={buttonStyles.loginButton} 
                        onPress={
                            () => {
                                    console.log('API CALL FOR REGISTER');
                                    API.post('register', {
                                        body: {
                                            name: username,
                                            password: password,
                                            email: email,
                                            crossIndustry: true,
                                            lastSeen: '',
                                            dob: '',
                                            diet: '',
                                            cuisine: '',
                                            image: '',
                                        },
                                        method: 'POST',
                                    });
                                    props.navigation.navigate('finalstep', {state: initialState});

                            }
                        }>
                    <Text style={buttonStyles.loginButtonText}>Finish</Text>
        </TouchableOpacity>
        <TouchableOpacity style={buttonStyles.loginButton} onPress={() => props.navigation.goBack()}>
            <Text style={buttonStyles.loginButtonText}>Back to Previous Page</Text>
        </TouchableOpacity>
        <TouchableOpacity style={buttonStyles.loginButton} onPress={() => props.navigation.navigate('Login')}>
            <Text style={buttonStyles.loginButtonText}>Back to Login</Text>
        </TouchableOpacity>
    </View>
    )
}