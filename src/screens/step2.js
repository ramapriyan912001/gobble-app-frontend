import React, {useState} from 'react'
import {createState} from './step1'
import {Text, View, SafeAreaView, Image, TouchableOpacity, StatusBar, Switch} from 'react-native'
import {Picker} from '@react-native-picker/picker'
import {pickerStyles, containerStyles, buttonStyles, inputStyles} from '../styles/LoginStyles'

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
                <StatusBar style="auto"/>
                <Text style={inputStyles.headerText}>What about your food preferences?</Text>
                <Text style={pickerStyles.switchText}>What are your dietary restrictions?</Text>
                <Picker
                    selectedValue={state}
                    onValueChange={(newDiet, itemIndex) => 
                    setState(dummy => createState(state.name, state.dob, newDiet, state.cuisine, state.crossIndustry, state.email, state.password))}
                    style={pickerStyles.picker}
                    enabled= {true}
                    >
                    <Picker.Item label="Halal" value="halal" />
                    <Picker.Item label="Vegetarian" value="vegetarian" />
                    <Picker.Item label="Vegan/Strictly Vegetarian" value="vegan" />
                    <Picker.Item label="No Restrictions" value='nonhalal' />
                </Picker>
                <Text style={pickerStyles.switchText}>What is your preferred cuisine?</Text>
                <Picker
                    selectedValue={state}
                    onValueChange={(newCuisineItem, itemIndex) =>
                    setState(dummy => setState(state => createState(state.name, state.dob, state.diet, cuisine, state.crossIndustry, state.email, state.password)))}
                    style={pickerStyles.picker}
                    >
                    <Picker.Item label="Indian" value="indian" />
                    <Picker.Item label="Asian" value="asian" />
                    <Picker.Item label="Malaysian" value="malay" />
                    <Picker.Item label="Western" value='western' />
                    <Picker.Item label="Others" value='others' />
                </Picker>
                <Text style={pickerStyles.switchText}>Would you like to be matched with other Industrial Backgrounds?</Text>
                <Switch 
                    value={state} 
                    onValueChange={() => 
                    setState(state => createState(state.name, state.dob, state.diet, state.cuisine, !state.crossIndustry, state.email, state.password))} 
                    style={pickerStyles.switch}
                />
                <View style = {buttonStyles.buttonView}>
                    <TouchableOpacity style={buttonStyles.loginButton} onPress={nextStep}>
                        <Text style={buttonStyles.loginButtonText}>Continue</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={buttonStyles.loginButton} onPress={props.back}>
                        <Text style={buttonStyles.loginButtonText}>Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
    )
}