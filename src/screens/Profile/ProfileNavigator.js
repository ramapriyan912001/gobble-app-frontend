import React from 'react'
import {View, Text} from 'react-native'
import {containerStyles} from '../../styles/LoginStyles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAuthUser, clearData } from '../../redux/actions/actions'
import {createStackNavigator} from '@react-navigation/stack'
import Profile from './Profile'
import UpdateProfile from './UpdateProfile'
import RegisterPage2 from '../Register/RegisterPage2'
import RegisterPage3 from '../Register/RegisterPage3'
import RegisterPage4 from '../Register/RegisterPage4'


const Stack = createStackNavigator();

/**
 * Navigate between Profile and Update Profile Screens
 * 
 * @returns The Stack Navigator for the Profile Pages
 */
export function ProfileNavigator() {
    return (
        <Stack.Navigator initialRouteName="Profile"
        headerMode={'none'}>
            <Stack.Screen name="Profile" component={Profile}></Stack.Screen>
            <Stack.Screen name="RegisterPage2" component={RegisterPage2}></Stack.Screen>
        </Stack.Navigator>
    )
}