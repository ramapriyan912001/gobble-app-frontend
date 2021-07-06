
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
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native-appearance';
import themes from '.././styles/Themes';
import {styles} from '.././styles/ProfileStyles';

/**
 * User Profile Page
 * 
 * @param {*} props Props from previous screen
 * @returns Profile Render Method
 */
function otherProfile(props) {
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';
    const [userData, setUserData] = useState({})
    const [loading, setLoading] = useState(true)
    // Expecting an id to be passed over
    const [otherUserID, setOtherUserID] = useState(props.route.params.otherUserID)
    
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
            // setOtherUserID(props.route.params.id)
            let data = await firebaseSvc.getUserCollection(otherUserID, snapshot => snapshot.val(), onFailure('otherUser Loading Error'))
            setUserData(data);
            if (userData == null) {
                props.navigation.goBack();
            }
            setLoading(false);
        } catch (err) {
            console.log('Profile Fetch User Error:', err.message);
        }
    }

    const buttonMargins = Platform.OS === 'ios' ? '7.5%' : '10%';

    useEffect(() => {
        loadDataAsync();
    },[]);

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, themes.containerTheme(isLight)]}>
                <Text style={[themes.textTheme(isLight), {fontSize:25, fontWeight:'bold', alignSelf:'center'}]}>Loading...</Text>
            </SafeAreaView>
        );
    } else {
        return(
            <SafeAreaView style={[styles.container, themes.containerTheme(isLight)]}>
                <ScrollView contentContainerStyle={{paddingBottom:'5%'}}>
                <StatusBar style="auto"/>
                <Image style={{...profileStyles.profilePic, width: 120, height: 125, marginTop: '10%', marginBottom: '0%', borderRadius: 60}}  source={{uri: userData.avatar}}/>
                <Text style={[{...inputStyles.headerText, fontWeight:'400', marginBottom: '0%',fontSize: 26}, themes.textTheme(isLight)]}>{`${userData.name}, ${getAge(userData.dob)}`}</Text>
                <Text style={[{...inputStyles.headerText, fontWeight: '300', marginBottom: '2%',fontSize: 16}, themes.textTheme(isLight)]}>{`${INDUSTRY_CODES[userData.industry]}`}</Text>
                <Tab.Navigator initialRouteName="Ongoing" 
                style={{
                    marginTop: '0%',
                    paddingTop:'0%',
                    backgroundColor:themes.oppositeTheme(!isLight)
                    }}
                tabBarOptions={{
                    activeTintColor:themes.oppositeTheme(isLight),
                    inactiveTintColor:themes.editTheme(!isLight),
                    style: {
                        backgroundColor:'transparent',
                        borderColor: 'transparent'
                    }}}
                >
                <Tab.Screen name="About" initialParams={{otherUser: userData}} component={AboutPerson} />
                <Tab.Screen name="History" initialParams={{otherUser: userData}} component={PreviousMatches} />
                </Tab.Navigator>
                </ScrollView>
    
            </SafeAreaView>
        );
    }  
}

const mapStateToProps = (store) => ({
    currentUserData: store.userState.currentUserData,
    loggedIn: store.userState.loggedIn,
    isAdmin: store.userState.isAdmin
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchAuthUser, fetchUserData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(otherProfile);