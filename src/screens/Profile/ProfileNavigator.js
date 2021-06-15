import React from 'react'
import {View, Text} from 'react-native'
import {containerStyles} from '../../styles/LoginStyles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, clearData } from '../../redux/actions/actions'
import {createStackNavigator} from '@react-navigation/stack'
import {Profile} from './Profile'
import UpdateProfile from './UpdateProfile'


const Stack = createStackNavigator();

export function ProfileNavigator() {
    return (
        <Stack.Navigator initialRouteName="Profile"
        headerMode={'none'}>
            <Stack.Screen name="Profile" component={Profile}></Stack.Screen>
            <Stack.Screen name="UpdateProfile" component={UpdateProfile}></Stack.Screen>
        </Stack.Navigator>
    )
}