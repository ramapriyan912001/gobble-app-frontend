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
import MapSelect from '../../components/MapSelect';
import SearchBox from '../../components/SearchBox';
import DestinationSearch from '../../components/DestinationSearch';

/**
 * Final Page before submitting a new Match Request
 * 
 * @param {*} props Props from previous screen
 * @returns GobbleSelect2 Render Method
 */
export default function GobbleSelect2(props) {
  /**
   * Asynchronously submits a new match request
   */
  async function submitGobble(request) {
      if(props.route.params.edit) {
        await firebaseSvc.deleteAwaitingRequest(props.route.params.oldRequest)
      }
      let result =  await firebaseSvc.findGobbleMate(request);
      console.log(result)
      // We need to do some load page
      props.navigation.navigate('BottomTabs', { screen: 'GobbleNavigator', params: { screen: 'GobbleConfirm', params: {result: result}} })
  }

    return (
        <View style={styles.container}>
          <Text style={inputStyles.headerText}>Confirm your Gobble!</Text>
          <Text>{`${props.route.params.request.cuisinePreference}`}</Text>
          <Text>{`${props.route.params.request.datetime}`}</Text>
          <Text>{`${props.route.params.request.distance} km`}</Text>
          <Text>{`${props.route.params.description}`}</Text>
          <View>
            <TouchableOpacity onPress={() => {
              console.log(props.route.params.request)
              let request = props.route.params.request
              submitGobble(request);
            }}>
              <Text>Confirm Gobble!</Text>
            </TouchableOpacity>
          </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '0%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})