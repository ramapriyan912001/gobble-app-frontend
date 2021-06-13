import React, {useState} from 'react'
import {Text, View, SafeAreaView, Switch, TouchableOpacity, Alert} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import {containerStyles, buttonStyles, pickerStyles, inputStyles} from '../styles/LoginStyles'
import {onSuccess, onFailure, cancelRegistration, getError} from '../services/RegistrationHandlers';
import firebaseSvc from '../reducers/FirebaseSvc';

export default function RegisterPage4(props) {
    const [cross, setCrossIndustryPreference] = useState(false);
    const [date, setDate] = useState(new Date(1666666660));
    const [show, setShow] = useState(false);
    //Handlers for Action Failure:

    const addUser = (cross) => 
        firebaseSvc
            .getUserCollection(
                (snapshot) => snapshot.val(),
                getError(props))
            .then(userProfile => {
                userProfile['crossIndustrial'] = cross;
                userProfile['dob'] = date.toDateString();
                firebaseSvc.updateUserCollection(userProfile, onSuccess('User Collection Update'), onFailure('User Collection Update'));
            })
            .catch(getError(props));
    
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        };

    // useEffect(() => {
    //     return cancelRegistration(props);
    // }, []);

    return(
    <SafeAreaView style={containerStyles.container}>
        <Text style={pickerStyles.text}>Would you like to be matched with other Industrial Backgrounds?</Text>
        <Switch 
            value={cross} 
            onValueChange={() => {setCrossIndustryPreference(!cross)}} 
            style={pickerStyles.switch}
        />
        <View>
            <TouchableOpacity onPress={() => setShow(true)} style={buttonStyles.tinyButton}>
                <Text style={buttonStyles.loginButtonText}>Tell us your Birthday!</Text>
            </TouchableOpacity>
        </View>
        <View style={containerStyles.datePicker}>
            {show && (
                <DateTimePicker
                        value={date}
                        mode={'date'}
                        onChange={onChange}
                        display="default"
                        style={pickerStyles.datePicker}
                />
            )}
        </View>
        <Text style={inputStyles.subText}>{date.toDateString()}</Text>
        <TouchableOpacity style={buttonStyles.loginButton} 
                        onPress={
                            () => {
                                addUser(cross);
                                console.log('Registered User');
                                props.navigation.navigate('FinalStep');
                            }
                        }>
                    <Text style={buttonStyles.loginButtonText}>Finish</Text>
        </TouchableOpacity>
        <TouchableOpacity style={buttonStyles.loginButton} onPress={() => props.navigation.goBack()}>
            <Text style={buttonStyles.loginButtonText}>Back</Text>
        </TouchableOpacity>
    </SafeAreaView>
    )
};

/*
Date TIme Picker (Not working for Android)
<Text style={pickerStyles.dateText}>Tell us your Birthday!</Text>
<View style={containerStyles.datePicker}>
            <DateTimePicker
            value={date}
            onChange={(event, selectedDate) => {setDate(selectedDate);initialState.dob = selectedDate;}}
            style={pickerStyles.datePicker}
            />
</View>
*/