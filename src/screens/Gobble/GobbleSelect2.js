import React, {useEffect, useState} from 'react'
import {Platform, View, Text, Button, TouchableOpacity, ScrollView, SafeAreaView, Alert} from 'react-native'
import * as Location from 'expo-location'
import {containerStyles, buttonStyles, inputStyles} from '../../styles/LoginStyles'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {Picker} from '@react-native-picker/picker';
import firebaseSvc from '../../firebase/FirebaseSvc';
import {fetchUserData, updateUserDetails, clearData} from '../../redux/actions/actions'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
// import RNLocation, { getLatestLocation } from 'react-native-location'
// import RNGeolocationService from 'react-native-geolocation-service'
// import {getDistance} from 'geolib'

function GobbleSelect2(props) {
  const [distance, setDistance] = useState(1);
  const request = props.route.params.req;
//   useEffect(() => {
      
//   }, []);

  const renderDistances = () => {
    const distances = [1, 2, 5, 10, 200];
    let distanceID = 0;

    return distances.map(distance => (<Picker.Item label={distance == 200 ? 'No Preference' : `${distance} km`} value={distance} key={distanceID++}/>))
  };

  async function submitGobble() {
    const gobbleRequest = {
        userId: request.userId,
        dietaryRestriction: request.dietaryRestriction,
        industryPreference: request.industryPreference,
        industry: request.industry,
        cuisinePreference: request.cuisinePreference,
        datetime: request.datetime,
        location: request.location,
        distance: distance,
    }
    let result =  await firebaseSvc.findGobbleMate(gobbleRequest);
    // We need to do some load page
    props.navigation.navigate('GobbleConfirm', {result: result});
  }
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDate(date);
    hideDatePicker();
  };
    return (
        <SafeAreaView>
            <View style={{position: 'relative', marginTop: '50%'}}>
                    <Text style={{...inputStyles.subHeader,}}>...And How far are you willing to travel for a meal?</Text>
                    <Picker
                        selectedValue={distance}
                        onValueChange={(itemValue, itemIndex) => setDistance(itemValue)}>
                        {renderDistances()}
                    </Picker>
                </View>
                <View style={{position: 'relative'}}>
                <TouchableOpacity style={{...buttonStyles.loginButton, margin: '0%'}} onPress={() => submitGobble()}>
                    <Text style={{...buttonStyles.loginButtonText, fontSize: 20}}>Find Gobblemate!</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{...buttonStyles.loginButton, margin: '0%'}} onPress={() => props.navigation.goBack()}>
                    <Text style={{...buttonStyles.loginButtonText, fontSize: 20}}>Back</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const mapStateToProps = (store) => ({
    currentUserData: store.userState.currentUserData,
    loggedIn: store.userState.loggedIn,
    isAdmin: store.userState.isAdmin
})
const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchUserData }, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(GobbleSelect2);
/*
<Picker.Item label="Western" value={"Western"}></Picker.Item>
                        <Picker.Item label="Indian" value={"Indian"}></Picker.Item>
                        <Picker.Item label="Asian" value={"Asian"}></Picker.Item>
                        <Picker.Item label="Food Court" value={"Food Court"}></Picker.Item>
                        <Picker.Item label="No Preference" value={"No Preference"}></Picker.Item>
<Picker.Item label="1 km" value={1}></Picker.Item>
                        <Picker.Item label="2 km" value={2}></Picker.Item>
                        <Picker.Item label="5 km" value={5}></Picker.Item>
                        <Picker.Item label="10 km" value={10}></Picker.Item>
                        <Picker.Item label="No Preference" value={200}></Picker.Item>
                        */