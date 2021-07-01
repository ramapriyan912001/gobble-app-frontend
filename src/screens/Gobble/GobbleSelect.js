import React, {useEffect, useState} from 'react'
import {Platform, View, Text, Button, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ScrollView} from 'react-native'
import * as Location from 'expo-location'
import {containerStyles, buttonStyles, inputStyles, pickerStyles} from '../../styles/LoginStyles'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DateTimePicker from '@react-native-community/datetimepicker'
import {Picker} from '@react-native-picker/picker';
import firebaseSvc from '../../firebase/FirebaseSvc';
import { CUISINES } from '../../constants/objects';
import {fetchUserData, updateUserDetails, clearData} from '../../redux/actions/actions'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'

/**
 * Page to search for a new Match
 * 
 * @param {*} props Props from previous screen
 * @returns GobbleSelect Render Method 
 */
function GobbleSelect(props) {
  const [isPickerShow, setIsPickerShow] = useState(false);
  const [cuisinePreference, setCuisinePreference] = useState('Western')
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [loading, setLoading] = useState(true)
  const MIN_DATE = new Date();
  const MAX_DATE = new Date().setDate(MIN_DATE.getDate()+7)
  const [date, setDate] = useState(MIN_DATE)
  const [distance, setDistance] = useState(1);

  useEffect(() => {
      /**
       * Function to get and set User's current location
       */
      (async () => {
          await props.fetchUserData();
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

  const showPicker = () => {
    setIsPickerShow(!isPickerShow);
  };

  const pickerText = () => isPickerShow ? 'Close' : 'choose Date & Time';

  const onChange = (event, value) => {
    setDate(value);
    if (Platform.OS === 'android') {
      setIsPickerShow(false);
    }
  };

  /**
   * Function to load all Cuisines
   * 
   * @returns List of Picker Items of Cuisines
   */
  const renderCuisines = () => {
      let cuisineID = 0;
      return CUISINES.map(cuisine => (<Picker.Item label={cuisine} value={cuisine} key={cuisineID++}/>))
  };

  const renderDistances = () => {
    const distances = [1, 2, 5, 10, 200];
    let distanceID = 0;

    return distances.map(distance => (<Picker.Item label={distance == 200 ? 'No Preference' : `${distance} km`} value={distance} key={distanceID++}/>))
  };

  /**
   * Function to create a request and pass it to the next page
   */
  async function submitGobble() {
      if (loading) {
          Alert.alert('Hang on for a sec!', 'We\'re still getting your location');
      } else if(location == null) {
          Alert.alert('We need Location Permission!', 'You can change permissions in your phone settings');
      } else {
        const gobbleRequest = {
            userId: firebaseSvc.currentUser().uid,
            dietaryRestriction: props.currentUserData.diet,
            industryPreference: props.currentUserData.crossIndustrial ? 12 : props.currentUserData.industry,
            industry: props.currentUserData.industry,
            cuisinePreference: cuisinePreference,
            datetime: date.toString(),
            location: location,
            distance: distance,
        }
        let result =  await firebaseSvc.findGobbleMate(gobbleRequest);
        // We need to do some load page
        props.navigation.navigate('GobbleConfirm', {result: result})
      }
  }

  const handleConfirm = (date) => {
    setDate(date);
    hideDatePicker();
  };
    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView>
            <View style={{marginTop: '5%'}}>
                        <Text style={{...inputStyles.headerText, fontSize: 20, margin: '2%'}}>
                                Select your preferences and Gobble!
                        </Text>
            </View>  
            <View>
                        <Text style={{...inputStyles.subHeader, marginTop: '0%'}}>Pick out your preferred Date & Time</Text>
                        <Button title={`Chosen: ${date.toLocaleString([], {hour: 'numeric', minute:'2-digit'})} ${'\n'}Click me to ${pickerText()}`} onPress={showPicker} />
                        
                        {/* The date picker */}
                        {isPickerShow && (
                            <DateTimePicker
                            value={date}
                            mode={'datetime'}
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            is24Hour={true}
                            onChange={onChange}
                            style={styles.datePicker}
                            maximumDate={MAX_DATE}
                            minimumDate={MIN_DATE}
                            minuteInterval={15}
                            />
                        )}
            </View>
            <View style={{...styles.container, marginTop: '0%'}}>
                    {!isPickerShow && <Text style={{...inputStyles.subHeader, marginTop: '0%'}}>...And what are you in the mood for today?</Text>}
                    {!isPickerShow && <Picker
                       
                        selectedValue={cuisinePreference}
                        onValueChange={(itemValue, itemIndex) => setCuisinePreference(itemValue)}>
                        {renderCuisines()}
                    </Picker>}
            </View>
            <View style={{...styles.container, marginTop: '0%'}}>
                    <Text style={{...inputStyles.subHeader, marginTop: '0%'}}>How far are you willing to travel for a meal?</Text>
                    <Picker
                        selectedValue={distance}
                        onValueChange={(itemValue, itemIndex) => setDistance(itemValue)}>
                        {renderDistances()}
                    </Picker>
            </View>
            <View style={{marginTop: '-10%', marginBottom: '2%'}}>
                {!isPickerShow && <TouchableOpacity style={{...buttonStyles.loginButton, marginTop: '0%'}} onPress={submitGobble}>
                    <Text style={buttonStyles.loginButtonText}>Submit Gobble</Text>
                </TouchableOpacity>}
            </View>
            </ScrollView>
        </SafeAreaView>
    )
}

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
    //Below is iOS Only
    datePicker: {
        width: 320,
        height: 260,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    cuisinePicker: {
        marginTop: '0%'
    }
})

const mapStateToProps = (store) => ({
    currentUserData: store.userState.currentUserData,
    loggedIn: store.userState.loggedIn,
    isAdmin: store.userState.isAdmin
})
const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchUserData }, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(GobbleSelect);