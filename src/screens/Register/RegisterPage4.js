import React, {useState} from 'react'
import {Text, View, SafeAreaView, TouchableOpacity} from 'react-native'
import {Picker} from '@react-native-picker/picker'
import {pickerStyles, buttonStyles, containerStyles} from '../../styles/LoginStyles'
import firebaseSvc from '../../firebase/FirebaseSvc'
import {onSuccess, onFailure, cancelRegistration, getError} from '../../services/RegistrationHandlers';

export default function RegisterPage3(props) {
    const [industry, setIndustry] = useState('indian');

    const updateIndustry = (industry) =>
        firebaseSvc
            .getUserCollection(
                (snapshot) => snapshot.val(),
                getError(props))
            .then(userProfile => {
                userProfile['industry'] = industry;
                firebaseSvc.updateUserCollection(userProfile, onSuccess('User Collection Update'), onFailure('User Collection Update'));
                props.navigation.navigate('RegisterPage5');
            })
            .catch(getError(props));

    // useEffect(() => {
    //     return cancelRegistration(props);
    // }, []);
    
    return (
    <SafeAreaView>
        <Text style={pickerStyles.text}>Which industry do your work in?</Text>
            <Picker
                        selectedValue={industry}
                        onValueChange={(newIndustry, itemIndex) => {setIndustry(newIndustry)}}
                        style={pickerStyles.picker}
                        enabled= {true}
                        >
                        <Picker.Item label="Human Resources" value = {01} />
                        <Picker.Item label="Law" value={02}/>
                        <Picker.Item label="Scientific Research" value={03} />
                        <Picker.Item label="Engineering" value={04} />
                        <Picker.Item label="Computing" value={05} />
                        <Picker.Item label="Marketing" value={06}/>
                        <Picker.Item label="Sales" value={07}/>
                        <Picker.Item label="Artist" value={08}/>
                        <Picker.Item label="Public Sector" value={09}/>
                        <Picker.Item label="Medicine" value={10}/>
                        <Picker.Item label="Shipping & Transportation" value={11}/>
                        <Picker.Item label="Others" value={00}/>
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