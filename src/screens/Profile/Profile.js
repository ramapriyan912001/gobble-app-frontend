
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
import MealPreferences from '../MealPreferences'
const Tab = createMaterialTopTabNavigator();

function Profile(props) {

    const [userInfo, setUserInfo] = useState({});
    const [hasAvatar, setHasAvatar] = useState(false);
    const [age, setAge] = useState(getAge(props.currentUserData.dob))

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
 
    const loadPic = () => hasAvatar
                            ? (<Image style={{...profileStyles.profilePic, width: 120, height: 125, marginTop: '10%', marginBottom: '0%', borderRadius: 60}}  source={{uri: userInfo.avatar}}/>)
                            : (<Image style={{...profileStyles.profilePic, width: 120, height: 125, marginTop: '10%', marginBottom: '0%', borderRadius: 60}} resizeMode='center' source={{uri: 'https://firebasestorage.googleapis.com/v0/b/gobble-b3dfa.appspot.com/o/avatar%2Fempty_avatar.png?alt=media&token=c36c29b3-d90b-481f-a9d9-24bc73619ddc'}}/>)

    async function loadDataAsync () {
        const user = await firebaseSvc
                            .getCurrentUserCollection(
                                (snapshot) => snapshot.val(),
                                getError(props))
                            .then(x => x)
                            .catch(getError(props));
        setUserInfo(user);
        await props.fetchUserData();
        if (userInfo === null) {
            props.navigation.goBack();
        } else if (userInfo.avatar == null || userInfo.avatar === '') {
            //Do Nothing
        } else {
            console.log(userInfo.avatar);
            setHasAvatar(true);
        }
    }

    useEffect(() => {
        loadDataAsync();
    },[]);

    // if (!appIsReady) {//effect loads data, NO WARNINGS !! :)
    //     return null;
    // }

    return(
        <SafeAreaView style={{flex: 1}}>
            <ScrollView contentContainerStyle={{paddingBottom:'5%'}}>
            <StatusBar style="auto"/>
            {loadPic()}
            <Text style={{...inputStyles.headerText, fontWeight:'400', marginBottom: '0%',fontSize: 26}}>{`${props.currentUserData.name}, ${age}`}</Text>
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

{/* <Text style={profileStyles.profileField}>Your dietary restriction is {userInfo.diet}</Text>
            <Text style={profileStyles.profileField}>Your favorite cuisine is {userInfo.cuisine}</Text>
            <Text style={profileStyles.profileField}>You work in the {INDUSTRY_CODES[userInfo.industry]} industry</Text>
            <Text style={profileStyles.profileField}>Cross-Industrial meetings? {userInfo.crossIndustry?'Sure!':'Nope!'}</Text>           
            <Text style={profileStyles.profileField}>{userInfo.email}</Text> */}
{/* <TouchableOpacity style={buttonStyles.loginButton} onPress={() => props.navigation.navigate('UpdateProfile', {name: userInfo.name, email: userInfo.email})}>
                <Text style={buttonStyles.loginButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buttonStyles.loginButton} onPress={() => {
                signOutUser();
                props.navigation.navigate('Login')}}>
                <Text style={buttonStyles.loginButtonText}>Sign Out</Text>
            </TouchableOpacity> */}