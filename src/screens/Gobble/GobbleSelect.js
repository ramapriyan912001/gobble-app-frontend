import React, {useEffect, useState} from 'react'
import {Platform, View, Text, Button, TouchableOpacity, ScrollView, SafeAreaView, Alert} from 'react-native'
import * as Location from 'expo-location'
import {containerStyles, buttonStyles, inputStyles, pickerStyles} from '../../styles/LoginStyles'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DateTimePicker from '@react-native-community/datetimepicker'
import {Picker} from '@react-native-picker/picker';
import firebaseSvc from '../../firebase/FirebaseSvc';
import {fetchUserData, updateUserDetails, clearData} from '../../redux/actions/actions'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
// import RNLocation, { getLatestLocation } from 'react-native-location'
// import RNGeolocationService from 'react-native-geolocation-service'
// import {getDistance} from 'geolib'

function GobbleSelect(props) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [cuisinePreference, setCuisinePreference] = useState('Western')
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [loading, setLoading] = useState(true)
  const MIN_DATE = new Date();
  const MAX_DATE = new Date().setDate(MIN_DATE.getDate()+7)
  const [date, setDate] = useState(MIN_DATE)

  useEffect(() => {
      (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission Denied')
                console.log(errorMsg)
                Alert.alert('We need Location Permission!', 'You can change permissions in your phone settings');
            } else {
                let location = await Location.getCurrentPositionAsync({})
                setLocation(location)  
            }
            setLoading(false); 
      })();
  }, []);

  let text = 'Waiting'
  if (errorMsg) {
      text = errorMsg
  } else if (location) {
      text = JSON.stringify(location)
  }

  const renderCuisines = () => {
      const cuisines = ['Western', 'Indian', 'Asian', 'Food Court', 'No Preference'];
      let cuisineID = 0;

      return cuisines.map(cuisine => (<Picker.Item label={cuisine} value={cuisine} key={cuisineID++}/>))
  };

  

  function submitGobble() {
      if (loading) {
          //Do Nothing
      } else if(location == null) {
          Alert.alert('We need Location Permission!', 'You can change permissions in your phone settings');
      } else {
        const gobbleRequest = {
            userId: firebaseSvc.currentUser().uid,
            dietaryRestriction: props.currentUserData.diet,
            industryPreference: props.currentUserData.crossIndustrial ? 'ANY' : props.currentUserData.industry,
            industry: props.currentUserData.industry,
            cuisinePreference: cuisinePreference,
            datetime: date.toDateString(),
            location: location,
            distance: 200,
        }
        // console.log(gobbleRequest, 'ongoing')
        // We need to do some load page
        props.navigation.navigate('GobbleSelect2', {req: gobbleRequest})
      }
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
            <View style={{marginTop: '20%'}}>
                        <Text style={{...inputStyles.headerText, fontSize: 20, margin: '0%'}}>
                                Select your preferences and Gobble!
                        </Text>
            </View>  
            <View>
                        <Text style={{...inputStyles.subHeader, marginTop: '10%'}}>Choose a date and time for your next Gobble!</Text>
                        <Button title={date.toLocaleString()} onPress={showDatePicker} />
                        <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode={"datetime"}
                        display={'spinner'}
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        pickerContainerStyleIOS={{backgroundColor: 'black'}}
                        pickerStyleIOS={{backgroundColor: 'black'}}
                        />
            </View>
            <View>
                    <Text style={{...inputStyles.subHeader, marginTop: '20%'}}>...And what are you in the mood for today?</Text>
                    <Picker
                        selectedValue={cuisinePreference}
                        onValueChange={(itemValue, itemIndex) => setCuisinePreference(itemValue)}>
                        {renderCuisines()}
                    </Picker>
            </View>
            <TouchableOpacity style={{...buttonStyles.loginButton, marginTop: '10%'}} onPress={submitGobble}>
                <Text style={buttonStyles.loginButtonText}>Next</Text>
            </TouchableOpacity>        
        </SafeAreaView>
    )
}

const mapStateToProps = (store) => ({
    currentUserData: store.userState.currentUserData,
    loggedIn: store.userState.loggedIn,
    isAdmin: store.userState.isAdmin
})
const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchUserData }, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(GobbleSelect);
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