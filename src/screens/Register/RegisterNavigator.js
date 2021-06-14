import React from 'react'
import {View, Text} from 'react-native'
import {containerStyles} from '../../styles/LoginStyles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, clearData } from '../../actions/index'
import {createStackNavigator} from '@react-navigation/stack'
import RegisterPage2 from './RegisterPage2'
import RegisterPage3 from './RegisterPage4'
import register from './Register'


const Stack = createStackNavigator();

export default function RegisterNavigator() {
    return (
        <Stack.Navigator initialRouteName="Register">
            <Stack.Screen name="Register" component={register}></Stack.Screen>
            <Stack.Screen name="RegisterPage2" component={RegisterPage2}></Stack.Screen>
            <Stack.Screen name="RegisterPage3" component={RegisterPage3}></Stack.Screen>
            <Stack.Screen name="RegisterPage4" component={RegisterPage3}></Stack.Screen>
        </Stack.Navigator>
    )
}