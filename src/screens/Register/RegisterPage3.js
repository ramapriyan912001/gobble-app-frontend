import React, {useState} from 'react'
import {Text, View, SafeAreaView, TouchableOpacity, Button, StyleSheet} from 'react-native'
import {Picker} from '@react-native-picker/picker'
import {pickerStyles, buttonStyles, containerStyles} from '../../styles/LoginStyles'
import firebaseSvc from '../../firebase/FirebaseSvc'
import {onSuccess, onFailure, cancelRegistration, getError} from '../../services/RegistrationHandlers';
import { CUISINES, DIETS, INDUSTRY_CODES } from '../../constants/objects'

/**
 * Page 3 for Registration
 * 
 * @param {*} props Props from previous screen
 * @returns RegisterPage3 Render Method
 */
export default function RegisterPage3(props) {
    const [diet, setDietPreference] = useState('Halal');
    const [cuisine, setCuisinePreference] = useState('Indian');
    const [industry, setIndustry] = useState(0);
    const [industries] = useState(INDUSTRY_CODES);
    const [showDiets, setShowDiets] = useState(false);
    const [showCuisines, setShowCuisines] = useState(false);
    const [showIndustries, setShowIndustries] = useState(false);

    /**
     * Function to update the dietary restriction and cuisine preference in the database.
     * @param {*} diet The Dietary Restriction Chosen
     * @param {*} cuisine The Cuisine Preference chosen
     * @returns undefined
     */
    const updatePreferences = (diet, cuisine, industry) =>
        firebaseSvc
            .getCurrentUserCollection(
                (snapshot) => snapshot.val(),
                getError(props))
            .then(userProfile => {
                userProfile['diet'] = diet;
                userProfile['industry'] = industry;
                userProfile['cuisine'] = cuisine;
                firebaseSvc.updateCurrentUserCollection(userProfile, onSuccess('User Collection Update'), onFailure('User Collection Update'));
                props.navigation.navigate('RegisterPage4');
            })
            .catch(getError(props));
    
    /**
     * Generates Picker Labels
     * 
     * @returns List of Picker.items for diets
     */
    const dietaryOptions = (() => {
        let i = 0;
        return DIETS.map(diet => (<Picker.Item label={diet} value={diet} key={i++}/>));
    })();

    /**
     * Generates Picker Labels
     * 
     * @returns List of Picker.items for cuisines
     */
    const cuisineOptions = (() => {
        let i = 0;
        return CUISINES.map(cuisine => (<Picker.Item label={cuisine} value={cuisine} key={i++}/>));
    })();

    /**
     * Generates Picker Labels
     * 
     * @returns List of Picker.items for industries
     */
     const industryLabels = (() => {
        let pickerItems = [];
        for (let [code, industryTitle] of Object.entries(industries)) {
            pickerItems.push(<Picker.Item key ={code} label= {industryTitle} value ={code}/>);
        }
        return pickerItems;
    })();

    const showHideDiets = () => setShowDiets(!showDiets);
    const showHideCuisines = () => setShowCuisines(!showCuisines);
    const showHideIndustries = () => setShowIndustries(!showIndustries);

    const pickerText = (bool) => bool ? 'Close' : 'Change Preference';

    return (
    <SafeAreaView style={styles.container}>
        <Text style={pickerStyles.text}>Dietary Preference is {`${diet}\n`}</Text>
        {((!showCuisines && !showIndustries && !showDiets) || (showDiets)) && <Button title={`Tap here to ${pickerText(showDiets)}`} onPress={showHideDiets}/>}
            {(showDiets && !showCuisines && !showIndustries) &&
            <Picker
                        selectedValue={diet}
                        onValueChange={(newDiet, itemIndex) => {setDietPreference(newDiet)}}
                        style={pickerStyles.picker}
                        enabled= {true}
                        >
                    {dietaryOptions}
            </Picker>}
        <Text style={pickerStyles.text}>Cuisine Preference is {`${cuisine}`}</Text>
        {((!showCuisines && !showIndustries && !showDiets) || (showCuisines)) && <Button title={`Tap here to ${pickerText(showCuisines)}`} onPress={showHideCuisines}/>}
            {(!showDiets && showCuisines && !showIndustries) &&
            <Picker
                selectedValue={cuisine}
                onValueChange={(newCuisineItem, itemIndex) => {setCuisinePreference(newCuisineItem)}}
                style={pickerStyles.picker}
                >
                {cuisineOptions}
            </Picker>}
        <Text style={pickerStyles.text}>Industry: {`${INDUSTRY_CODES[industry]}`}</Text>
        {((!showCuisines && !showIndustries && !showDiets) || (showIndustries)) && <Button title={`Tap here to ${pickerText(showIndustries)}`} onPress={showHideIndustries}/>}
            {(!showDiets && !showCuisines && showIndustries) &&
            <Picker
                        selectedValue={industry}
                        onValueChange={(newIndustry, itemIndex) => {setIndustry(newIndustry)}}
                        style={pickerStyles.individualPicker}
                        enabled= {true}
                        >
                        {industryLabels}
            </Picker>}
        {(!showDiets && !showCuisines && !showIndustries) &&
            <View style={containerStyles.buttonRow}>
            <TouchableOpacity style={buttonStyles.tinyButton} onPress={() => props.navigation.goBack()}>
                <Text style={buttonStyles.loginButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buttonStyles.tinyButton} 
                            onPress={
                                () => {
                                        console.log('Register Page 3 done!');
                                        updatePreferences(diet, cuisine, industry);
                                }
                            }>
                <Text style={buttonStyles.loginButtonText}>Continue</Text>
            </TouchableOpacity>
        </View>}
    </SafeAreaView>
    )};

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection:'column',
            alignItems: 'center',
            justifyContent: 'center',
        }
    })