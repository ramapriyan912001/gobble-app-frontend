
import React, {useEffect, useState, useCallback} from 'react'
import {Text, Image, TouchableOpacity, SafeAreaView, Alert, View, Button, ScrollView} from 'react-native'
import {StatusBar} from 'expo-status-bar'
import {inputStyles, buttonStyles, profileStyles, containerStyles} from '../styles/LoginStyles'
import { getError, onSuccess, onFailure } from '../services/RegistrationHandlers'
import firebaseSvc from '../firebase/FirebaseSvc'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAuthUser, fetchUserData } from '../redux/actions/actions'
import { INDUSTRY_CODES } from '../constants/objects'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Avatar } from 'react-native-elements'
import AboutPerson from './AboutPerson'
import PreviousMatches from './PreviousMatches'
const Tab = createMaterialTopTabNavigator();

/**
 * User Profile Page
 * 
 * @param {*} props Props from previous screen
 * @returns Profile Render Method
 */
function otherProfile(props) {

    const [userData, setUserData] = useState({})
    // Expecting an id to be passed over
    const [otherUserID, setOtherUserID] = useState('')
    
    function getAge(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    /**
     * Asynchronous FUnction to load Profile Data
     */
    async function loadDataAsync () {
        try {
            setOtherUserID(props.route.params.id)
            let data = await firebaseSvc.getUserCollection(otherUserID, onSuccess("other user loaded"), onFailure("otherUser not loaded"))
            setUserData(data);
            if (userData === null) {
                props.navigation.goBack();
            }
        } catch (err) {
            console.log('Profile Fetch User Error:', err.message);
        }
    }

    useEffect(() => {
        loadDataAsync();
    },[]);

    return(
        <SafeAreaView style={{flex: 1}}>
            <ScrollView contentContainerStyle={{paddingBottom:'5%'}}>
            <StatusBar style="auto"/>
            <Image style={{...profileStyles.profilePic, width: 120, height: 125, marginTop: '10%', marginBottom: '0%', borderRadius: 60}}  source={{uri: userData.avatar}}/>
            <Text style={{...inputStyles.headerText, fontWeight:'400', marginBottom: '0%',fontSize: 26}}>{`${userData.name}, ${getAge(userData.dob)}`}</Text>
            <Text style={{...inputStyles.headerText, fontWeight: '300', marginBottom: '2%',fontSize: 16}}>{`${INDUSTRY_CODES[userData.industry]}`}</Text>
            <Tab.Navigator initialRouteName="Ongoing" style={{marginTop: '0%',paddingTop:'0%', backgroundColor:'white'}}>
            <Tab.Screen name="About" initialParams={{otherUser: userData}} component={AboutPerson} />
            <Tab.Screen name="History" initialParams={{otherUser: userData}} component={PreviousMatches} />
            </Tab.Navigator>
            </ScrollView>

        </SafeAreaView>
    );  
}

const mapStateToProps = (store) => ({
    currentUserData: store.userState.currentUserData,
    loggedIn: store.userState.loggedIn,
    isAdmin: store.userState.isAdmin
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchAuthUser, fetchUserData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(otherProfile);