import React, {useState} from 'react'
import {Text, View, SafeAreaView, Switch, TouchableOpacity} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import {containerStyles, buttonStyles, pickerStyles, inputStyles} from '../styles/LoginStyles'
import {API} from '../api'

export default function RegisterPage3(props) {
    const initialState = props.navigation.getParam('state');
    const [cross, setCrossIndustryPreference] = useState(false);
    const [date, setDate] = useState(new Date());
    return(
    <SafeAreaView style={containerStyles.container}>
        <Text style={pickerStyles.text}>Would you like to be matched with other Industrial Backgrounds?</Text>
        <Switch 
            value={cross} 
            onValueChange={() => {setCrossIndustryPreference(!cross);initialState.crossIndustry = !initialState.crossIndustry;}} 
            style={pickerStyles.switch}
        />
        <Text style={pickerStyles.dateText}>Tell us your Birthday!</Text>
        <View style={containerStyles.datePicker}>
            <DateTimePicker
            value={date}
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
                                            name: initialState.name,
                                            password: initialState.password,
                                            email: initialState.email,
                                            crossIndustry: initialState.crossIndustry,
                                            dob: initialState.dob,
                                            diet: initialState.diet,
                                            cuisine: initialState.cuisine,
                                        },
                                        method: 'POST',
                                    })
                                    .then(res => 
                                    res.data.success
                                    ? props.navigation.navigate('FinalStep', {state: initialState})
                                    : console.log(res))
                                    .catch(err => console.log(err));
                            }
                        }>
                    <Text style={buttonStyles.loginButtonText}>Finish</Text>
        </TouchableOpacity>
        <View style={containerStyles.buttonRow}>
            <TouchableOpacity style={buttonStyles.tinyButton} onPress={() => props.navigation.goBack()}>
                <Text style={buttonStyles.loginButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buttonStyles.tinyButton} onPress={() => props.navigation.navigate('Login')}>
                <Text style={buttonStyles.loginButtonText}>Back to Login</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
    )
};