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

    return (
        <View style={styles.container}>
          <View style={{height: Dimensions.get('window').height*0.7, width: '100%'}}>
            <MapSelect></MapSelect>
          </View>
          <SearchBox></SearchBox>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '-8%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})