import React, {useState} from 'react'
import {Text, View, SafeAreaView, TouchableOpacity} from 'react-native'
import {Picker} from '@react-native-picker/picker'
import {pickerStyles, buttonStyles, containerStyles} from '../../styles/LoginStyles'
import firebaseSvc from '../../firebase/FirebaseSvc'
import {onSuccess, onFailure, cancelRegistration, getError} from '../../services/RegistrationHandlers';
import { INDUSTRY_CODES } from '../../constants/objects'

/**
 * Page 4 for Registration
 * 
 * @param {*} props Props from previous screen
 * @returns RegisterPage4 Render Method
 */
export default function RegisterPage4(props) {
    const [industry, setIndustry] = useState(0);
    const [industries] = useState(INDUSTRY_CODES);

    /**
     * Update Industry of User in the database
     * 
     * @param {*} industry The Industry code of the user
     * @returns undefined
     */
    const updateIndustry = (industry) =>
        firebaseSvc
            .getCurrentUserCollection(
                (snapshot) => snapshot.val(),
                getError(props))
            .then(userProfile => {
                userProfile['industry'] = industry;
                firebaseSvc.updateCurrentUserCollection(userProfile, onSuccess('User Collection Update'), onFailure('User Collection Update'));
                props.navigation.navigate('RegisterPage5');
            })
            .catch(getError(props));

    /**
     * Generates Picker Labels
     * 
     * @returns List of Picker.items for industries
     */
    const industryLabels = () => {
        let pickerItems = [];
        for (let [code, industryTitle] of Object.entries(industries)) {
            pickerItems.push(<Picker.Item key ={code} label= {industryTitle} value ={code}/>);
        }
        return pickerItems;
    }
    
    return (
    <SafeAreaView>
        <Text style={pickerStyles.text}>Which industry do your work in?</Text>
            <Picker
                        selectedValue={industry}
                        onValueChange={(newIndustry, itemIndex) => {setIndustry(newIndustry)}}
                        style={pickerStyles.individualPicker}
                        enabled= {true}
                        >
                        {industryLabels()}
            </Picker>
        <View style={containerStyles.buttonRow}>
            <TouchableOpacity style={buttonStyles.tinyButton} onPress={() => props.navigation.goBack()}>
                <Text style={buttonStyles.loginButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buttonStyles.tinyButton} 
                            onPress={
                                () => {
                                        console.log('Register Page 4 done!');
                                        updateIndustry(industry);
                                }
                            }>
                <Text style={buttonStyles.loginButtonText}>Continue</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
    )};