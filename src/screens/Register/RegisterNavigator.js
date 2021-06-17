import React from 'react'
import {View, Text} from 'react-native'
import {containerStyles} from '../../styles/LoginStyles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAuthUser, clearData } from '../../redux/actions/actions'
import {createStackNavigator} from '@react-navigation/stack'
import register from './Register'
import RegisterPage2 from './RegisterPage2'
import RegisterPage3 from './RegisterPage3'
import RegisterPage4 from './RegisterPage4'
import RegisterPage5 from './RegisterPage5'


const Stack = createStackNavigator();

export default function RegisterNavigator() {
    return (
        <Stack.Navigator initialRouteName="Register">
            <Stack.Screen name="Register" component={register}></Stack.Screen>
            <Stack.Screen name="RegisterPage2" component={RegisterPage2}></Stack.Screen>
            <Stack.Screen name="RegisterPage3" component={RegisterPage3}></Stack.Screen>
            <Stack.Screen name="RegisterPage4" component={RegisterPage4}></Stack.Screen>
            <Stack.Screen name="RegisterPage5" component={RegisterPage5}></Stack.Screen>
        </Stack.Navigator>
    )
}