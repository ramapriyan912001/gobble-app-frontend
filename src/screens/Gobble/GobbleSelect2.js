import React, {useEffect, useState} from 'react'
import {Platform, View, Text, Button, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Dimensions} from 'react-native'
import * as Location from 'expo-location'
import {containerStyles, buttonStyles, inputStyles} from '../../styles/LoginStyles'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {Picker} from '@react-native-picker/picker';
import firebaseSvc from '../../firebase/FirebaseSvc';
import {fetchUserData, updateUserDetails, clearData} from '../../redux/actions/actions'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import { StatusBar } from 'expo-status-bar';
import SearchBox from '../../components/SearchBox';
import DestinationSearch from '../../components/DestinationSearch';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native-appearance';
import themes from '../../styles/Themes';
import {styles} from '../../styles/RegisterStyles';
import Loader from 'react-native-three-dots-loader';

/**
 * Final Page before submitting a new Match Request
 * 
 * @param {*} props Props from previous screen
 * @returns GobbleSelect2 Render Method
 */
export default function GobbleSelect2(props) {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === 'light';
  const [loading, setLoading] = useState(false);

  /**
   * Asynchronously submits a new match request
   */
  async function submitGobble(request) {
    setLoading(true);
    // try {
      if(props.route.params.edit) {
        await firebaseSvc.deleteAwaitingRequest(props.route.params.oldRequest)
      }
      let response =  await firebaseSvc.findGobbleMate(request);
    // } catch (err) {
    //   console.log('GOBBLE SUBMIT ERROR: ', err.message);
    //   Alert.alert('Error', 'Try again');
    // }
    props.navigation.navigate('BottomTabs', { screen: 'GobbleNavigator', params: { screen: 'GobbleConfirm', params: {result: response}} });
  }

  if (loading) {
    return (
      <SafeAreaView style={[{flex: 1, justifyContent: 'center', alignItems: 'center', alignContent: 'center'}, themes.containerTheme(isLight)]}>
        <Loader background={themes.editTheme(isLight)} activeBackground={themes.oppositeTheme(isLight)}/>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={[styles.container, themes.containerTheme(isLight)]}>
        <Text style={[inputStyles.headerText, themes.textTheme(isLight)]}>Verify your Gobble!</Text>
        <Text style={[{fontSize:17, fontWeight:'bold'},themes.textTheme(isLight)]}>Your Preferred Cuisine is</Text>
        <Text style={[inputStyles.detailText, themes.textTheme(isLight)]}>{`${props.route.params.request.cuisinePreference}`}</Text>
        <Text style={[{fontSize:17, marginTop:'6%', fontWeight:'bold'},themes.textTheme(isLight)]}>At</Text>
        <Text style={[inputStyles.detailText, themes.textTheme(isLight)]}>{`${props.route.params.request.datetime.slice(0,21)}`}</Text>
        <Text style={[{fontSize:17, marginTop:'6%', fontWeight:'bold'},themes.textTheme(isLight)]}>Within</Text>
        <Text style={[inputStyles.detailText, themes.textTheme(isLight)]}>{`${props.route.params.request.distance} km`}</Text>
        <Text style={[{fontSize:17, marginTop:'6%', fontWeight:'bold'},themes.textTheme(isLight)]}>Around</Text>
        <Text style={[inputStyles.detailText, themes.textTheme(isLight)]}>{`${props.route.params.description}`}</Text>
        <View style={{marginTop:'5%', width: '100%'}}>
          <TouchableOpacity 
            style={[themes.buttonTheme(isLight), styles.longButton]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
            let request = props.route.params.request
            submitGobble(request);
          }}>
            <Text style={themes.textTheme(!isLight)}>Confirm Gobble!</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[themes.buttonTheme(isLight), styles.longButton]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
            props.navigation.goBack();
          }}>
            <Text style={themes.textTheme(!isLight)}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}