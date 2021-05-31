import React, {useState} from 'react'
import {createState} from './step1'
import {Text, SafeAreaView, TouchableOpacity, StatusBar} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import {imageStyles, containerStyles, buttonStyles, inputStyles, pickerStyles} from '../styles/LoginStyles'

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
            <SafeAreaView style={containerStyles.container}>
                    <StatusBar style="auto"/>
                    <Text style={inputStyles.headerText}>Tell us your Birthday!</Text>
                    <DateTimePicker
                        value={new Date()}
                        is24Hour={true}
                        onChange={(event, selectedDate) => setState(state => createState(state.name, selectedDate, state.diet, state.cuisine, state.crossIndustry, state.email, state.password))}
                        style={pickerStyles.datePicker}
                        />
                    <TouchableOpacity style={buttonStyles.loginButton} onPress={props.next}>
                        <Text style={buttonStyles.loginButtonText}>Continue</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={buttonStyles.loginButton} onPress={() => props.back}>
                        <Text style={buttonStyles.loginButtonText}>Back</Text>
                    </TouchableOpacity>
            </SafeAreaView>
    )
}