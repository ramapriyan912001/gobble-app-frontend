import React, {useState} from 'react'
import {Text, View, SafeAreaView, Switch, TouchableOpacity, Alert, Button, StyleSheet} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import {containerStyles, buttonStyles, pickerStyles, inputStyles} from '../../styles/LoginStyles'
import {onSuccess, onFailure, cancelRegistration, getError} from '../../services/RegistrationHandlers';
import firebaseSvc from '../../firebase/FirebaseSvc';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native-appearance';
import themes from '../../styles/Themes';
import {styles} from '../../styles/RegisterStyles';

/**
 * Last Page of Registration
 * 
 * @param {*} props Props from previous screen
 * @returns RegisterPage4 Render Method
 */
export default function RegisterPage4(props) {
    let user = props.route.params;
    const [cross, setCrossIndustryPreference] = useState(false);
    const [date, setDate] = useState(new Date());
    const [isPickerShow, setIsPickerShow] = useState(false);
    const MAX_DATE = new Date();
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';

    //Handlers for Action Failure:

    const authUpdateSuccess = () => firebaseSvc.updateCurrentUserCollection({...user, crossIndustrial: cross, dob: date.toString(), password: null, dateJoined: new Date().toString()}, onSuccess('User Collection Update'), onFailure('User Collection Update'));
    const authUpdateFailure = (err) => {Alert.alert('Profile cannot be created!', err.message)};

    const authCreationSuccess = (userCredential) => firebaseSvc.updateUserProfile({displayName: user.name, photoURL: user.avatar}, authUpdateSuccess, authUpdateFailure);
    const authCreationFailure = (err) => Alert.alert('Account cannot be created!', err.message);  

    /**
     * Finalize Registration
     * 
     * @returns undefined
     */
    const addUser = () => firebaseSvc.createUser(user, authCreationSuccess, authCreationFailure);
    
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
    <SafeAreaView style={[specificStyles.container, themes.containerTheme(isLight)]}>
        <Text style={[pickerStyles.text, themes.textTheme(isLight)]}>Would you like to be matched with other Industrial Backgrounds?{`${'\n'}`}Current Choice: {switchText()}</Text>
        {!isPickerShow &&
        <Switch 
            value={cross} 
            onValueChange={() => {setCrossIndustryPreference(!cross)}} 
            style={pickerStyles.switch}
        />}
        <View>
                        <Text style={[{...inputStyles.subHeader, marginTop: '5%'}, themes.textTheme(isLight)]}>Tell us your Birthday!</Text>
                        <Button 
                        color={themes.oppositeTheme(isLight)}
                        title={`Chosen: ${date.toLocaleString().slice(0, 10)} ${'\n'}Click me to ${pickerText()}`} 
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            showPicker();}} />
                        
                        {/* The date picker */}
                        {isPickerShow && (
                            <DateTimePicker
                            value={date}
                            mode={'date'}
                            display={Platform.OS === 'ios' ? 'inline' : 'default'}
                            is24Hour={true}
                            onChange={onChange}
                            style={specificStyles.datePicker}
                            maximumDate={MAX_DATE}
                            />
                        )}
            </View>
        {!isPickerShow &&
        <TouchableOpacity style={[styles.longButton, themes.buttonTheme(isLight)]} 
                        onPress={
                            () => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                if ((new Date().getFullYear() - date.getFullYear()) < 13) {
                                    Alert.alert('Too Young to Sign Up! Sorry');
                                } else {
                                    addUser();
                                    console.log('Registered User');
                                    props.navigation.navigate('FinalStep');
                                }
                            }
                        }>
                    <Text style={[buttonStyles.loginButtonText, themes.textTheme(!isLight)]}>Finish</Text>
        </TouchableOpacity>}
        {!isPickerShow &&
        <TouchableOpacity style={[styles.longButton, themes.buttonTheme(isLight)]} onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            props.navigation.goBack();}}>
            <Text style={[buttonStyles.loginButtonText, themes.textTheme(!isLight)]}>Back</Text>
        </TouchableOpacity>}
    </SafeAreaView>
    )
};

const specificStyles = StyleSheet.create({
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