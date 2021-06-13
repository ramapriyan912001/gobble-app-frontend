import React, {useState} from 'react'
import {Text, View, SafeAreaView, TouchableOpacity} from 'react-native'
import {Picker} from '@react-native-picker/picker'
import {pickerStyles, buttonStyles, containerStyles} from '../styles/LoginStyles'
import firebaseSvc from '../reducers/FirebaseSvc'
import {onSuccess, onFailure, cancelRegistration, getError} from '../services/RegistrationHandlers';

export default function RegisterPage3(props) {
    const [diet, setDietPreference] = useState('halal');
    const [cuisine, setCuisinePreference] = useState('indian');

    const updateDietCuisine = (diet, cuisine) =>
        firebaseSvc
            .getUserCollection(
                (snapshot) => snapshot.val(),
                getError(props))
            .then(userProfile => {
                userProfile['diet'] = diet;
                userProfile['cuisine'] = cuisine;
                firebaseSvc.updateUserCollection(userProfile, onSuccess('User Collection Update'), onFailure('User Collection Update'));
                props.navigation.navigate('RegisterPage4');
            })
            .catch(getError(props));

    // useEffect(() => {
    //     return cancelRegistration(props);
    // }, []);
    
    return (
    <SafeAreaView>
        <Text style={pickerStyles.text}>What are your dietary restrictions?</Text>
            <Picker
                        selectedValue={diet}
                        onValueChange={(newDiet, itemIndex) => {setDietPreference(newDiet)}}
                        style={pickerStyles.picker}
                        enabled= {true}
                        >
                        <Picker.Item label="Halal" value="halal" />
                        <Picker.Item label="Vegetarian" value="vegetarian" />
                        <Picker.Item label="Vegan/Strictly Vegetarian" value="vegan" />
                        <Picker.Item label="No Restrictions" value='nonhalal' />
            </Picker>
        <Text style={pickerStyles.text}>What is your preferred cuisine?</Text>
            <Picker
                selectedValue={cuisine}
                onValueChange={(newCuisineItem, itemIndex) => {setCuisinePreference(newCuisineItem)}}
                style={pickerStyles.picker}
                >
                <Picker.Item label="Indian" value="indian" />
                <Picker.Item label="Asian" value="asian" />
                <Picker.Item label="Malaysian" value="malay" />
                <Picker.Item label="Western" value='western' />
                <Picker.Item label="Others" value='others' />
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