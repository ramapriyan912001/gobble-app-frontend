import React, {useState} from 'react'
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
                        setState(state => {
                            state.diet = newDiet;
                            return state;
                        })
                    }
                    style={pickerStyles.picker}
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
                        setState(state => {
                            let cuisine = [];
                            cuisine.push(newCuisineItem);
                            state.cuisine = cuisine;
                            return state;
                        })}
                    style={pickerStyles.picker}
                    >
                    <Picker.Item label="Indian" value="indian" />
                    <Picker.Item label="Asian" value="asian" />
                    <Picker.Item label="Malaysian" value="malay" />
                    <Picker.Item label="Western" value='western' />
                    <Picker.Item label="Mexican/Middle-Eastern/Others" value='others' />
                </Picker>
                <Text style={pickerStyles.switchText}>Would you like to be matched with other Industrial Backgrounds?</Text>
                <Switch 
                    value={state} 
                    onValueChange={() => setState(state => {
                    state.crossIndustry = !state.crossIndustry;
                    return state;
                })} 
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