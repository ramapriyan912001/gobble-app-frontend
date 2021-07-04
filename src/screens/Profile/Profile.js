
import React, {useEffect, useState, useCallback} from 'react'
import {Text, Image, TouchableOpacity, SafeAreaView, Alert, View, Button, ScrollView} from 'react-native'
import {StatusBar} from 'expo-status-bar'
import {inputStyles, buttonStyles, profileStyles, containerStyles} from '../../styles/LoginStyles'
import { getError, onSuccess, onFailure } from '../../services/RegistrationHandlers'
import firebaseSvc from '../../firebase/FirebaseSvc'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAuthUser, fetchUserData } from '../../redux/actions/actions'
import { INDUSTRY_CODES } from '../../constants/objects'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PersonalDetails from '../PersonalDetails'
import { Avatar } from 'react-native-elements'
import MealPreferences from '../MealPreferences'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Header } from 'react-native-elements'
import { DrawerActions } from '@react-navigation/native';

// props.navigation.dispatch(DrawerActions.closeDrawer());


const Tab = createMaterialTopTabNavigator();

/**
 * User Profile Page
 * 
 * @param {*} props Props from previous screen
 * @returns Profile Render Method
 */
function Profile(props) {

    const [userInfo, setUserInfo] = useState({});
    
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
            await props.fetchUserData();
            setUserInfo(props.currentUserData);
            if (userInfo === null) {
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
            <TouchableOpacity onPress={() => props.navigation.dispatch(DrawerActions.openDrawer)}>
                <Ionicons name="menu-outline" style={{alignSelf: 'flex-start', marginLeft: '5%'}} size={30}></Ionicons>
            </TouchableOpacity>
            <Image style={{...profileStyles.profilePic, width: 120, height: 125, marginTop: '10%', marginBottom: '0%', borderRadius: 60}}  source={{uri: props.currentUserData.avatar}}/>
            <Text style={{...inputStyles.headerText, fontWeight:'400', marginBottom: '0%',fontSize: 26}}>{`${props.currentUserData.name}, ${getAge(props.currentUserData.dob)}`}</Text>
            <Text style={{...inputStyles.headerText, fontWeight: '300', marginBottom: '2%',fontSize: 16}}>{`${INDUSTRY_CODES[props.currentUserData.industry]}`}</Text>
            <Tab.Navigator initialRouteName="Ongoing" style={{marginTop: '0%',paddingTop:'0%', backgroundColor:'white'}}>
            <Tab.Screen name="Personal Details" component={PersonalDetails} />
            <Tab.Screen name="Meal Preferences" component={MealPreferences} />
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
export default connect(mapStateToProps, mapDispatchProps)(Profile);
