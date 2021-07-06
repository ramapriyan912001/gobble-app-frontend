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
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native-appearance';
import themes from '../../styles/Themes';
import {styles} from '../../styles/RegisterStyles';

/**
 * Page to search for a new Match
 * 
 * @param {*} props Props from previous screen
 * @returns GobbleSelect Render Method 
 */
function GobbleSelect(props, {navigation}) {
  const [isPickerShow, setIsPickerShow] = useState(false);
  const [cuisinePreference, setCuisinePreference] = useState('Any')
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dateSelected, setDateSelected] = useState(false)
  const MIN_DATE = new Date();
  const MAX_DATE = new Date().setDate(MIN_DATE.getDate()+7)
  const [date, setDate] = useState(calculateDefaultTime(MIN_DATE))
  const [distance, setDistance] = useState(200);
  const [edit, setEdit] = useState(true);
  const colorScheme = useColorScheme();
  const isLight = colorScheme === 'light';

  function calculateDefaultTime(date) {
      if(props.route.params && edit) {
          console.log(props.route.params.request.datetime, 'this');
          const unformattedDate = props.route.params.request.datetime;

        const date = new Date(unformattedDate);
        return date;
      } else {
        date = new Date(date)
      }
      let minutes = date.getMinutes();
      let hours = date.getHours();
      if(!dateSelected) {
        if(minutes < 5) {
            date.setMinutes(15)
        } else if (minutes < 25){
            date.setMinutes(30)
        } else if (minutes < 40) {
            date.setMinutes(45)
        } else {
            if(hours == 23) {
                date.setDate(date.getDate() +1)
                date.setHours(0)
                
            } else {
                hours = hours +1
                date.setHours(hours)
            }
            if(minutes < 55) {
                date.setMinutes(0)
            } else {
                date.setMinutes(15)
            }
        }
      }
      date.setSeconds(0)
      date.setMilliseconds(0)
      return date;
  }

  const dateStringMaker = (date) => {
    return date.slice(0,11) + date.slice(16,21)
  }

  useEffect(() => {
      /**
       * Function to get and set User's current location
       */
      (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if(props.route.params && edit) {
                setEdit(false)
                setCuisinePreference(props.route.params.request.cuisinePreference)
                setDistance(props.route.params.request.distance)
                setDate(calculateDefaultTime(props.route.params.request.datetime));
            } else {
                // setDate(calculateDefaultTime(MIN_DATE))
            }
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

  //isPickerShow, cuisinePreference, loading, distance, date, errorMsg, location

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', async() => {
        setDate(calculateDefaultTime(new Date()))
    })
    return unsubscribe;
  }, [navigation])

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
    if (value == null) {

    } else {
        setDate(value);
    }
    setDateSelected(true)
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
      return CUISINES.map(cuisine => (<Picker.Item label={cuisine} value={cuisine} key={cuisineID++} color={themes.oppositeTheme(isLight)}/>))
  };

  const renderDistances = () => {
    const distances = [1, 2, 5, 10, 200];
    let distanceID = 0;

    return distances.map(distance => (<Picker.Item label={distance == 200 ? 'No Preference' : `${distance} km`} value={distance} key={distanceID++} color={themes.oppositeTheme(isLight)}/>))
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
        let gobbleRequest;
        if(props.route.params) {
            gobbleRequest = {...props.route.params.request, datetime: date.toString(), distance: distance, cuisinePreference: cuisinePreference}
            firebaseSvc.deleteAwaitingRequest(props.route.params.request)
        } else {
            gobbleRequest = {
                userId: firebaseSvc.currentUser().uid,
                dietaryRestriction: props.currentUserData.diet,
                industryPreference: props.currentUserData.crossIndustrial ? 12 : props.currentUserData.industry,
                industry: props.currentUserData.industry,
                cuisinePreference: cuisinePreference,
                datetime: date.toString(),
                location: location,
                distance: distance,
            }
        }
        let result =  await firebaseSvc.findGobbleMate(gobbleRequest);
        // We need to do some load page
        props.route.params ? props.navigation.navigate('BottomTabs', { screen: 'GobbleNavigator', params: { screen: 'GobbleConfirm', params: {result: result}} }) : props.navigation.navigate('GobbleConfirm')
      }
  }

  const topMargin = Platform.OS === 'ios' ? '2%':'12%';

  const handleConfirm = (date) => {
    setDate(date);
    hideDatePicker();
  };
    return (
        <SafeAreaView style={[{flex: 1}, themes.containerTheme(isLight)]}>
            <View style={{marginTop: topMargin}}>
                        <Text style={[{...inputStyles.headerText, fontSize: 20, marginHorizontal: '2%', marginBottom: '5%', fontWeight: '800'}, themes.textTheme(isLight)]}>
                                Select your preferences and Gobble!
                        </Text>
            </View>  
            <ScrollView>
            <View>
                        <Text style={[{...inputStyles.subHeader, marginTop: '0%', }, themes.textTheme(isLight)]}>Pick out your preferred Date & Time</Text>
                        <TouchableOpacity 
                            style={{alignSelf:'center'}}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                                showPicker();}}>
                            <Text style={themes.textTheme(isLight)}>{`Chosen: ${dateStringMaker(date.toString())} ${'\n'}Click me to ${pickerText()}`} </Text>
                        </TouchableOpacity>
                        
                        {/* The date picker */}
                        {isPickerShow && (
                            <DateTimePicker
                            value={date}
                            mode={'datetime'}
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            is24Hour={true}
                            onChange={onChange}
                            style={specificStyles.datePicker}
                            maximumDate={MAX_DATE}
                            minimumDate={MIN_DATE}
                            minuteInterval={15}
                            />
                        )}
            </View>
            <View style={{...specificStyles.container, marginTop: '7%'}}>
                    {!isPickerShow && <Text style={[{...inputStyles.subHeader, marginTop: '0%',}, themes.textTheme(isLight)]}>What are you in the mood for today?</Text>}
                    {!isPickerShow && <Picker
                        selectedValue={cuisinePreference}
                        onValueChange={(itemValue, itemIndex) => setCuisinePreference(itemValue)}>
                        {renderCuisines()}
                    </Picker>}
            </View>
            <View style={{...specificStyles.container, marginTop: '7%'}}>
                    {!isPickerShow && <Text style={[{...inputStyles.subHeader, marginTop: '0%',}, themes.textTheme(isLight)]}>How far are you willing to travel for a meal?</Text>}
                    {!isPickerShow &&
                        <Picker
                        selectedValue={distance}
                        onValueChange={(itemValue, itemIndex) => setDistance(itemValue)}>
                        {renderDistances()}
                    </Picker>}
            </View>
            </ScrollView>
            <View style={{marginTop: '3%', marginBottom: '2%'}}>
                {!isPickerShow && <TouchableOpacity style={[{...styles.longButton, marginTop: '0%'}, themes.buttonTheme(isLight)]} 
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                        submitGobble();
                        }}>
                    <Text style={[buttonStyles.loginButtonText, themes.textTheme(!isLight)]}>{props.route.params ? `Edit Gobble` : `Submit Gobble`}</Text>
                </TouchableOpacity>}
            </View>
        </SafeAreaView>
    )
}

const specificStyles = StyleSheet.create({
    pickedDateContainer: {
        padding: 20,
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