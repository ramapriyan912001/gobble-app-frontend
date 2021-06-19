import React, {useState} from 'react'
import {View, Text, Button, TouchableOpacity, ScrollView, SafeAreaView} from 'react-native'
import {containerStyles, buttonStyles, inputStyles} from '../../styles/LoginStyles'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {Picker} from '@react-native-picker/picker';
// import {CURR_DATE, MIN_DATE, MAX_DATE} from '../../constants/dates'
import firebaseSvc from '../../firebase/FirebaseSvc';
import {fetchUser, updateUserDetails, clearData} from '../../redux/actions/actions'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import RNLocation from 'react-native-location'
import RNGeolocationService from 'react-native-geolocation-service'

export function GobbleSelect() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [distance, setDistance] = useState(1);
  const [cuisinePreference, setCuisinePreference] = useState('')
  const [location, setLocation] = useState('')
  const MIN_DATE = new Date()
  const MAX_DATE = new Date().setDate(MIN_DATE+7)
  const [date, setDate] = useState(MIN_DATE)


  function submitGobble() {
      const gobbleRequest = {
          userId: firebaseSvc.uid(),
          dietaryRestriction: props.currentUser.diet,
          industry: props.currentUser.crossIndustrial ? props.currentUser.industry : 'ANY',
          cuisinePreference: cuisinePreference,
          location: location,
          distance: distance

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
        <ScrollView contentContainerStyle={{...containerStyles.container, marginTop: '-10%', height: '100%'}}>
                <SafeAreaView style={{position: 'absolute'}}>
                    <View style={{position: 'relative'}}>
                        <Text style={{...inputStyles.headerText, fontSize: 20, margin: '0%'}}>
                                Select your preferences and Gobble!
                        </Text>
                    </View>
                    <View style={{position: 'relative', marginTop: '-5%'}}>
                        <Text style={{...inputStyles.subHeader}}>Choose a date and time for your next Gobble!</Text>
                        <Button title={date.toLocaleString()} onPress={showDatePicker} />
                        <DateTimePickerModal
                        minimumDate={MIN_DATE}
                        maximumDate={MAX_DATE}
                        isVisible={isDatePickerVisible}
                        mode="datetime"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        />
                    </View>
                    <View style={{position: 'relative', marginTop: '2%'}}>
                    <Text style={{...inputStyles.subHeader}}>...And How far are you willing to travel for a meal?</Text>
                    <Picker
                        selectedValue={cuisinePreference}
                        onValueChange={(itemValue, itemIndex) => {
                            setCuisinePreference(itemValue)
                        }}>
                        <Picker.Item label="Western" value={1}></Picker.Item>
                        <Picker.Item label="Indian" value={2}></Picker.Item>
                        <Picker.Item label="Asian" value={5}></Picker.Item>
                        <Picker.Item label="Food Court" value={10}></Picker.Item>
                        <Picker.Item label="No Preference" value={200}></Picker.Item>
                    </Picker>
                    </View>
                    <View style={{position: 'relative', marginTop: '0%'}}>
                    <Text style={{...inputStyles.subHeader,}}>...And what are you in the mood for today?</Text>
                    <Picker
                        selectedValue={distance}
                        onValueChange={(itemValue, itemIndex) => {
                            setDistance(itemValue)
                        }}>
                        <Picker.Item label="1 km" value={1}></Picker.Item>
                        <Picker.Item label="2 km" value={2}></Picker.Item>
                        <Picker.Item label="5 km" value={5}></Picker.Item>
                        <Picker.Item label="10 km" value={10}></Picker.Item>
                        <Picker.Item label="No Preference" value={200}></Picker.Item>
                    </Picker>
                </View>
                <View>

                </View>
                <View style={{position: 'relative'}}>
                    <TouchableOpacity style={{...buttonStyles.loginButton, margin: '0%'}} onPress={() => submitGobble()}>
                        <Text style={{...buttonStyles.loginButtonText, fontSize: 20}}>Find Gobblemate!</Text>
                    </TouchableOpacity>
                </View>
                </SafeAreaView>
        </ScrollView>
    )
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    loggedIn: store.userState.loggedIn,
    isAdmin: store.userState.isAdmin
})
const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchUser }, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(GobbleSelect);