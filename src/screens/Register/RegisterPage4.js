import React, {useState} from 'react'
import {Text, View, SafeAreaView, TouchableOpacity} from 'react-native'
import {Picker} from '@react-native-picker/picker'
import {pickerStyles, buttonStyles, containerStyles} from '../../styles/LoginStyles'
import firebaseSvc from '../../firebase/FirebaseSvc'
import {onSuccess, onFailure, cancelRegistration, industryCodes, getError} from '../../services/RegistrationHandlers';

export default function RegisterPage4(props) {
    const [industry, setIndustry] = useState(0);
    const [industries] = useState(industryCodes);

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

    // useEffect(() => {
    //     return cancelRegistration(props);
    // }, []);
    const industryLabels = () => {
        let pickerItems = [];
        // <Picker.Item label= value = {industryCodes['Human Resources']}/>
        //                 <Picker.Item label="Law" value={}/>
        //                 <Picker.Item label="Scientific Research" value=3 />
        //                 <Picker.Item label="Engineering" value=4 />
        //                 <Picker.Item label="Computing" value=5 />
        //                 <Picker.Item label="Marketing" value=6/>
        //                 <Picker.Item label="Sales" value=7/>
        //                 <Picker.Item label="Artist" value=8/>
        //                 <Picker.Item label="Public Sector" value=9/>
        //                 <Picker.Item label="Medicine" value=10/>
        //                 <Picker.Item label="Shipping & Transportation" value=11/>
        //                 <Picker.Item label="Others" value=00/>
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