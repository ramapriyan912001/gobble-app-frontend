import React, {useState} from 'react'
import {Text, View, SafeAreaView, Switch, TouchableOpacity, Alert, Button, StyleSheet} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import {containerStyles, buttonStyles, pickerStyles, inputStyles} from '../../styles/LoginStyles'
import {onSuccess, onFailure, cancelRegistration, getError} from '../../services/RegistrationHandlers';
import firebaseSvc from '../../firebase/FirebaseSvc';

/**
 * Last Page of Registration
 * 
 * @param {*} props Props from previous screen
 * @returns RegisterPage4 Render Method
 */
export default function RegisterPage4(props) {
    const [cross, setCrossIndustryPreference] = useState(false);
    const [date, setDate] = useState(new Date());
    const [isPickerShow, setIsPickerShow] = useState(false);
    const MAX_DATE = new Date();

    //Handlers for Action Failure:

    /**
     * Finalize Registration
     * 
     * @param {*} cross Whether the user is okay with crossIndustrial matchings
     * @returns undefined
     */
    const addUser = (cross) => 
        firebaseSvc
            .getCurrentUserCollection(
                (snapshot) => snapshot.val(),
                getError(props))
            .then(userProfile => {
                userProfile['crossIndustrial'] = cross;
                userProfile['dob'] = date.toDateString();
                userProfile['completed'] = true;
                userProfile['dateJoined'] = new Date().toDateString();
                firebaseSvc.updateCurrentUserCollection(userProfile, onSuccess('User Collection Update'), onFailure('User Collection Update'));
            })
            .catch(getError(props));
    
    /**
     * Function to handle date picker change
     * 
     * @param {*} event Event occurred
     * @param {*} selectedDate Date Selected
     */
     const onChange = (event, value) => {
        setDate(value);
        if (Platform.OS === 'android') {
            setIsPickerShow(false);
        }
    };

    const showPicker = () => {
        setIsPickerShow(!isPickerShow);
    };
        
    const pickerText = () => isPickerShow ? 'Close' : 'choose Date & Time';
    const switchText = () => cross ? 'Yes!' : 'No!';

    return(
    <SafeAreaView style={styles.container}>
        <Text style={pickerStyles.text}>Would you like to be matched with other Industrial Backgrounds?{`${'\n'}`}Current Choice: {switchText()}</Text>
        {!isPickerShow &&
        <Switch 
            value={cross} 
            onValueChange={() => {setCrossIndustryPreference(!cross)}} 
            style={pickerStyles.switch}
        />}
        <View>
                        <Text style={{...inputStyles.subHeader, marginTop: '5%'}}>Tell us your Birthday!</Text>
                        <Button title={`Chosen: ${date.toLocaleString().slice(0, 10)} ${'\n'}Click me to ${pickerText()}`} onPress={showPicker} />
                        
                        {/* The date picker */}
                        {isPickerShow && (
                            <DateTimePicker
                            value={date}
                            mode={'date'}
                            display={Platform.OS === 'ios' ? 'inline' : 'default'}
                            is24Hour={true}
                            onChange={onChange}
                            style={styles.datePicker}
                            maximumDate={MAX_DATE}
                            />
                        )}
            </View>
        {!isPickerShow &&
        <TouchableOpacity style={buttonStyles.loginButton} 
                        onPress={
                            () => {
                                if ((new Date().getFullYear() - date.getFullYear()) < 13) {
                                    Alert.alert('Too Young to Sign Up! Sorry');
                                } else {
                                    addUser(cross);
                                    console.log('Registered User');
                                    props.navigation.navigate('FinalStep');
                                }
                            }
                        }>
                    <Text style={buttonStyles.loginButtonText}>Finish</Text>
        </TouchableOpacity>}
        {!isPickerShow &&
        <TouchableOpacity style={buttonStyles.loginButton} onPress={() => props.navigation.goBack()}>
            <Text style={buttonStyles.loginButtonText}>Back</Text>
        </TouchableOpacity>}
    </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    pickedDateContainer: {
        padding: 20,
        backgroundColor: '#eee',
        borderRadius: 10,
    },
    pickedDate: {
        fontSize: 18,
        color: 'black',
    },
    container:{
        flex: 1,
        flexDirection:'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    //Below datePicker is iOS Only
    datePicker: {
        width: 320,
        height: 420,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    cuisinePicker: {
        marginTop: '0%'
    }
})