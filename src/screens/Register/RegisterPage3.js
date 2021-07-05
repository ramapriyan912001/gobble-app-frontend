import React, {useState} from 'react'
import {Text, View, SafeAreaView, TouchableOpacity, Platform, StyleSheet} from 'react-native'
import {Picker} from '@react-native-picker/picker'
import {pickerStyles, buttonStyles, containerStyles} from '../../styles/LoginStyles'
import firebaseSvc from '../../firebase/FirebaseSvc'
import {onSuccess, onFailure, cancelRegistration, getError} from '../../services/RegistrationHandlers';
import { CUISINES, DIETS, INDUSTRY_CODES } from '../../constants/objects'
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native-appearance';
import themes from '../../styles/Themes';
import {styles} from '../../styles/RegisterStyles';

/**
 * Page 3 for Registration
 * 
 * @param {*} props Props from previous screen
 * @returns RegisterPage3 Render Method
 */
export default function RegisterPage3(props) {
    let user = props.route.params;
    const [diet, setDietPreference] = useState('Halal');
    const [cuisine, setCuisinePreference] = useState('Western');
    const [industry, setIndustry] = useState(0);
    const [industries] = useState(INDUSTRY_CODES);
    const [showDiets, setShowDiets] = useState(false);
    const [showCuisines, setShowCuisines] = useState(false);
    const [showIndustries, setShowIndustries] = useState(false);
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';

    /**
     * Function to update the dietary restriction and cuisine preference in the database.
     * @param {*} diet The Dietary Restriction Chosen
     * @param {*} cuisine The Cuisine Preference chosen
     * @returns undefined
     */
    const updatePreferences = (diet, cuisine, industry) => props.navigation.navigate('RegisterPage4', {...user, diet: diet, cuisine: cuisine, industry: industry})
    
    /**
     * Generates Picker Labels
     * 
     * @returns List of Picker.items for diets
     */
    const dietaryOptions = (() => {
        let i = 0;
        return DIETS.map(diet => (<Picker.Item label={diet} color={Platform.OS === 'ios'? themes.oppositeTheme(isLight) : themes.oppositeTheme(!isLight)} value={diet} key={i++}/>));
    })();

    /**
     * Generates Picker Labels
     * 
     * @returns List of Picker.items for cuisines
     */
    const cuisineOptions = (() => {
        let i = 0;
        return CUISINES.map(cuisine => (<Picker.Item label={cuisine} color={Platform.OS === 'ios'? themes.oppositeTheme(isLight) : themes.oppositeTheme(!isLight)} value={cuisine} key={i++}/>));
    })();

    /**
     * Generates Picker Labels
     * 
     * @returns List of Picker.items for industries
     */
     const industryLabels = (() => {
        let pickerItems = [];
        for (let [code, industryTitle] of Object.entries(industries)) {
            pickerItems.push(<Picker.Item key ={code} label= {industryTitle} color={Platform.OS === 'ios'? themes.oppositeTheme(isLight) : themes.oppositeTheme(!isLight)} value ={code}/>);
        }
        return pickerItems;
    })();

    const showHideDiets = () => setShowDiets(!showDiets);
    const showHideCuisines = () => setShowCuisines(!showCuisines);
    const showHideIndustries = () => setShowIndustries(!showIndustries);

    const pickerText = (bool) => bool ? 'Close' : 'Change Preference';

    return (
    <SafeAreaView style={[styles.container, themes.containerTheme(isLight)]}>
        <Text style={[pickerStyles.text, themes.textTheme(isLight)]}>Dietary Preference is {`${diet}`}</Text>
        {((!showCuisines && !showIndustries && !showDiets) || (showDiets)) &&
            <TouchableOpacity
            onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
            showHideDiets();}}>
                <Text style={[{fontSize:15},themes.textTheme(isLight)]}>{`Tap here to ${pickerText(showDiets)}`}</Text>
            </TouchableOpacity>}
            {(showDiets && !showCuisines && !showIndustries) &&
            <Picker
                        selectedValue={diet}
                        onValueChange={(newDiet, itemIndex) => {setDietPreference(newDiet)}}
                        style={{...pickerStyles.picker, color: themes.oppositeTheme(isLight)}}
                        enabled= {true}
                        >
                    {dietaryOptions}
            </Picker>}
        <Text style={[pickerStyles.text, themes.textTheme(isLight)]}>Cuisine Preference is {`${cuisine}`}</Text>
        {((!showCuisines && !showIndustries && !showDiets) || (showCuisines)) && 
            <TouchableOpacity
            onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
            showHideCuisines();}}>
                <Text style={[{fontSize:15},themes.textTheme(isLight)]}>{`Tap here to ${pickerText(showCuisines)}`}</Text>
            </TouchableOpacity>
            }
            {(!showDiets && showCuisines && !showIndustries) &&
            <Picker
                selectedValue={cuisine}
                onValueChange={(newCuisineItem, itemIndex) => {setCuisinePreference(newCuisineItem)}}
                style={{...pickerStyles.picker, color: themes.oppositeTheme(isLight)}}
                >
                {cuisineOptions}
            </Picker>}
        <Text style={[pickerStyles.text, themes.textTheme(isLight)]}>Industry: {`${INDUSTRY_CODES[industry]}`}</Text>
        {((!showCuisines && !showIndustries && !showDiets) || (showIndustries)) && 
            <TouchableOpacity
            onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
            showHideIndustries();}}>
                <Text style={[{fontSize:15},themes.textTheme(isLight)]}>{`Tap here to ${pickerText(showIndustries)}`} </Text>
            </TouchableOpacity>}
            {(!showDiets && !showCuisines && showIndustries) &&
            <Picker
                        selectedValue={industry}
                        onValueChange={(newIndustry, itemIndex) => {setIndustry(newIndustry)}}
                        style={{...pickerStyles.picker, color: themes.oppositeTheme(isLight)}}
                        enabled= {true}
                        >
                        {industryLabels}
            </Picker>}
        {(!showDiets && !showCuisines && !showIndustries) &&
            <View style={containerStyles.buttonRow}>
            <TouchableOpacity style={[styles.tinyButton, themes.buttonTheme(isLight)]} onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                props.navigation.goBack();}}>
                <Text style={[buttonStyles.loginButtonText, themes.textTheme(!isLight)]}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tinyButton, themes.buttonTheme(isLight)]} 
                            onPress={
                                () => {
                                        console.log('Register Page 3 done!');
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                                        updatePreferences(diet, cuisine, industry);
                                }
                            }>
                <Text style={[buttonStyles.loginButtonText, themes.textTheme(!isLight)]}>Continue</Text>
            </TouchableOpacity>
        </View>}
    </SafeAreaView>
    )};