import React, {useState} from 'react'
import {Text, View, SafeAreaView, TouchableOpacity} from 'react-native'
import {Picker} from '@react-native-picker/picker'
import {pickerStyles, buttonStyles, containerStyles} from '../../styles/LoginStyles'
import firebaseSvc from '../../firebase/FirebaseSvc'
import {onSuccess, onFailure, cancelRegistration, getError} from '../../services/RegistrationHandlers';

/**
 * Page 3 for Registration
 * 
 * @param {*} props Props from previous screen
 * @returns RegisterPage3 Render Method
 */
export default function RegisterPage3(props) {
    const [diet, setDietPreference] = useState('halal');
    const [cuisine, setCuisinePreference] = useState('Indian');

    /**
     * Function to update the dietary restriction and cuisine preference in the database.
     * @param {*} diet The Dietary Restriction Chosen
     * @param {*} cuisine The Cuisine Preference chosen
     * @returns undefined
     */
    const updateDietCuisine = (diet, cuisine) =>
        firebaseSvc
            .getCurrentUserCollection(
                (snapshot) => snapshot.val(),
                getError(props))
            .then(userProfile => {
                userProfile['diet'] = diet;
                userProfile['cuisine'] = cuisine;
                firebaseSvc.updateCurrentUserCollection(userProfile, onSuccess('User Collection Update'), onFailure('User Collection Update'));
                props.navigation.navigate('RegisterPage4');
            })
            .catch(getError(props));
    
    return (
    <SafeAreaView>
        <Text style={pickerStyles.text}>What are your dietary restrictions?</Text>
            <Picker
                        selectedValue={diet}
                        onValueChange={(newDiet, itemIndex) => {setDietPreference(newDiet)}}
                        style={pickerStyles.picker}
                        enabled= {true}
                        >
                        <Picker.Item label="Halal" value="Halal" />
                        <Picker.Item label="Vegetarian" value="Vegetarian" />
                        <Picker.Item label="Vegan/Strictly Vegetarian" value="Vegan" />
                        <Picker.Item label="No Restrictions" value='ANY' />
            </Picker>
        <Text style={pickerStyles.text}>What is your preferred cuisine?</Text>
            <Picker
                selectedValue={cuisine}
                onValueChange={(newCuisineItem, itemIndex) => {setCuisinePreference(newCuisineItem)}}
                style={pickerStyles.picker}
                >
                <Picker.Item label="Indian" value="Indian" />
                <Picker.Item label="Asian" value="Asian" />
                <Picker.Item label="Malaysian" value="Malay" />
                <Picker.Item label="Western" value='Western' />
                <Picker.Item label="Any" value='ANY' />
            </Picker>

        <View style={containerStyles.buttonRow}>
            <TouchableOpacity style={buttonStyles.tinyButton} onPress={() => props.navigation.goBack()}>
                <Text style={buttonStyles.loginButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buttonStyles.tinyButton} 
                            onPress={
                                () => {
                                        console.log('Register Page 3 done!');
                                        updateDietCuisine(diet, cuisine);
                                }
                            }>
                <Text style={buttonStyles.loginButtonText}>Continue</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
    )};